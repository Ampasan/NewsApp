import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NewsCard } from "../../components/NewsCard";
import { useBookmarks } from "../../context/BookmarksContext";
import { useAppTheme } from "../../context/ThemeContext";
import { useNews } from "../../hooks/useNews";
import { useNewsSearch } from "../../hooks/useSearch";
import { newsService, Category } from "../../services/newsService";
import { shareArticle } from "../../services/shareService";
import { Article } from "../../types/article";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Umum", value: "general" },
  { label: "Teknologi", value: "technology" },
  { label: "Olahraga", value: "sports" },
  { label: "Bisnis", value: "business" },
  { label: "Kesehatan", value: "health" },
];

type DateRange = "all" | "1d" | "7d" | "30d";

const DATE_FILTERS: { label: string; value: DateRange }[] = [
  { label: "Semua", value: "all" },
  { label: "24 Jam", value: "1d" },
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
];

export default function HomeScreen() {
  const [category, setCategory] = useState<Category>("general");
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { scheme } = useAppTheme();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNews(category);
  const headlineArticles = useMemo(
    () => data?.pages.flatMap((p) => p.articles) ?? [],
    [data],
  );

  const searchQuery = useNewsSearch(query, category);
  const fallbackNewsQuery = useQuery({
    queryKey: ["fallback-news", category],
    queryFn: () =>
      newsService.searchArticles(`indonesia ${category === "general" ? "berita" : category}`),
    staleTime: 2 * 60 * 1000,
  });
  const sourcesQuery = useQuery({
    queryKey: ["sources", category],
    queryFn: () => newsService.getSources(category),
    staleTime: 60 * 60 * 1000,
  });

  const isSearchActive = searchQuery.debouncedQuery.length >= 3;
  const allArticles = useMemo(
    () =>
      isSearchActive
        ? (searchQuery.data?.articles ?? [])
        : headlineArticles.length > 0
          ? headlineArticles
          : (fallbackNewsQuery.data?.articles ?? []),
    [
      fallbackNewsQuery.data?.articles,
      headlineArticles,
      isSearchActive,
      searchQuery.data?.articles,
    ],
  );

  const filteredArticles = useMemo(() => {
    const now = Date.now();
    const rangeMs =
      dateRange === "1d"
        ? 24 * 60 * 60 * 1000
        : dateRange === "7d"
          ? 7 * 24 * 60 * 60 * 1000
          : dateRange === "30d"
            ? 30 * 24 * 60 * 60 * 1000
            : null;

    return allArticles.filter((article) => {
      const normalizedSelectedSource = sourceFilter.trim().toLowerCase();
      const normalizedArticleSource = (article.source?.name ?? "").trim().toLowerCase();
      const sourceMatch =
        normalizedSelectedSource === "all" ||
        normalizedArticleSource === normalizedSelectedSource;
      if (!sourceMatch) return false;

      if (!rangeMs) return true;
      const publishedAt = new Date(article.publishedAt).getTime();
      return !Number.isNaN(publishedAt) && now - publishedAt <= rangeMs;
    });
  }, [allArticles, sourceFilter, dateRange]);

  useEffect(() => {
    setSourceFilter("all");
  }, [category, query]);

  const isInitialLoading =
    (isSearchActive && searchQuery.isLoading) ||
    (!isSearchActive && isLoading && headlineArticles.length === 0) ||
    (!isSearchActive &&
      !isLoading &&
      headlineArticles.length === 0 &&
      fallbackNewsQuery.isLoading);
  const finalError = (
    isSearchActive
      ? searchQuery.error
      : headlineArticles.length > 0
        ? error
        : (error ?? fallbackNewsQuery.error)
  ) as
    | Error
    | null
    | undefined;
  const hasError = isSearchActive
    ? searchQuery.isError
    : headlineArticles.length > 0
      ? isError
      : isError && fallbackNewsQuery.isError;

  const onShare = async (article: Article) => {
    await shareArticle(article);
  };

  const sources = useMemo(() => {
    const apiSources = (sourcesQuery.data ?? [])
      .map((src: { name?: string }) => src.name)
      .filter(Boolean) as string[];
    const articleSources = allArticles
      .map((article) => article.source?.name)
      .filter(Boolean) as string[];
    return ["all", ...Array.from(new Set([...apiSources, ...articleSources]))];
  }, [allArticles, sourcesQuery.data]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: scheme === "dark" ? "#020617" : "#F8FAFC" }]}>
      <Text style={[styles.title, { color: scheme === "dark" ? "#F8FAFC" : "#0F172A" }]}>BeritaApp</Text>
      <TextInput
        placeholder="Cari berita (min. 3 karakter)"
        value={query}
        onChangeText={setQuery}
        style={[
          styles.searchInput,
          {
            backgroundColor: scheme === "dark" ? "#0F172A" : "#FFFFFF",
            color: scheme === "dark" ? "#F8FAFC" : "#0F172A",
            borderColor: scheme === "dark" ? "#334155" : "#E2E8F0",
          },
        ]}
        placeholderTextColor={scheme === "dark" ? "#94A3B8" : "#64748B"}
      />

      <View style={styles.filtersSection}>
        <FlatFilter
          items={CATEGORIES.map((item) => ({ ...item, value: item.value as string }))}
          selected={category}
          onChange={(value) => setCategory(value as Category)}
        />
        <FlatFilter
          items={sources.map((value) => ({
            label: value === "all" ? "Semua Sumber" : value,
            value,
          }))}
          selected={sourceFilter}
          onChange={setSourceFilter}
        />
        <FlatFilter items={DATE_FILTERS} selected={dateRange} onChange={(v) => setDateRange(v as DateRange)} />
      </View>

      {isInitialLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : hasError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{finalError?.message ?? "Terjadi kesalahan"}</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              onPress={() => Linking.openURL(item.url)}
              onShare={() => onShare(item)}
              onBookmark={() => toggleBookmark(item)}
              isBookmarked={isBookmarked(item.url)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isInitialLoading}
              onRefresh={() => {
                refetch();
                fallbackNewsQuery.refetch();
              }}
            />
          }
          onEndReached={() => !isSearchActive && hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.2}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada berita untuk filter ini.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

function FlatFilter({
  items,
  selected,
  onChange,
}: {
  items: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const { scheme } = useAppTheme();
  const isDark = scheme === "dark";

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.value}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: isDark ? "#1E293B" : "#E2E8F0",
              borderColor: isDark ? "#334155" : "#CBD5E1",
            },
            selected === item.value && styles.filterChipActive,
          ]}
          onPress={() => onChange(item.value)}
        >
          <Text
            style={[
              styles.filterText,
              { color: isDark ? "#CBD5E1" : "#334155" },
              selected === item.value && styles.filterTextActive,
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  title: { fontSize: 24, fontWeight: "700", marginHorizontal: 16, marginTop: 12, marginBottom: 8 },
  searchInput: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  filtersSection: { marginBottom: 10 },
  filterContainer: { paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: { backgroundColor: "#0284C7", borderColor: "#0284C7" },
  filterText: { fontSize: 13, lineHeight: 18, fontWeight: "700", includeFontPadding: false },
  filterTextActive: { color: "white" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#B91C1C", marginBottom: 10 },
  retryBtn: { backgroundColor: "#0EA5E9", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  retryText: { color: "white", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#64748B", marginTop: 24 },
});

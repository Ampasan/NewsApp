import React from "react";
import { FlatList, Linking, SafeAreaView, StyleSheet, Text } from "react-native";
import { NewsCard } from "../../components/NewsCard";
import { useBookmarks } from "../../context/BookmarksContext";
import { useAppTheme } from "../../context/ThemeContext";
import { shareArticle } from "../../services/shareService";

export default function BookmarksScreen() {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { scheme } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: scheme === "dark" ? "#020617" : "#F8FAFC" }]}>
      <Text style={[styles.title, { color: scheme === "dark" ? "#F8FAFC" : "#0F172A" }]}>Bookmarks</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={() => Linking.openURL(item.url)}
            onShare={() => shareArticle(item)}
            onBookmark={() => toggleBookmark(item)}
            isBookmarked={isBookmarked(item.url)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: scheme === "dark" ? "#94A3B8" : "#64748B" }]}>
            Belum ada artikel disimpan.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  title: { fontSize: 24, fontWeight: "700", marginHorizontal: 16, marginVertical: 12 },
  empty: { marginTop: 24, textAlign: "center", color: "#64748B" },
});

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";
import { Article } from "../types/article";

interface NewsCardProps {
  article: Article;
  onPress: () => void;
  onBookmark: () => void;
  onShare?: () => void;
  isBookmarked: boolean;
}

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/400x200.png?text=No+Image";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

export function NewsCard({
  article,
  onPress,
  onBookmark,
  onShare,
  isBookmarked,
}: NewsCardProps) {
  const { scheme } = useAppTheme();
  const isDark = scheme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderColor: isDark ? "#334155" : "transparent",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: article.urlToImage || PLACEHOLDER_IMAGE }}
        style={[
          styles.image,
          { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" },
        ]}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.content}>
        <View style={styles.sourceBadge}>
          <Text style={styles.source}>{article.source?.name || "Unknown"}</Text>
          <Text style={[styles.date, { color: isDark ? "#94A3B8" : "#64748B" }]}>
            {formatDate(article.publishedAt)}
          </Text>
        </View>

        <Text
          style={[styles.title, { color: isDark ? "#F8FAFC" : "#0F172A" }]}
          numberOfLines={2}
        >
          {article.title || "No Title"}
        </Text>

        {article.description ? (
          <Text
            style={[
              styles.description,
              { color: isDark ? "#CBD5E1" : "#475569" },
            ]}
            numberOfLines={3}
          >
            {article.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-social-outline"
            size={20}
            color={isDark ? "#CBD5E1" : "#334155"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isBookmarked ? "#0891B2" : "#94A3B8"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    borderWidth: 1,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#E2E8F0",
  },

  content: {
    padding: 12,
  },

  sourceBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  source: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0891B2",
  },

  date: {
    fontSize: 11,
    color: "#64748B",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  actionRow: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

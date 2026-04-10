import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Article } from "../types/article";

const BOOKMARKS_KEY = "newsapp.bookmarks";

type BookmarksContextValue = {
  bookmarks: Article[];
  isLoading: boolean;
  isBookmarked: (url: string) => boolean;
  toggleBookmark: (article: Article) => Promise<void>;
};

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
        if (stored) setBookmarks(JSON.parse(stored));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const saveBookmarks = async (next: Article[]) => {
    setBookmarks(next);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  };

  const toggleBookmark = async (article: Article) => {
    const exists = bookmarks.some((item) => item.url === article.url);
    const next = exists
      ? bookmarks.filter((item) => item.url !== article.url)
      : [article, ...bookmarks];
    await saveBookmarks(next);
  };

  const value = useMemo<BookmarksContextValue>(
    () => ({
      bookmarks,
      isLoading,
      isBookmarked: (url) => bookmarks.some((item) => item.url === url),
      toggleBookmark,
    }),
    [bookmarks, isLoading],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used inside BookmarksProvider");
  }
  return context;
}

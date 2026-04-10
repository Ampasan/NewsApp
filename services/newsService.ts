import api from "./api";
import { Article } from "../types/article";

export type Category =
  | "general"
  | "technology"
  | "sports"
  | "business"
  | "health";
export const newsService = {
  getTopHeadlines: async (category: Category = "general", page = 1) => {
    const { data } = await api.get("/top-headlines", {
      params: { country: "id", category, page, pageSize: 10 },
    });
    return {
      articles: (data.articles ?? []) as Article[],
      totalResults: (data.totalResults ?? 0) as number,
    };
  },
  searchArticles: async (
    query: string,
    page = 1,
    filters?: { source?: string; from?: string; to?: string },
  ) => {
    const { data } = await api.get("/everything", {
      params: {
        q: query,
        language: "id",
        sortBy: "publishedAt",
        page,
        pageSize: 10,
        ...(filters?.source && { sources: filters.source }),
        ...(filters?.from && { from: filters.from }),
        ...(filters?.to && { to: filters.to }),
      },
    });
    return {
      articles: (data.articles ?? []) as Article[],
      totalResults: (data.totalResults ?? 0) as number,
    };
  },
  getSources: async (category?: Category) => {
    const { data } = await api.get("/top-headlines/sources", {
      params: { country: "id", category },
    });
    return data.sources;
  },
};

import { useInfiniteQuery } from "@tanstack/react-query";
import { Category, newsService } from "../services/newsService";

export const useNews = (category: Category) => {
  return useInfiniteQuery({
    queryKey: ["news", category],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getTopHeadlines(category, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, p) => sum + p.articles.length,
        0,
      );
      if (totalFetched >= lastPage.totalResults) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { newsService } from "../services/newsService";
import { Category } from "../services/newsService";

export const useNewsSearch = (query: string, category: Category) => {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const searchRequest = useQuery({
    queryKey: ["search", debouncedQuery, category],
    queryFn: () =>
      newsService.searchArticles(
        category === "general" ? debouncedQuery : `${debouncedQuery} ${category}`,
      ),
    enabled: debouncedQuery.length >= 3,
    staleTime: 2 * 60 * 1000,
  });

  return { ...searchRequest, debouncedQuery };
};

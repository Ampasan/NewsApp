import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Article } from "../types/article";

export async function shareArticle(article: Article) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) return false;

  const safeTitle = (article.title || "news")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase()
    .slice(0, 32);
  const file = new File(Paths.cache, `${safeTitle || "news"}.txt`);
  const content = `${article.title}\n\n${article.description ?? ""}\n\n${article.url}`;

  file.write(content);

  await Sharing.shareAsync(file.uri, {
    mimeType: "text/plain",
    dialogTitle: "Bagikan artikel",
  });

  return true;
}

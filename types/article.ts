export interface Article {
  title: string;
  description?: string;
  content?: string;
  author?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    id?: string;
    name?: string;
  };
}

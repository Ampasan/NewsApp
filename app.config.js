import 'dotenv/config';

export default {
  expo: {
    name: 'BeritaApp',
    slug: 'berita-app',
    extra: {
      newsApiKey: process.env.NEWS_API_KEY,
      newsApiBaseUrl: process.env.NEWS_API_BASE_URL,
    },
  },
};
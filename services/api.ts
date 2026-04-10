import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";

const baseURL = Constants.expoConfig?.extra?.newsApiBaseUrl;
const apiKey = Constants.expoConfig?.extra?.newsApiKey;

if (!baseURL) {
  console.warn("Base URL belum diset di app.config.js");
}
if (!apiKey) {
  console.warn("API KEY belum diset di .env");
}

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    config.params = {
      ...config.params,
      apiKey,
    };

    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error?.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn("Unauthorized - token mungkin expired");
    }

    return Promise.reject(
      new Error(
        error?.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data",
      ),
    );
  },
);

export default api;

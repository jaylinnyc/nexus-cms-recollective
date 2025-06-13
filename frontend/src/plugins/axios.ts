import axios from "axios";

// Extend the Window interface to include runtimeConfig
declare global {
  interface Window {
    runtimeConfig?: {
      VITE_API_BASE_URL?: string;
    };
  }
}

const baseURL: string =
  (window.runtimeConfig && window.runtimeConfig.VITE_API_BASE_URL) ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.recollectivect.com';

console.log("[Axios] Base URL:", baseURL);

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;

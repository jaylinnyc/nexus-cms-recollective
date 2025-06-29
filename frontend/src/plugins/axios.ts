import axios from "axios";

// Extend the Window interface to include runtimeConfig
declare global {
  interface Window {
    runtimeConfig?: {
      VITE_API_BASE_URL?: string;
      VITE_APP_STRAPI_API_URL?: string;
      VITE_APP_STRAPI_API_TOKEN?: string;
    };
  }
}

// Default API configuration
const baseURL: string =
  (window.runtimeConfig && window.runtimeConfig.VITE_API_BASE_URL) ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.recollectivect.com";

console.log("[Axios] Base URL:", baseURL);

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// Strapi API configuration
const strapiBaseURL: string =
  (window.runtimeConfig && window.runtimeConfig.VITE_APP_STRAPI_API_URL) ||
  import.meta.env.VITE_APP_STRAPI_API_URL ||
  "https://cms.recollectivect.com";

const strapiApiToken: string =
  (window.runtimeConfig && window.runtimeConfig.VITE_APP_STRAPI_API_TOKEN) ||
  import.meta.env.VITE_APP_STRAPI_API_TOKEN ||
  "";

console.log("[Axios] Strapi Base URL:", strapiBaseURL);
if (!strapiApiToken) {
  console.warn("[Axios] Strapi API token is missing");
}

const strapiApi = axios.create({
  baseURL: strapiBaseURL,
  timeout: 30000,
  headers: strapiApiToken
    ? {
        Authorization: `Bearer ${strapiApiToken}`,
      }
    : {},
});

export { api, strapiApi };
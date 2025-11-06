// API configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// In development with Vite proxy, use relative URLs
// In production, the frontend serves the client so relative URLs work too
export const API_BASE_URL = '';

// Environment info for debugging
export const ENV_INFO = {
  isDevelopment,
  isProduction,
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
} as const;

// Create the API client instance with the appropriate base URL
import { ArtworkApiClient } from './artworkApi';
export const artworkApi = new ArtworkApiClient(API_BASE_URL);
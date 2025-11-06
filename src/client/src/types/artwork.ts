// Type definitions for the Artwork API
export interface Artwork {
  id: number;
  derivedFromId: number;
  title: string;
  keywords: string[];
  imageUrl: string;
  codeBlockUrl: string;
}

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
import type { Artwork, ApiResponse, ApiError } from '../types/artwork';

export class ArtworkApiError extends Error {
  public status: number;
  public details?: ApiError;

  constructor(status: number, message: string, details?: ApiError) {
    super(message);
    this.name = 'ArtworkApiError';
    this.status = status;
    this.details = details;
  }
}

export class ArtworkApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Handles HTTP responses and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails: ApiError | undefined;

      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorDetails = errorData;
          errorMessage = errorData.message;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new ArtworkApiError(response.status, errorMessage, errorDetails);
    }

    try {
      return await response.json();
    } catch (error) {
      throw new ArtworkApiError(response.status, 'Failed to parse response JSON', { 
        message: error instanceof Error ? error.message : 'Unknown parsing error' 
      });
    }
  }

  /**
   * Makes an HTTP request with error handling
   */
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ArtworkApiError) {
        throw error;
      }
      
      // Network or other fetch errors
      throw new ArtworkApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a random artwork
   */
  async getRandomArtwork(): Promise<Artwork> {
    return this.request<Artwork>('/api/artwork/random');
  }

  /**
   * Get a specific artwork by ID
   */
  async getArtwork(id: number): Promise<Artwork> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ArtworkApiError(400, 'Invalid artwork ID. Must be a positive integer.');
    }

    return this.request<Artwork>(`/api/artwork/${id}`);
  }

  /**
   * Create a remix of an existing artwork
   */
  async remixArtwork(id: number): Promise<Artwork> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ArtworkApiError(400, 'Invalid artwork ID. Must be a positive integer.');
    }

    return this.request<Artwork>(`/api/artwork/${id}/remix`, {
      method: 'POST',
    });
  }

  /**
   * Check if the API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Use the random artwork endpoint as a health check
      await this.getRandomArtwork();
      return true;
    } catch {
      return false;
    }
  }
}

// Create a default instance for convenience
// Note: The configured instance is exported from config.ts
export const artworkApi = new ArtworkApiClient();

// Export types for convenience
export type { Artwork, ApiResponse, ApiError };
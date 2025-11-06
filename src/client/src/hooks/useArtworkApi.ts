import { useState, useEffect, useCallback } from 'react';
import type { Artwork } from '../types/artwork';
import { ArtworkApiError } from '../api/artworkApi';
import { artworkApi } from '../api/config';

// Hook state interface
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a random artwork
 */
export function useRandomArtwork() {
  const [state, setState] = useState<ApiState<Artwork>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRandomArtwork = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const artwork = await artworkApi.getRandomArtwork();
      setState({ data: artwork, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof ArtworkApiError 
        ? error.message 
        : 'Failed to fetch random artwork';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    fetchRandomArtwork();
  }, [fetchRandomArtwork]);

  return {
    ...state,
    refetch: fetchRandomArtwork,
  };
}

/**
 * Hook to fetch a specific artwork by ID
 */
export function useArtwork(id: number | null) {
  const [state, setState] = useState<ApiState<Artwork>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchArtwork = useCallback(async (artworkId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const artwork = await artworkApi.getArtwork(artworkId);
      setState({ data: artwork, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof ArtworkApiError 
        ? error.message 
        : `Failed to fetch artwork ${artworkId}`;
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, []);

  useEffect(() => {
    if (id !== null) {
      fetchArtwork(id);
    } else {
      setState({ data: null, loading: false, error: null });
    }
  }, [id, fetchArtwork]);

  return {
    ...state,
    refetch: id !== null ? () => fetchArtwork(id) : undefined,
  };
}

/**
 * Hook to handle artwork remixing
 */
export function useRemixArtwork() {
  const [state, setState] = useState<ApiState<Artwork>>({
    data: null,
    loading: false,
    error: null,
  });

  const remixArtwork = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const newArtwork = await artworkApi.remixArtwork(id);
      setState({ data: newArtwork, loading: false, error: null });
      return newArtwork;
    } catch (error) {
      const errorMessage = error instanceof ArtworkApiError 
        ? error.message 
        : `Failed to remix artwork ${id}`;
      setState({ data: null, loading: false, error: errorMessage });
      throw error; // Re-throw so caller can handle it
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    remixArtwork,
    reset,
  };
}

/**
 * Hook to check API health
 */
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const healthy = await artworkApi.healthCheck();
      setIsHealthy(healthy);
    } catch {
      setIsHealthy(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isHealthy,
    checking,
    checkHealth,
  };
}
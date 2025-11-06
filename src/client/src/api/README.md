# Artwork API Wrapper

This package provides a comprehensive TypeScript API wrapper for the Derivative project's artwork HTTP APIs, along with React hooks for easy integration.

## Features

- 🔒 **Type-safe**: Full TypeScript support with proper type definitions
- ⚛️ **React-ready**: Custom hooks for seamless React integration
- 🛡️ **Error handling**: Comprehensive error handling with custom error types
- 🔄 **Auto-retry**: Built-in health checking capabilities
- 📱 **Lightweight**: Minimal dependencies, uses native fetch API

## API Endpoints

The wrapper covers all endpoints from the backend Derivative.Frontend service:

- `GET /api/artwork/random` - Get a random artwork
- `GET /api/artwork/{id}` - Get a specific artwork by ID
- `POST /api/artwork/{id}/remix` - Create a remix of an existing artwork

## Installation

The API wrapper is part of the client project. Import from the `api` directory:

```typescript
import { artworkApi, useRandomArtwork } from './api';
```

## Usage

### Direct API Client

```typescript
import { artworkApi, ArtworkApiError } from './api';

// Get a random artwork
try {
  const artwork = await artworkApi.getRandomArtwork();
  console.log(artwork);
} catch (error) {
  if (error instanceof ArtworkApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  }
}

// Get specific artwork
const artwork = await artworkApi.getArtwork(1);

// Create a remix
const remixedArtwork = await artworkApi.remixArtwork(1);

// Health check
const isHealthy = await artworkApi.healthCheck();
```

### React Hooks

#### useRandomArtwork

Fetches a random artwork on component mount with auto-refetch capability:

```typescript
import { useRandomArtwork } from './api';

function RandomArtworkComponent() {
  const { data, loading, error, refetch } = useRandomArtwork();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No artwork found</div>;

  return (
    <div>
      <h2>{data.title}</h2>
      <img src={data.imageUrl} alt={data.title} />
      <button onClick={refetch}>Get Another</button>
    </div>
  );
}
```

#### useArtwork

Fetches a specific artwork by ID:

```typescript
import { useArtwork } from './api';

function ArtworkComponent({ artworkId }: { artworkId: number }) {
  const { data, loading, error, refetch } = useArtwork(artworkId);

  // Same usage pattern as useRandomArtwork
}
```

#### useRemixArtwork

Handles artwork remixing with loading states:

```typescript
import { useRemixArtwork } from './api';

function RemixButton({ artworkId }: { artworkId: number }) {
  const { data, loading, error, remixArtwork, reset } = useRemixArtwork();

  const handleRemix = async () => {
    try {
      const newArtwork = await remixArtwork(artworkId);
      console.log('Created remix:', newArtwork);
    } catch (error) {
      // Error is automatically handled in the hook state
    }
  };

  return (
    <div>
      <button onClick={handleRemix} disabled={loading}>
        {loading ? 'Creating Remix...' : 'Remix This'}
      </button>
      {error && <div>Error: {error}</div>}
      {data && <div>Created: {data.title}</div>}
    </div>
  );
}
```

#### useApiHealth

Monitors API health status:

```typescript
import { useApiHealth } from './api';

function HealthStatus() {
  const { isHealthy, checking, checkHealth } = useApiHealth();

  return (
    <div>
      Status: {checking ? 'Checking...' : isHealthy ? '✅ Healthy' : '❌ Unhealthy'}
      <button onClick={checkHealth}>Refresh</button>
    </div>
  );
}
```

## Error Handling

The API wrapper provides a custom `ArtworkApiError` class for detailed error information:

```typescript
import { ArtworkApiError } from './api';

try {
  const artwork = await artworkApi.getArtwork(999);
} catch (error) {
  if (error instanceof ArtworkApiError) {
    console.error(`HTTP ${error.status}: ${error.message}`);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}
```

## Type Definitions

### Artwork

```typescript
interface Artwork {
  id: number;
  derivedFromId: number;
  title: string;
  keywords: string[];
  imageUrl: string;
  codeBlockUrl: string;
}
```

### ApiError

```typescript
interface ApiError {
  message: string;
}
```

### ApiResponse

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
```

## Configuration

### Custom Base URL

By default, the API client uses a relative base URL. For different environments:

```typescript
import { ArtworkApiClient } from './api';

// Custom API client with specific base URL
const customApi = new ArtworkApiClient('https://api.example.com');
```

### Request Configuration

The API client uses fetch with sensible defaults:

- `Content-Type: application/json`
- Automatic error handling for HTTP status codes
- JSON response parsing
- Network error handling

## Example Integration

See `ArtworkExample.tsx` for a complete example showing all API wrapper features in a React component.

## Development

### Building

The API wrapper is built with the rest of the client project:

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Architecture Notes

- **Separation of Concerns**: API client, React hooks, and types are in separate modules
- **Error Boundaries**: All API calls include comprehensive error handling
- **Type Safety**: Full TypeScript coverage with strict type checking
- **React Integration**: Hooks follow React best practices with proper dependency arrays
- **Performance**: Hooks use `useCallback` to prevent unnecessary re-renders

## Future Enhancements

- **Caching**: Add request/response caching for improved performance
- **Pagination**: Support for paginated artwork lists
- **Real-time Updates**: WebSocket integration for live artwork updates
- **Offline Support**: Service worker integration for offline capabilities
- **Rate Limiting**: Client-side rate limiting to prevent API abuse
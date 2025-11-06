# Client API Integration

This document describes the integration of the API wrapper with the client application.

## What's Implemented

### 🔌 API Integration
- **Random Artwork Fetching**: App loads a random artwork on startup
- **Remix Functionality**: Users can remix the current artwork to create variations
- **Real-time UI Updates**: Loading states and error handling throughout the interface

### 🎨 UI Components Updated
- **Artwork Display**: Shows fetched artwork images with loading spinner
- **Title & Keywords**: Dynamically populated from API data
- **Action Buttons**: Connected to API calls with loading states
- **Status Messages**: User feedback for loading and error states

### ⚙️ Configuration
- **Vite Proxy**: API calls are proxied to the backend during development
- **Environment Detection**: Automatic configuration for development/production
- **Error Handling**: Comprehensive error states and user feedback

## How to Test

### 1. Start the Application
```bash
aspire run
```

This will start both the frontend API and the client app through Aspire orchestration.

### 2. Access the Client
- Navigate to the client URL provided by Aspire (typically http://localhost:5159)
- The app should automatically load a random artwork on startup

### 3. Test Features

#### Random Artwork
- Click the "Random" button to fetch a new random artwork
- Observe loading states and artwork updates

#### Remix Feature
- Click the "Remix" button to create a variation of the current artwork
- Watch for the "Creating..." loading state
- After successful remix, a new random artwork loads (simulating the effect)

#### Error Handling
- If the backend API is not available, you'll see error messages
- Loading states appear during API calls

## API Endpoints Used

- `GET /api/artwork/random` - Fetches random artwork on app load and "Random" button clicks
- `POST /api/artwork/{id}/remix` - Creates remixes when "Remix" button is clicked

## UI States

### Loading States
- **Artwork**: Shows spinner while fetching
- **Title**: Shows "Loading artwork..." when no data
- **Keywords**: Shows "Loading keywords..." when no data  
- **Buttons**: Show "Loading..." and "Creating..." during API calls

### Error States
- **API Errors**: Displayed as red status messages below the action panel
- **Network Errors**: Handled gracefully with user-friendly messages

### Success States
- **Fresh Data**: Artwork, title, and keywords update immediately when new data arrives
- **Button States**: Return to normal after successful operations

## Code Structure

```
src/client/src/
├── api/
│   ├── artworkApi.ts      # Core API client
│   ├── config.ts          # Environment configuration
│   ├── index.ts           # Public API exports
│   └── README.md          # API documentation
├── hooks/
│   └── useArtworkApi.ts   # React hooks for API integration
├── types/
│   └── artwork.ts         # TypeScript type definitions
├── components/
│   ├── Artwork.tsx        # Updated with loading states
│   ├── ActionPanel.tsx    # Connected to API calls
│   ├── ArtworkTitle.tsx   # Dynamic content from API
│   └── ArtworkInputs.tsx  # Dynamic keywords from API
└── App.tsx                # Main integration point
```

## Next Steps

1. **Enhanced Error Recovery**: Add retry mechanisms for failed API calls
2. **Caching**: Implement client-side caching for better performance
3. **Real-time Updates**: Add WebSocket support for live artwork updates
4. **Animation**: Add smooth transitions between artwork changes
5. **History**: Track and display artwork genealogy/derivation chain

## Troubleshooting

### No Artwork Loads
- Ensure the backend is running (`aspire run` starts both frontend and client)
- Check browser console for API errors
- Verify proxy configuration in `vite.config.ts`

### API Errors
- Check that the backend endpoints are accessible
- Look for CORS issues in browser console
- Verify the backend mock data is properly configured

### Build Issues
- Run `npm run build` in the client directory to check for TypeScript errors
- Ensure all imports are correctly resolved
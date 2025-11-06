import { useState, useEffect } from 'react'
import './App.css'
import Artwork from './components/Artwork'
import ArtworkTitle from './components/ArtworkTitle'
import ArtworkInputs from './components/ArtworkInputs'
import ActionPanel from './components/ActionPanel'
import ThemeSelector from './components/ThemeSelector'
import { useRandomArtwork, useRemixArtwork } from './api'

const THEME_STORAGE_KEY = 'derivative-theme'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark'
    } catch {
      return 'dark'
    }
  })

  // Fetch random artwork data
  const { data: artwork, loading: artworkLoading, error: artworkError, refetch: getRandomArtwork } = useRandomArtwork()
  
  // Handle remixing
  const { remixArtwork, loading: remixLoading, error: remixError } = useRemixArtwork()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Listen for storage events to sync theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const newTheme = e.newValue
        if (newTheme === 'light' || newTheme === 'dark') {
          setTheme(currentTheme => {
            // Only update if the theme actually changed
            return currentTheme !== newTheme ? newTheme : currentTheme
          })
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // localStorage unavailable, theme will still work for current session
    }
  }

  const handleRandomClick = () => {
    getRandomArtwork()
  }

  const handleRemixClick = async () => {
    if (artwork?.id) {
      try {
        await remixArtwork(artwork.id)
        // After successful remix, we could update the artwork state
        // For now, let's get a new random artwork to show the remix effect
        getRandomArtwork()
      } catch (error) {
        console.error('Failed to remix artwork:', error)
      }
    }
  }

  return (
    <div className="app">
      <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      
      <div className="content">
        <div className="artwork-section">
          <Artwork 
            imageUrl={artwork?.imageUrl} 
            alt={artwork?.title}
            loading={artworkLoading}
          />
        </div>
        
        <div className="info-section">
          <ArtworkTitle title={artwork?.title} />
          <ArtworkInputs inputs={artwork?.keywords} />
          <ActionPanel 
            onRandom={handleRandomClick}
            onRemix={handleRemixClick}
            randomLoading={artworkLoading}
            remixLoading={remixLoading}
            remixDisabled={!artwork?.id}
          />
          
          {/* Loading and error states */}
          {artworkLoading && (
            <div className="status-message">Loading artwork...</div>
          )}
          {artworkError && (
            <div className="status-message error">Error: {artworkError}</div>
          )}
          {remixLoading && (
            <div className="status-message">Creating remix...</div>
          )}
          {remixError && (
            <div className="status-message error">Remix error: {remixError}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

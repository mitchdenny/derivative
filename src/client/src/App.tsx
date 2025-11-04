import { useState, useEffect } from 'react'
import './App.css'
import Artwork from './components/Artwork'
import ArtworkTitle from './components/ArtworkTitle'
import ArtworkInputs from './components/ArtworkInputs'
import ActionPanel from './components/ActionPanel'
import ThemeSelector from './components/ThemeSelector'

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Poll localStorage every 1 minute to sync theme changes from other tabs
  useEffect(() => {
    const pollInterval = setInterval(() => {
      try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark') && storedTheme !== theme) {
          setTheme(storedTheme)
        }
      } catch {
        // localStorage unavailable, skip polling
      }
    }, 60000) // Poll every 1 minute (60000ms)

    return () => clearInterval(pollInterval)
  }, [theme])

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    } catch {
      // localStorage unavailable, theme will still work for current session
    }
  }

  return (
    <div className="app">
      <ThemeSelector theme={theme} onThemeChange={handleThemeChange} />
      
      <div className="content">
        <div className="artwork-section">
          <Artwork />
        </div>
        
        <div className="info-section">
          <ArtworkTitle title="Mars Topography" />
          <ArtworkInputs inputs={['mars', 'topography', 'layers', 'burnt curves']} />
          <ActionPanel />
        </div>
      </div>
    </div>
  )
}

export default App

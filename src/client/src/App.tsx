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
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
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

import { useState } from 'react'
import './App.css'
import Artwork from './components/Artwork'
import ArtworkTitle from './components/ArtworkTitle'
import ArtworkInputs from './components/ArtworkInputs'
import ActionPanel from './components/ActionPanel'
import ThemeSelector from './components/ThemeSelector'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
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

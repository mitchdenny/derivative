import './ThemeSelector.css';

interface ThemeSelectorProps {
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  theme = 'dark',
  onThemeChange = () => console.log('Theme changed')
}) => {
  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  return (
    <div className="theme-selector">
      <label className="theme-toggle">
        <input 
          type="checkbox" 
          checked={theme === 'light'} 
          onChange={handleToggle}
          aria-label="Toggle theme"
        />
        <span className="theme-slider"></span>
      </label>
    </div>
  );
};

export default ThemeSelector;

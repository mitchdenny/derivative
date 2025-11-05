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
        <span className="theme-slider">
          <svg className="theme-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {theme === 'light' ? (
              // Sun icon
              <g>
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
                <path d="M12 1v3m0 16v3M4.22 4.22l2.12 2.12m11.32 11.32l2.12 2.12M1 12h3m16 0h3M4.22 19.78l2.12-2.12m11.32-11.32l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </g>
            ) : (
              // Moon icon
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            )}
          </svg>
        </span>
      </label>
    </div>
  );
};

export default ThemeSelector;

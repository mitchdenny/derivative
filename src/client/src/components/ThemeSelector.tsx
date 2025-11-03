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
      <button className="theme-button" onClick={handleToggle}>
        Theme
      </button>
    </div>
  );
};

export default ThemeSelector;

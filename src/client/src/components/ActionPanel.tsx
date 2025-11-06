import './ActionPanel.css';

interface ActionPanelProps {
  onRandom?: () => void;
  onRemix?: () => void;
  randomLoading?: boolean;
  remixLoading?: boolean;
  remixDisabled?: boolean;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ 
  onRandom = () => console.log('Random clicked'),
  onRemix = () => console.log('Remix clicked'),
  randomLoading = false,
  remixLoading = false,
  remixDisabled = false
}) => {
  return (
    <div className="action-panel">
      <button 
        className="action-button" 
        onClick={onRandom}
        disabled={randomLoading}
      >
        {randomLoading ? 'Loading...' : 'Random'}
      </button>
      <button 
        className="action-button" 
        onClick={onRemix}
        disabled={remixLoading || remixDisabled}
      >
        {remixLoading ? 'Creating...' : 'Remix'}
      </button>
    </div>
  );
};

export default ActionPanel;

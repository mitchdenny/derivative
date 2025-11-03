import './ActionPanel.css';

interface ActionPanelProps {
  onRandom?: () => void;
  onRemix?: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ 
  onRandom = () => console.log('Random clicked'),
  onRemix = () => console.log('Remix clicked')
}) => {
  return (
    <div className="action-panel">
      <button className="action-button" onClick={onRandom}>
        Random
      </button>
      <button className="action-button" onClick={onRemix}>
        Remix
      </button>
    </div>
  );
};

export default ActionPanel;

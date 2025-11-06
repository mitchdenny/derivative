import './ArtworkInputs.css';

interface ArtworkInputsProps {
  inputs?: string[];
}

const ArtworkInputs: React.FC<ArtworkInputsProps> = ({ inputs }) => {
  const displayText = inputs && inputs.length > 0 
    ? inputs.join(', ') 
    : 'Loading keywords...';
    
  return (
    <div className="artwork-inputs">
      <p className="artwork-inputs-text">{displayText}</p>
    </div>
  );
};

export default ArtworkInputs;

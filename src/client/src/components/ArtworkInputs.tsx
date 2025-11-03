import './ArtworkInputs.css';

interface ArtworkInputsProps {
  inputs?: string[];
}

const ArtworkInputs: React.FC<ArtworkInputsProps> = ({ 
  inputs = ['mars', 'topography', 'layers', 'burnt curves'] 
}) => {
  return (
    <div className="artwork-inputs">
      <p className="artwork-inputs-text">{inputs.join(', ')}</p>
    </div>
  );
};

export default ArtworkInputs;

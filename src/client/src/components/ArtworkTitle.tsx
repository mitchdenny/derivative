import './ArtworkTitle.css';

interface ArtworkTitleProps {
  title?: string;
}

const ArtworkTitle: React.FC<ArtworkTitleProps> = ({ title }) => {
  return (
    <h1 className="artwork-title">
      {title || 'Loading artwork...'}
    </h1>
  );
};

export default ArtworkTitle;

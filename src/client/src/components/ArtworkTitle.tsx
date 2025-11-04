import './ArtworkTitle.css';

interface ArtworkTitleProps {
  title?: string;
}

const ArtworkTitle: React.FC<ArtworkTitleProps> = ({ title = 'Mars Topography' }) => {
  return (
    <h1 className="artwork-title">{title}</h1>
  );
};

export default ArtworkTitle;

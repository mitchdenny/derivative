import './Artwork.css';

interface ArtworkProps {
  artworkId?: number;
}

const Artwork: React.FC<ArtworkProps> = ({ artworkId }) => {
  // If no artworkId provided, show a placeholder
  if (!artworkId) {
    return (
      <div className="artwork">
        <div className="artwork-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="artwork">
      <iframe 
        src={`/api/artwork/${artworkId}/content`} 
        title="Generated Artwork"
        className="artwork-iframe"
      />
    </div>
  );
};

export default Artwork;

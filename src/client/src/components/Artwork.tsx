import './Artwork.css';

interface ArtworkProps {
  imageUrl?: string;
  alt?: string;
  loading?: boolean;
}

const Artwork: React.FC<ArtworkProps> = ({ 
  imageUrl, 
  alt = 'Generated Artwork',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="artwork artwork-loading">
        <div className="artwork-placeholder">
          <div className="loading-spinner"></div>
          <p>Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="artwork artwork-placeholder">
        <div className="artwork-placeholder">
          <p>No artwork available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artwork">
      <img src={imageUrl} alt={alt} className="artwork-image" />
    </div>
  );
};

export default Artwork;

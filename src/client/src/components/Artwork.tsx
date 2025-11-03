import './Artwork.css';

interface ArtworkProps {
  imageUrl?: string;
  alt?: string;
}

const Artwork: React.FC<ArtworkProps> = ({ 
  imageUrl = '/mars-topography.svg', 
  alt = 'Generated Artwork' 
}) => {
  return (
    <div className="artwork">
      <img src={imageUrl} alt={alt} className="artwork-image" />
    </div>
  );
};

export default Artwork;

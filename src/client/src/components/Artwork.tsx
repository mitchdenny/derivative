import './Artwork.css';

interface ArtworkProps {
  imageUrl?: string;
  alt?: string;
}

const Artwork: React.FC<ArtworkProps> = ({ 
  imageUrl = 'https://via.placeholder.com/450x450/ff6b35/ffffff?text=Artwork', 
  alt = 'Generated Artwork' 
}) => {
  return (
    <div className="artwork">
      <img src={imageUrl} alt={alt} className="artwork-image" />
    </div>
  );
};

export default Artwork;

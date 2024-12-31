// Video Gallery Component
const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await fetch('/api/thumbnails', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch thumbnails');
        
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching thumbnails:', error);
      }
    };
    
    fetchThumbnails();
  }, []);
  
  const handleThumbnailClick = async (videoId) => {
    try {
      const response = await fetch(`/api/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch video');
      
      const videoUrl = await response.json();
      setSelectedVideo(videoUrl);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      {selectedVideo && (
        <div className="mb-8">
          <video 
            src={selectedVideo.url} 
            controls 
            className="w-full max-w-3xl mx-auto"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div 
            key={video.id}
            onClick={() => handleThumbnailClick(video.id)}
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-48 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
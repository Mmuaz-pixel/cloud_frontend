// Video Upload Component
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, Input, Button, Alert } from '@windmill/react-ui';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const handleUpload = async () => {
    if (!file || !thumbnail) {
      setError('Please select both video and thumbnail');
      return;
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('thumbnail', thumbnail);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      setFile(null);
      setThumbnail(null);
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload; 
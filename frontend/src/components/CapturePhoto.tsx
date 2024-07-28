// src/components/CapturePhoto.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pokedexImage from '../assets/images/bruhhhy.png';
import './CapturePhoto.css';

const CameraCaptureUpload: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('Capture your pokemon');
  
  const navigate = useNavigate();

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        
        // Create a Blob from the dataURL (simulate file for FormData)
        const blob = dataURItoBlob(dataURL);

        // Create FormData object and append the file
        const formData = new FormData();
        formData.append('file', blob, 'photo.jpg');

        // Update the status text
        setUploadStatus('Finding your pokemon...');
        
        // Call function to upload file
        uploadFile(formData);
      }
    }
  };

  const uploadFile = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:3010/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setUploadStatus('File uploaded successfully');
        navigate(`/pokemon/${responseData.pokemonId}`);
      } else {
        setUploadStatus('File upload failed');
      }
    } catch (error) {
      setUploadStatus('An error occurred during file upload');
    }
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    // Access the camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        console.error('Error accessing the camera', error);
      });
  }, []);

  return (
    <div className="camera-container">
      <img src={pokedexImage} alt="Pokedex" className="pokedex-image" />
      <video ref={videoRef} className="video-feed" autoPlay></video>
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
      <button className="pushable capture-button" onClick={capturePhoto}>
        <span className="shadow"></span>
        <span className="edge"></span>
        <span className="front">Capture Photo</span>
      </button>
      <p className="status-text">{uploadStatus}</p>
    </div>
  );
};

export default CameraCaptureUpload;

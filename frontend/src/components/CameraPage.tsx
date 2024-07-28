// src/components/CameraPage.tsx
import React from 'react';
import CameraCaptureUpload from './CapturePhoto';
import './CameraPage.css'; // Add this line

const CameraPage: React.FC = () => {
  return (
    <div className="camera-page">
      <CameraCaptureUpload />
    </div>
  );
};

export default CameraPage;

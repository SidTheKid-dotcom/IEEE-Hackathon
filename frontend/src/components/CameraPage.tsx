// src/components/CameraPage.tsx
import React from 'react';
import CameraCaptureUpload from './CapturePhoto';

const CameraPage: React.FC = () => {
  return (
    <div className="bg-white text-black font-sans flex justify-center items-center h-screen">
      <CameraCaptureUpload />
    </div>
  );
};

export default CameraPage;

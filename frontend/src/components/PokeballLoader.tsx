// PokeballLoader.tsx
import React from 'react';
import PokeballAnimation from './PokeballAnimation.json';
import Lottie from 'lottie-react';

const PokeballLoader: React.FC = () => (
  <div className="flex justify-center items-center">
    <Lottie
      animationData={PokeballAnimation}
      loop
      autoplay
      style={{ width: 80, height: 80 }} // Set desired size here
    />
  </div>
);

export default PokeballLoader;

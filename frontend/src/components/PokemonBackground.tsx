// src/components/PokemonBackground.tsx
import React from 'react';
import Particles from 'react-tsparticles';

const PokemonBackground: React.FC = () => {
  const particlesInit = async (main: any) => {
    // You can load additional options here if needed
  };

  const particlesLoaded = (container: any): Promise<void> => {
    console.log('Particles loaded', container);
    return Promise.resolve(); // Fixing the return type
  };

  return (
    <div className="absolute inset-0 -z-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: '#f5f5f5', // Light background color
            },
          },
          particles: {
            color: {
              value: '#ffcb05', // Pokémon yellow
            },
            links: {
              color: '#ffcb05',
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: false,
              straight: false,
              outModes: {
                default: 'bounce',
              },
            },
            number: {
              value: 80,
            },
            opacity: {
              value: 0.5,
              random: false,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
              },
            },
            size: {
              value: 3,
              random: true,
              animation: {
                enable: true,
                speed: 3,
                minimumValue: 1,
              },
            },
          },
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          detectRetina: true,
        }}
        className="w-full h-full"
      />
    </div>
  );
};

export default PokemonBackground;

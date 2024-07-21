// src/components/InteractiveBackground.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InteractiveBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (mount) {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const particles = new THREE.BufferGeometry();
      const particleCount = 500; // Reduced number of particles
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 500;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 500;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0xff0000,
        size: 1, // Reduced size
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      camera.position.z = 300;

      const animate = () => {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.0002;
        particleSystem.rotation.y += 0.0005;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        mount.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default InteractiveBackground;

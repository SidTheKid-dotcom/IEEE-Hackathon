// src/components/ThreeDBackground.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDBackground: React.FC = () => {
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

      const geometry = new THREE.SphereGeometry(50, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      camera.position.z = 100;

      const animate = () => {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        mount.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default ThreeDBackground;

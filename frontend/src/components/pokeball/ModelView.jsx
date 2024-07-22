
import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei";
import * as THREE from 'three';
import Lights from './Lights';
import Loader from './Loader';
import Pica from './Pica.jsx';
import { Suspense, useRef, useEffect } from "react";

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
  const requestRef = useRef();

  const animate = () => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01; // Adjust the speed of rotation here
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <View index={index} id={gsapType} className="w-full h-full absolute">
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[-1, 0, 4]} />
      <Lights />

      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        <Suspense fallback={<Loader />}>
          <Pica scale={[15, 15, 15]} item={item} size={size} />
        </Suspense>
      </group>
    </View>
  );
};

export default ModelView;

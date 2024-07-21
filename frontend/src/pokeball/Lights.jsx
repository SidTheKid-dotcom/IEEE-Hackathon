import { Environment, Lightformer } from "@react-three/drei";

const Lights = () => {
  return (
    
    <group name="lights">
 
      <Environment resolution={256}>
        <group>
   
          <Lightformer
            form="rect"
            intensity={10}
            position={[-1, 0, -10]}
            scale={10}
            color={"#495057"}
          />
        
          <Lightformer
            form="rect"
            intensity={1}
            position={[10, 0, 1]}
            scale={10}
            rotation-y={Math.PI / 2}
          />
        </group>
      </Environment>

     
      <spotLight
        position={[-2, 10, 5]}
        angle={0.15}
        penumbra={1} 
        decay={0} 
        intensity={Math.PI * 0.2} 
        color={"#f8f9fa"}
      />
     
      <spotLight
        position={[30, 15, 30]}
        angle={30}
        penumbra={1}
        decay={0.1}
        intensity={6}
      />
    </group>
  );
};

export default Lights;

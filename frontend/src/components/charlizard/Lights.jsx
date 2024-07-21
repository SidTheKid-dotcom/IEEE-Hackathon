import { Environment, Lightformer } from "@react-three/drei";

const Lights = () => {
  return (
   
    <group name="lights">
     
      <Environment resolution={256}>
        <group>
        
          <Lightformer
            form="rect"
            intensity={1}
            position={[-1, 0, -10]}
            scale={10}
            color={"#495057"}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[-10, 0, 1]}
            scale={10}
            rotation-y={Math.PI / 2}
            angle={60}
          
          />
       
        </group>
      </Environment>

     
      <spotLight
        position={[-2, -16, 6]}
        angle={0.15}
        penumbra={1} 
        decay={0} 
        intensity={Math.PI * 0.2} 
        color={"#e7d3f1"}
      />
      <spotLight
        position={[0, -25, 10]}
        angle={40}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.2}
        color={"#f8f9fa"}
      />

    </group>
  );
};

export default Lights;


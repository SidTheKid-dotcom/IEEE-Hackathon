import { useGSAP } from "@gsap/react"
import gsap from "gsap";
import ModelView from "./ModelView";
import { useEffect, useRef, useState } from "react";
import { yellowImg } from "../../utils/Ash";

import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
// 


const Model = ({label}) => {
 
  const [size, setSize] = useState('small');
  const [model, setModel] = useState({
   
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  })

  // camera control for the model view
  const cameraControlSmall = useRef();


  // model

  const small = useRef(new THREE.Group());
  
  // rotation
  const [smallRotation, setSmallRotation] = useState(0);




  

  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1,translateX:20 })
  }, []);

  return (
    <section className="sm:py-20 py-20 sm:px-10 px-5">
      <div className="">

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-full md:h-[90vh] overflow-hidden relative">
            <ModelView 
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />  

          

            <Canvas
              className="w-full h-full"
              style={{
                position: 'relative',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}
              eventSource={document.getElementById('root')}
            >
              <View.Port />
            </Canvas>
          </div>

         
        </div>
      </div>
    </section>
  )
}

export default Model

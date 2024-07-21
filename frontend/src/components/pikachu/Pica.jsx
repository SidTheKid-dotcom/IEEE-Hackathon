


import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

 function Pica(props) {
  const { nodes, materials } = useGLTF('/models/pica.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pikachu_slowpoke.geometry}
        material={materials.pikachu_slowpoke0}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.002}
      />
    </group>
  )
}
export default Pica

useGLTF.preload('/models/pica.glb')



// import React, { useRef } from 'react'
// import { useGLTF } from '@react-three/drei'
// // import'../../../public/assets/'
// export function Pica(props) {
//   const { nodes, materials } = useGLTF('../../../public/models/pokeball.glb')
//   return (
//     <group {...props} dispose={null}>
//       <group rotation={[-2.228, 0.18, 0.297]} scale={1.942}>
//         <group rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={nodes['Body1_Aluminum_-_Anodized_Glossy_(Red)_0'].geometry}
//             material={materials['Aluminum_-_Anodized_Glossy_Red']}
//             scale={10}
//           />
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={nodes['Body2_Plastic_-_Translucent_Matte_(White)_0'].geometry}
//             material={materials['Plastic_-_Translucent_Matte_White']}
//             scale={10}
//           />
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={nodes['Body3_Paint_-_Metal_Flake_(Black)_0'].geometry}
//             material={materials['Paint_-_Metal_Flake_Black']}
//             scale={10}
//           />
//           <mesh
//             castShadow
//             receiveShadow
//             geometry={nodes['Body5_LED_-_SMD_5630_-_50lm_(White)_0'].geometry}
//             material={materials['LED_-_SMD_5630_-_50lm_White']}
//             scale={10}
//           />
//         </group>
//       </group>
//     </group>
//   )
// }

// export default Pica
// useGLTF.preload('../../../public/assets/models/pokeball.glb')



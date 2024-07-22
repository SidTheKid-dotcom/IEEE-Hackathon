import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
// import React, { useRef } from 'react'

// import { useGLTF } from '@react-three/drei'
// import'../../../public/assets/'
export function Pica(props) {
  const { nodes, materials } = useGLTF('../../../public/models/ash_ketchum.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials['Ash_AG_arms_hat_hair.png']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Ash_Ketchum}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Ash_Ketchum_0}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials['def_ptrainer_001_col_2.png']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials['tr0022_00_AG_obj_col.png']}
        />
      </group>
    </group>
  )
}

export default Pica
useGLTF.preload('../../../public/models/ash_ketchum.glb')





import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Squit(props) {
  const { nodes, materials } = useGLTF('/models/squirtle.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={0.025}>
        <primitive object={nodes._rootJoint} />
        <skinnedMesh
          geometry={nodes.Object_6.geometry}
          material={materials.Material_60}
          skeleton={nodes.Object_6.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Object_7.geometry}
          material={materials.Material_61}
          skeleton={nodes.Object_7.skeleton}
        />
      </group>
    </group>
  )
}
export default Squit
useGLTF.preload('/models/squirtle.glb')
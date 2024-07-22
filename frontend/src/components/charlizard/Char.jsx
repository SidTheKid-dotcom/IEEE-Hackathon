

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'


function Char(props) {
  const { nodes, materials } = useGLTF('/models/charizard.glb')
  return (
    <group {...props} dispose={null}>
      <group scale={0.025}>
        <primitive object={nodes._rootJoint} />
        <skinnedMesh
          geometry={nodes.Object_6.geometry}
          material={materials.Material_12}
          skeleton={nodes.Object_6.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Object_7.geometry}
          material={materials.Material_13}
          skeleton={nodes.Object_7.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Object_8.geometry}
          material={materials.Material_14}
          skeleton={nodes.Object_8.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Object_9.geometry}
          material={materials.Material_15}
          skeleton={nodes.Object_9.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Object_10.geometry}
          material={materials.Material_16}
          skeleton={nodes.Object_10.skeleton}
        />
      </group>
    </group>
  )
}
export default Char
useGLTF.preload('/models/charizard.glb')

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

 function OMG(props) {
  const { nodes, materials } = useGLTF('/models/bulba.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.046, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <group
          position={[1.396, 0.074, 0.187]}
          rotation={[0, 0, 0.309]}
          scale={[1.04, 1.055, 1.04]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic1_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic2_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic3_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic4_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
            position={[8.277, 0.746, 1.972]}
            rotation={[0, -Math.PI / 6, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic5_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
            position={[5.613, 0.746, -7.035]}
            rotation={[0, Math.PI / 6, 0]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.garlic6_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
          />
        </group>
        <group position={[0.009, -0.02, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.skin1_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
            position={[2.894, 2.94, -1.592]}
            rotation={[-0.284, -0.27, -1.038]}
            scale={0.554}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.skin2_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
            position={[3.297, 1.824, -0.162]}
            rotation={[-1.965, -0.508, -1.487]}
            scale={0.284}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.skin3_geo_M_bulbasaur_0.geometry}
            material={materials.M_bulbasaur}
            position={[3.337, 2.022, 0.147]}
            rotation={[-1.965, -0.508, -1.911]}
            scale={0.284}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube3_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube15_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube23_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube34_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube38_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube39_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube5_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube7_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube24_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube35_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube36_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pCube37_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.body_geo4_M_bulbasaur_0.geometry}
          material={materials.M_bulbasaur}
          rotation={[0, Math.PI / 2, 0]}
        />
      </group>
    </group>
  )
}
export default OMG
useGLTF.preload('/models/bulba.glb')




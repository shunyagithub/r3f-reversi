import * as THREE from "three";

import { FC, forwardRef, useImperativeHandle, useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { ShaderMaterialProps, extend, useFrame } from "@react-three/fiber";

import vertexShader from "./shader/shader.vert?raw";
import fragmentShader from "./shader/shader.frag?raw";

declare module "@react-three/fiber" {
  export interface ThreeElements {
    shaderImpl: ShaderMaterialProps;
  }
}

const ShaderImpl = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector4(),
  },
  vertexShader,
  fragmentShader
);

extend({ ShaderImpl });

const Shader = forwardRef(({ ...props }, ref) => {
  const localRef = useRef<THREE.ShaderMaterial>(null!);

  useImperativeHandle(ref, () => localRef.current);

  useFrame((_, delta) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    localRef.current.u_time += delta;
  });

  return <shaderImpl ref={localRef} {...props} attach="material" />;
});

export const BasicShader: FC = () => {
  return (
    <mesh>
      <planeGeometry args={[1, 1, 32, 32]} />
      <Shader />
    </mesh>
  );
};

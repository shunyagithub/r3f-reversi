import { GroupProps } from "@react-three/fiber";
import { useDiscStore } from "../store/store";
import * as THREE from "three";
import { getDiscPosition } from "../reversi";
import { Edges } from "@react-three/drei";

export const Disc = (props: GroupProps) => {
  return (
    <group {...props}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#fff" />
        <Edges color="black" />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#000" />
        <Edges color="black" />
      </mesh>
    </group>
  );
};

const Discs = () => {
  const discs = useDiscStore((state) => state.discs);
  return discs.map((d, index) => {
    if (d.condition === 0) return null;

    const rotation = new THREE.Euler(d.condition === 1 ? Math.PI : 0, 0, 0);
    const position = getDiscPosition(d.id);

    return <Disc key={index} position={position} rotation={rotation} />;
  });
};

export default Discs;

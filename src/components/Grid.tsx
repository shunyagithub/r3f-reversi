import { Instances, Instance } from "@react-three/drei";

const Grid = ({ number = 9, lineWidth = 0.03, height = 0.3 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, -0.12, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#000" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group
          key={x + ":" + y}
          position={[
            x * 2 - Math.floor(number / 2) * 2,
            -0.01,
            y * 2 - Math.floor(number / 2) * 2,
          ]}
        >
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 100, "#bbb", "#bbb"]} position={[0, -0.01, 0]} />
  </Instances>
);

export default Grid;

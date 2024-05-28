import { Canvas, MeshProps, ThreeEvent } from "@react-three/fiber";
import {
  Instance,
  Instances,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Leva } from "leva";
import Disks from "./components/disk";
import { useDiskStore } from "./store/store";
import { useCallback, useState } from "react";

function App() {
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{ position: [40, 40, 40], zoom: 100 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f5"]} />
        <Grid />

        <OrbitControls
          autoRotateSpeed={-0.1}
          zoomSpeed={0.25}
          minZoom={40}
          maxZoom={140}
          enablePan={false}
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
        <Environment preset="city" />
        <Disks />
        <HintGrid />
      </Canvas>
      <Leva collapsed />
    </>
  );
}

export default App;

const Grid = ({ number = 9, lineWidth = 0.05, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, -0.12, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
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

const HintGrid = ({ number = 8, width = 2, height = 2 }) => {
  return (
    <group position={[0, -0.13, 0]}>
      {Array.from({ length: number }, (_, y) =>
        Array.from({ length: number }, (_, x) => (
          <Hint
            key={x + ":" + y}
            position={[
              x * 2 - Math.floor(number / 2) * 2 + 1,
              0,
              y * 2 - Math.floor(number / 2) * 2 + 1,
            ]}
            width={width}
            height={height}
          />
        ))
      )}
    </group>
  );
};

const Hint = ({
  width,
  height,
  ...props
}: { width: number; height: number } & MeshProps) => {
  const [hovered, hover] = useState(false);
  const addDisk = useDiskStore((state) => state.addDisks);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      addDisk({ position: e.object.position.clone(), face: true });
    },
    [addDisk]
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      {...props}
      onPointerOver={(e) => (e.stopPropagation(), hover(true))}
      onPointerOut={() => hover(false)}
      onClick={onClick}
    >
      <planeGeometry args={[width, height, 4]} />
      <meshBasicMaterial
        color={"blue"}
        transparent
        opacity={hovered ? 0.1 : 0}
      />
    </mesh>
  );
};

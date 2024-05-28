import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import Hints from "./components/hint";
import Disks from "./components/disk";
import Grid from "./components/Grid";

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
        <Environment preset="city" />
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

        <Disks />
        <Hints />
        <Grid />
      </Canvas>
      <Leva collapsed />
    </>
  );
}

export default App;

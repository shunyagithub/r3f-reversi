import "./App.css";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";

import { Box } from "./components/box/box";
import { BasicShader } from "./components/shader/shader";

function App() {
  return (
    <main className="w-full h-full">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 30 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        <BasicShader />
        <Preload all />
        <OrbitControls />
      </Canvas>
    </main>
  );
}

export default App;

import { RGBELoader } from "three-stdlib";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Instance,
  Instances,
  Environment,
  Lightformer,
  OrbitControls,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Leva, useControls } from "leva";
import { GroupProps } from "@react-three/fiber";

function App() {
  const { autoRotate, ...config } = useControls({
    backside: true,
    backsideThickness: { value: 0.3, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 3, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 2, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.05, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.5, min: 0, max: 2, step: 0.01 },
    color: "#ff9cf5",
    gColor: "#ff7eb3",
    autoRotate: false,
  });
  return (
    <>
      <Canvas
        shadows
        orthographic
        camera={{ position: [20, 20, 20], zoom: 100 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#f2f2f5"]} />
        {/** The text and the grid */}
        <Grid />

        <group position={[0, -0.9, 0]}>
          <Disk config={config} position={[-1, 0, -1]} />
          <Disk config={config} position={[-3, 0, -3]} />
          <Disk
            config={config}
            position={[-1, 0, -3]}
            rotation={[-Math.PI, 0, 0]}
          />
          <Disk
            config={config}
            position={[-3, 0, -1]}
            rotation={[-Math.PI, 0, 0]}
          />
        </group>
        {/** Controls */}
        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={-0.1}
          zoomSpeed={0.25}
          minZoom={40}
          maxZoom={140}
          enablePan={false}
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 3}
        />
        {/** The environment is just a bunch of shapes emitting light. This is needed for the clear-coat */}
        <Environment resolution={32}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer
              intensity={20}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, -1, -1]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[20, 2, 1]}
            />
            <Lightformer
              type="ring"
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-0.1, -1, -5]}
              scale={10}
            />
          </group>
        </Environment>
      </Canvas>
      <Leva collapsed />
    </>
  );
}

export default App;

const Grid = ({ number = 8, lineWidth = 0.05, height = 0.5 }) => (
  // Renders a grid and crosses as instances
  <Instances position={[0, -1.02, 0]}>
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

type DiskProps = {
  config: any;
} & GroupProps;

function Disk({ config, ...props }: DiskProps) {
  const [bTexuture, wTexture] = useLoader(RGBELoader, [
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr",
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr",
  ]);

  return (
    <group {...props}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <MeshTransmissionMaterial
          {...config}
          color="#fff"
          background={wTexture}
        />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <MeshTransmissionMaterial
          {...config}
          color="#444444"
          background={bTexuture}
        />
      </mesh>
    </group>
  );
}

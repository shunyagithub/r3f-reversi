import { MeshTransmissionMaterial } from "@react-three/drei";
import { GroupProps, useLoader } from "@react-three/fiber";
import { useControls } from "leva";
import { RGBELoader } from "three-stdlib";
import { useDiskStore } from "../store/store";

const Disks = () => {
  const disks = useDiskStore((state) => state.disks);
  return disks.map((d, index) => (
    <Disk
      key={index}
      position={d.position}
      rotation={d.face ? [Math.PI, 0, 0] : [0, 0, 0]}
    />
  ));
};

export default Disks;

export const Disk = (props: GroupProps) => {
  const { ...config } = useControls({
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
  });
  const [bTexuture, wTexture] = useLoader(RGBELoader, [
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr",
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr",
  ]);

  return (
    <group {...props}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#fff" />
        {/* <MeshTransmissionMaterial
          {...config}
          color="#fff"
          background={wTexture}
        /> */}
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#000" />
        {/* <MeshTransmissionMaterial
          {...config}
          color="#444444"
          background={bTexuture}
        /> */}
      </mesh>
    </group>
  );
};

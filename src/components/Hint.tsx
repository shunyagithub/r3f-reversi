import { MeshProps, ThreeEvent } from "@react-three/fiber";
import { useState, useCallback } from "react";
import { useDiskStore } from "../store/store";

const Hint = ({
  width,
  height,
  ...props
}: { width: number; height: number } & MeshProps) => {
  const [hovered, hover] = useState(false);
  const addDisk = useDiskStore((state) => state.addDisks);
  const disks = useDiskStore((state) => state.disks);

  const diskExists = useCallback(
    (position: THREE.Vector3) => {
      return disks.some((disk) => disk.position.equals(position));
    },
    [disks]
  );

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const diskPosition = e.object.position.clone();

      if (!diskExists(diskPosition)) {
        hover(true);
      }
    },
    [diskExists]
  );
  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const diskPosition = e.object.position.clone();
      if (!diskExists(diskPosition)) {
        addDisk({ position: diskPosition, face: true });
      }
    },
    [addDisk, diskExists]
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      {...props}
      onPointerOver={onPointerOver}
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

const Hints = ({ number = 8, width = 2, height = 2 }) => {
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

export default Hints;

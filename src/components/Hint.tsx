import { MeshProps, ThreeEvent } from "@react-three/fiber";
import { useState, useCallback } from "react";
import { useDiscStore, useGameStore } from "../store/store";
import { Text } from "@react-three/drei";

const VECT = [-10, -9, -8, -1, 1, 8, 9, 10]; // 特定のDiskから8方向
// P-10, P-9, P-8,
// P-1, [P], P+1,
// P+8, P+9, P+10

const Hint = ({
  width,
  height,
  ...props
}: { width: number; height: number } & MeshProps) => {
  const [hovered, hover] = useState(false);
  const updateDisc = useDiscStore((state) => state.updateDisc);
  const discs = useDiscStore((state) => state.discs);
  const turn = useGameStore((state) => state.turn);
  const setTurn = useGameStore((state) => state.setTurn);

  const discExists = useCallback(
    (id: number) => {
      return discs.some((disc) => disc.condition !== 0 && disc.id === id);
    },
    [discs]
  );

  const flipDisk = useCallback(
    (id: number) => {
      const p = id;
      let flipdiscs = 0;
      const oposite = turn === 1 ? 2 : 1;

      // Discの周り8方向をチェック
      for (let i = 0; i < VECT.length; i++) {
        const vect = VECT[i];
        let n = p + vect;

        let flip = 0;

        // 裏返せる石を探す
        while (discs[n]?.condition === oposite) {
          flip++;
          n += vect;
        }

        // 裏返せる石がある場合
        if (flip > 0 && discs[n]?.condition === turn) {
          for (let i = 0; i < flip; i++) {
            // console.log("n -= vect", n - vect, "turn", turn);

            updateDisc({
              id: n - vect,
              condition: turn,
            });

            n -= vect;
          }
          flipdiscs += flip; // 返した石の数を足し込む
        }
      }

      // 1つ以上裏返せる場合
      if (flipdiscs > 0) {
        updateDisc({
          id: p,
          condition: turn,
        });
        setTurn(turn === 1 ? 2 : 1);
      }
    },
    [turn, discs, setTurn, updateDisc]
  );

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const discId = parseFloat(e.object.name);

      if (!discExists(discId)) {
        hover(true);
      }
    },
    [discExists]
  );

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const discId = parseFloat(e.object.name);

      if (!discExists(discId)) {
        flipDisk(discId);
      }
    },
    [discExists, flipDisk]
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

const Hints = ({ number = 9, width = 2, height = 2 }) => {
  return (
    <group position={[0, -0.13, 0]}>
      {Array.from({ length: number }, (_, y) =>
        Array.from({ length: number }, (_, x) => {
          const id = x + y * number;
          return (
            <group key={x + ":" + y}>
              <Hint
                name={id.toString()}
                position={[
                  x * 2 - Math.floor(number / 2) * 2 + 1,
                  0,
                  y * 2 - Math.floor(number / 2) * 2 + 1,
                ]}
                width={width}
                height={height}
              />
              <Text
                position={[
                  x * 2 - Math.floor(number / 2) * 2 + 1,
                  0.3,
                  y * 2 - Math.floor(number / 2) * 2 + 1,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                {id}
              </Text>
            </group>
          );
        })
      )}
    </group>
  );
};

export default Hints;

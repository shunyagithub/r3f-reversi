import { MeshProps, ThreeEvent } from "@react-three/fiber";
import { useState, useCallback } from "react";
import { useDiscStore, useGameStore } from "../store/store";
import { Text } from "@react-three/drei";
import { HIDDEN_ID, VECT } from "../reversi";

const Hint = ({
  id,
  width,
  height,
  ...props
}: { id: number; width: number; height: number } & MeshProps) => {
  const [hovered, hover] = useState(false);
  const placeableDiscs = useDiscStore((state) => state.placeableDiscs);

  const updateDisc = useDiscStore((state) => state.updateDisc);
  const discs = useDiscStore((state) => state.discs);
  const turn = useGameStore((state) => state.turn);
  const setTurn = useGameStore((state) => state.setTurn);

  const placeable = placeableDiscs[turn === 1 ? "black" : "white"].includes(id);
  // const placeable = true;

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

      if (!discExists(id) && placeable) {
        hover(true);
      }
    },
    [discExists, placeable, id]
  );

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();

      if (!discExists(id) && placeable) {
        flipDisk(id);
      }
    },
    [discExists, flipDisk, id, placeable]
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
        opacity={placeable ? (hovered ? 0.1 : 0.05) : 0}
      />
    </mesh>
  );
};

const Hints = ({ number = 9, width = 2, height = 2 }) => {
  return (
    <group position={[0, -0.13, 0]}>
      {Array.from({ length: number + 1 }, (_, y) =>
        Array.from({ length: number }, (_, x) => {
          const id = x + y * number;
          const gHidden = !HIDDEN_ID.includes(id);
          return (
            <group key={x + ":" + y} visible={gHidden}>
              <Hint
                id={id}
                position={[
                  x * 2 - Math.floor(number / 2) * 2 - 1,
                  0,
                  y * 2 - Math.floor(number / 2) * 2 - 1,
                ]}
                width={width}
                height={height}
              />
              <Text
                position={[
                  x * 2 - Math.floor(number / 2) * 2 - 1,
                  0.3,
                  y * 2 - Math.floor(number / 2) * 2 - 1,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
                visible={false}
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

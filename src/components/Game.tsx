import { useEffect } from "react";
import { HIDDEN_ID, useGame, VECT } from "../reversi";
import { Edges, Text } from "@react-three/drei";
import { useDiscStore, useGameStore } from "../store/store";

const Game = () => {
  const { score, winner, gameover } = useGame();

  const turn = useGameStore((state) => state.turn);
  const discs = useDiscStore((state) => state.discs);
  const setPlacableDiscs = useDiscStore((state) => state.setPlaceableDiscs);

  useEffect(() => {
    const blackPlaceable: number[] = [];
    const whitePlaceable: number[] = [];

    discs.forEach((disc) => {
      if (disc.condition !== 0) return;

      const p = disc.id;
      const oposite = [1, 2];

      for (let j = 0; j < oposite.length; j++) {
        const opp = oposite[j];
        const turn = opp === 1 ? 2 : 1;

        for (let i = 0; i < VECT.length; i++) {
          const vect = VECT[i];
          let n = p + vect;

          let flip = 0;

          while (discs[n]?.condition === opp) {
            flip++;
            n += vect;
          }

          if (flip > 0 && discs[n]?.condition === turn) {
            if (turn === 1) blackPlaceable.push(p);
            else whitePlaceable.push(p);

            break;
          }
        }
      }
    });

    setPlacableDiscs({
      black: blackPlaceable.filter((id) => !HIDDEN_ID.includes(id)),
      white: whitePlaceable.filter((id) => !HIDDEN_ID.includes(id)),
    });
  }, [discs, turn, setPlacableDiscs]);

  return (
    <>
      <group position={[-7.5, -0.12, -11]}>
        <group position={[0, 0, -0.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color={"#000000"} />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={1.45}
            anchorX="left"
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0.6, 0, 0.15]}
          >
            {score.black}
          </Text>
        </group>

        <group position={[3, 0, -0.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial color={"#ffffff"} />
            <Edges color="black" />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={1.45}
            anchorX="left"
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0.6, 0, 0.15]}
          >
            {score.white}
          </Text>
        </group>

        <group position={[0, 0, 1.5]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshStandardMaterial
              color={winner === 1 || turn === 1 ? "#000000" : "#ffffff"}
            />
            <Edges color="black" />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={1.45}
            anchorX="left"
            position={[0.6, 0, 0.15]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {gameover
              ? `WINNER: ${
                  winner === 0
                    ? "DRAW"
                    : winner === 1
                    ? "1ST PLAYER"
                    : "2ND PLAYER"
                }`
              : `TURN: ${turn === 1 ? "1ST PLAYER" : "2ND PLAYER"}`}
          </Text>
        </group>
      </group>
    </>
  );
};

export default Game;

import { useEffect } from "react";
import { HIDDEN_ID, useGame, VECT } from "../reversi";
import { Text } from "@react-three/drei";
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
      <group position={[6, 0, 10]}>
        <group position={[-0.5, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color={"#000000"} />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={0.3}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0.3, 0.005, 0]}
          >
            {score.black}
          </Text>
        </group>

        <group position={[0.3, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 32]} />
            <meshStandardMaterial color={"#ffffff"} />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={0.3}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0.3, 0.005, 0]}
          >
            {score.white}
          </Text>
        </group>

        <group position={[0, 0, 1]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
            <circleGeometry args={[0.2, 32]} />
            <meshStandardMaterial color={turn === 1 ? "#000000" : "#ffffff"} />
          </mesh>
          <Text
            color={"#000000"}
            fontSize={0.2}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {gameover
              ? `WINNER: ${winner}`
              : `TURN: ${turn === 1 ? "1ST PLAYER" : "2ND PLAYER"}`}
          </Text>
        </group>
      </group>
    </>
  );
};

export default Game;

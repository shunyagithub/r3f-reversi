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

    const filteredBlackPlaceable = blackPlaceable.filter(
      (id) => !HIDDEN_ID.includes(id)
    ); // HIDDEN_IDに含まれる場合は除外
    const filteredWhitePlaceable = whitePlaceable.filter(
      (id) => !HIDDEN_ID.includes(id)
    ); // HIDDEN_IDに含まれる場合は除外
    setPlacableDiscs({
      black: filteredBlackPlaceable,
      white: filteredWhitePlaceable,
    });
  }, [discs, turn, setPlacableDiscs]);

  return (
    <>
      <group position={[0, 0, 10]}>
        <Text>
          Black: {score.black} / White: {score.white}
        </Text>
      </group>

      {gameover && <Text>Winner: {winner}</Text>}
    </>
  );
};

export default Game;

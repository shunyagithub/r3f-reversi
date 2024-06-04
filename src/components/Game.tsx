import { useCallback, useEffect, useMemo, useState } from "react";
import { HIDDEN_ID, useGame, VECT } from "../reversi";
import { Edges, Text } from "@react-three/drei";
import { useGameStore } from "../store/store";
import { GroupProps } from "@react-three/fiber";

const Game = () => {
  const { score, winner, gameover } = useGame();

  const turn = useGameStore((state) => state.turn);
  const discs = useGameStore((state) => state.discs);
  const setPlacableDiscs = useGameStore((state) => state.setPlaceableDiscs);

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
        <Score color="black" score={score.black} position={[0, 0, -0.5]} />
        <Score color="white" score={score.white} position={[3, 0, -0.5]} />
        <Turn
          turn={turn}
          gameover={gameover}
          winner={winner}
          position={[0, 0, 1.5]}
        />

        {gameover && (
          <ResetButton rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0, 10]} />
        )}
      </group>
    </>
  );
};

export default Game;

type ScoreProps = {
  color: "black" | "white";
  score: number;
} & GroupProps;

const Score = ({ color, score, ...props }: ScoreProps) => {
  return (
    <group {...props}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial
          color={color === "black" ? "#000000" : "#ffffff"}
        />
        <Edges color="black" />
      </mesh>
      <Text
        color={"#000000"}
        fontSize={1.45}
        anchorX="left"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.6, 0, 0.15]}
      >
        {score}
      </Text>
    </group>
  );
};

type TurnProps = {
  turn: 1 | 2;
  gameover: boolean;
  winner: 0 | 1 | 2;
} & GroupProps;

const Turn = ({ turn, gameover, winner, ...props }: TurnProps) => {
  const text = useMemo(() => {
    if (gameover) {
      if (winner === 0) {
        return "WINNER: DRAW";
      } else if (winner === 1) {
        return "WINNER: 1ST PLAYER";
      } else {
        return "WINNER: 2ND PLAYER";
      }
    } else {
      return turn === 1 ? "TURN: 1ST PLAYER" : "TURN: 2ND PLAYER";
    }
  }, [turn, gameover, winner]);

  const visibleDisc = useMemo(() => {
    if (gameover && winner === 0) {
      return false;
    }
    return true;
  }, [winner, gameover]);

  return (
    <group {...props}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} visible={visibleDisc}>
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
        {text}
      </Text>
    </group>
  );
};

const ResetButton = (props: GroupProps) => {
  const [hovered, hover] = useState(false);

  const resetGame = useGameStore((state) => state.reset);

  const onPointerOver = useCallback(() => {
    hover(true);
  }, []);

  const onPointerOut = useCallback(() => {
    hover(false);
  }, []);

  const onReset = useCallback(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <group
      {...props}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onReset}
    >
      <mesh>
        <planeGeometry args={[3, 10]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={hovered ? 1 : 0}
        />
        <Edges color="black" />
      </mesh>
      <Text
        color={hovered ? "#ffffff" : "#000000"}
        fontSize={1.45}
        anchorX="center"
        position={[0.3, -0.2, 0.15]}
        rotation={[0, 0, Math.PI / 2]}
      >
        PLAY AGAIN
      </Text>
    </group>
  );
};

import * as THREE from "three";
import { useDiscStore } from "./store/store";

export const HIDDEN_ID = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72, 81, 82, 83, 84, 85,
  86, 87, 88, 89, 90,
];
export const VECT = [-10, -9, -8, -1, 1, 8, 9, 10]; // 特定のDiskから8方向
// P-10, P-9, P-8,
// P-1, [P], P+1,
// P+8, P+9, P+10

export const getDiscPosition = (id: number) => {
  const posX = (id % 9) * 2 - 9;
  const posZ = Math.floor(id / 9) * 2 - 9;
  return new THREE.Vector3(posX, 0, posZ);
};

export const useGame = () => {
  let winner;

  const discs = useDiscStore((state) => state.discs);

  // score / winner
  const black = discs.filter((disc) => disc.condition === 1).length;
  const white = discs.filter((disc) => disc.condition === 2).length;

  if (white < black) {
    winner = "1st player";
  } else if (white > black) {
    winner = "2nd player";
  } else {
    winner = "draw";
  }

  return {
    score: { black, white },
    winner,
    gameover: false,
  };
};

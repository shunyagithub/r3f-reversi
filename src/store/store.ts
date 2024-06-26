import { create } from "zustand";

type Disc = {
  id: number;
  condition: 0 | 1 | 2; // 0: none, 1: black, 2: white
};

const init: Disc[] = [
  { id: 40, condition: 2 },
  { id: 50, condition: 2 },
  { id: 41, condition: 1 },
  { id: 49, condition: 1 },
];

const getInitDisks = (): Disc[] => {
  const discs: Disc[] = [];
  for (let i = 0; i < 91; i++) {
    discs.push({ id: i, condition: 0 });
  }

  const mergedDiscs = [
    ...init,
    ...discs.filter((disc) => !init.some((d) => d.id === disc.id)),
  ].sort((a, b) => a.id - b.id);

  return mergedDiscs;
};

const initDiscs = getInitDisks();

type GameState = {
  discs: Disc[];
  placeableDiscs: { black: number[]; white: number[] };
  setPlaceableDiscs: (v: { black: number[]; white: number[] }) => void;
  updateDisc: (v: Disc) => void;
  turn: 1 | 2; // 1: black, 2: white
  setTurn: (v: 1 | 2) => void;
  reset: () => void;
  score: { black: number; white: number };
  setScore: (v: { black: number; white: number }) => void;
};

export const useGameStore = create<GameState>((set) => ({
  discs: [...initDiscs],
  placeableDiscs: { black: [], white: [] },
  setPlaceableDiscs: (v) =>
    set(() => ({ placeableDiscs: { black: v.black, white: v.white } })),
  updateDisc: (v) => {
    set((state) => ({
      ...state,
      discs: [...state.discs.filter((disc) => disc.id !== v.id), v].sort(
        (a, b) => a.id - b.id
      ),
    }));
  },
  turn: 1,
  setTurn: (v) => set(() => ({ turn: v })),
  reset: () =>
    set(() => ({
      discs: [...initDiscs],
      turn: 1,
      gameover: false,
      score: { black: 2, white: 2 },
    })),
  score: { black: 2, white: 2 },
  setScore: (v) => set(() => ({ score: v })),
}));

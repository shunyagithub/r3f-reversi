import { create } from "zustand";

type Disc = {
  id: number;
  condition: 0 | 1 | 2; // 0: none, 1: white, 2: black
};

const init: Disc[] = [
  { id: 40, condition: 1 },
  { id: 50, condition: 1 },
  { id: 41, condition: 2 },
  { id: 49, condition: 2 },
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

type DiscState = {
  discs: Disc[];
  placeableDiscs: number[];
  setPlaceableDiscs: (v: number[]) => void;
  updateDisc: (v: Disc) => void;
};

export const useDiscStore = create<DiscState>((set) => ({
  discs: [...initDiscs],
  placeableDiscs: [],
  setPlaceableDiscs: (v) => set(() => ({ placeableDiscs: v })),
  updateDisc: (v) => {
    set((state) => ({
      ...state,
      discs: [...state.discs.filter((disc) => disc.id !== v.id), v].sort(
        (a, b) => a.id - b.id
      ),
    }));
  },
}));

type GameState = {
  turn: 1 | 2;
  setTurn: (v: 1 | 2) => void;
  reset: () => void;
  gameover: boolean;
  setGameover: (v: boolean) => void;
  score: { white: number; black: number };
  setScore: (v: { white: number; black: number }) => void;
};

export const useGameStore = create<GameState>((set) => ({
  turn: 1,
  setTurn: (v) => set(() => ({ turn: v })),
  reset: () =>
    set(() => ({ turn: 1, gameover: false, score: { white: 2, black: 2 } })),
  gameover: false,
  setGameover: (v) => set(() => ({ gameover: v })),
  score: { white: 2, black: 2 },
  setScore: (v) => set(() => ({ score: v })),
}));

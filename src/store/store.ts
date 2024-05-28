import { create } from "zustand";
import * as THREE from "three";

const initDisks = [
  { position: new THREE.Vector3(1, 0, 1), face: true },
  { position: new THREE.Vector3(-1, 0, -1), face: true },
  { position: new THREE.Vector3(1, 0, -1), face: false },
  { position: new THREE.Vector3(-1, 0, 1), face: false },
];

type DiskState = {
  disks: {
    position: THREE.Vector3;
    face: boolean;
  }[];
  addDisks: (v: { position: THREE.Vector3; face: boolean }) => void;
};

export const useDiskStore = create<DiskState>((set) => ({
  disks: [...initDisks],
  addDisks: (v) => set((state) => ({ disks: [...state.disks, v] })),
}));

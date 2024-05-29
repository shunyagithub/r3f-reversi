import * as THREE from "three";

export const getDiscPosition = (id: number) => {
  const posX = (id % 9) * 2 - 7;
  const posZ = Math.floor(id / 9) * 2 - 7;
  return new THREE.Vector3(posX, 0, posZ);
};

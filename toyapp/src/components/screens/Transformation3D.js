// https://www.youtube.com/watch?v=ukL12rEV0Sw
// https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/the-10-min/src/Transformation3D/Transformation3D.tsx

// This doesn't work. There's an error with useValues. And using version 1 (v1) of react-native-redash didn't solve the problem.

import React from "react";

import {
  matrixVecMul4,
  processTransform3d,
  useValues,
// } from "react-native-redash/lib/module/v1";
} from "react-native-redash";
// import {mix} from  "react-native-redash/lib/module/v1";
import { divide } from "react-native-reanimated";
// import { SIZE } from "./Constants";
import Gesture from "../../entities/Gesture";
import Face from "../../entities/Face";

const SIZE = 100;
/* export type Vec3 = {
  x: Animated.Adaptable<number>;
  y: Animated.Adaptable<number>;
  z: Animated.Adaptable<number>;
}; */

const backface = [
  { x: -0.5, y: -0.5, z: -0.5 },
  { x: 0.5, y: -0.5, z: -0.5 },
  { x: -0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: 0.5, z: -0.5 },
] /* as const */;

const frontface = [
  { x: -0.5, y: -0.5, z: 0.5 },
  { x: 0.5, y: -0.5, z: 0.5 },
  { x: -0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: 0.5, z: 0.5 },
] /* as const */;

const points3D = [...frontface, ...backface];
/*
const serialize = (p1: Vector, p2: Vector, p3: Vector, p4: Vector) =>
  string`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`;
*/
const Transformations3D = () => {
  const [rotateX, rotateY] = useValues([0, 0]);
  const transform = processTransform3d([{ rotateY }, { rotateX }]);
  const points = points3D.map((p) => {
    const [x, y, z, w] = matrixVecMul4(transform, [
      p.x * SIZE,
      p.y * SIZE,
      p.z * SIZE,
      1,
    ]);
    return { x: divide(x, w), y: divide(y, w), z: divide(z, w) };
  });
  const [p1, p2, p3, p4, p5, p6, p7, p8] = points;
  return (
    <>
      <Face backgroundColor="#1abc9c" points={[p1, p2, p3, p4]} />
      <Face backgroundColor="#3498db" points={[p5, p6, p7, p8]} />
      <Face backgroundColor="#2ecc71" points={[p1, p2, p5, p6]} />
      <Face backgroundColor="#e74c3c" points={[p3, p4, p7, p8]} />
      <Face backgroundColor="#9b59b6" points={[p2, p4, p6, p8]} />
      <Face backgroundColor="#e67e22" points={[p1, p3, p5, p7]} />
      <Gesture {...{ rotateX, rotateY }} />
    </>
  );
};

export default Transformations3D;
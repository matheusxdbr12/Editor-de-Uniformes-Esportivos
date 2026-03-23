import * as THREE from 'three';

export function createShapeFromPath(pathData: string): THREE.Shape {
  const shape = new THREE.Shape();
  const commands = pathData.match(/[a-df-z][^a-df-z]*/ig);
  if (!commands) return shape;

  let currentPoint = new THREE.Vector2();

  for (const cmd of commands) {
    const type = cmd[0];
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

    switch (type) {
      case 'M':
        shape.moveTo(args[0], -args[1]);
        currentPoint.set(args[0], -args[1]);
        break;
      case 'L':
        shape.lineTo(args[0], -args[1]);
        currentPoint.set(args[0], -args[1]);
        break;
      case 'Q':
        shape.quadraticCurveTo(args[0], -args[1], args[2], -args[3]);
        currentPoint.set(args[2], -args[3]);
        break;
      case 'Z':
      case 'z':
        shape.closePath();
        break;
    }
  }

  return shape;
}

import { Color4 } from '@babylonjs/core';

export function rgbToColor(r: number, g: number, b: number, a: number = 1): Color4 {
  return new Color4((r / 255), (g / 255), (b / 255), a);
}

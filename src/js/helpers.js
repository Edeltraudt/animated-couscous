import { Color3, Color4 } from '@babylonjs/core';

export function rgbToColor(r, g, b, a = 1) {
  if (a !== 1) {
    return new Color4((r / 255), (g / 255), (b / 255), a);
  } else {
    return new Color3((r / 255), (g / 255), (b / 255));
  }
}

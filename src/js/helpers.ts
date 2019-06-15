import { Color4 } from '@babylonjs/core';

export function rgbToColor(r: number, g: number, b: number, a: number = 1): Color4 {
  return new Color4((r / 255), (g / 255), (b / 255), a);
}

export function random(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low) + low);
}

export function shuffle(array: Array<any>) {
  var j, x, i;

  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }

  return array;
}

import { Color3, Color4 } from '@babylonjs/core';

/**
 * Transforms RGB(A) values to Color4 processable units
 * and returns the resulting color object.
 */
export function rgbToColor(r: number, g: number, b: number, a: number = 1): Color4 {
  return new Color4((r / 255), (g / 255), (b / 255), a);
}

/**
 * Transforms RGB values to Color3 processable units and
 * returns the resulting color object.
 */
export function rgbToColor3(r: number, g: number, b: number): Color3 {
  return new Color3((r / 255), (g / 255), (b / 255));
}

/**
 * Generates a random number between a lower and upper limit.
 */
export function random(low: number, high: number): number {
  return Math.floor(Math.random() * (high - low) + low);
}

/**
 * Modern Fisher–Yates algorithm to shuffle the values
 * of an array.
 */
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

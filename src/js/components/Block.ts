import { Color3, Color4, Vector3, StandardMaterial, Material, Scene } from "@babylonjs/core";

import { rgbToColor } from '../helpers';

const blockColors = [
  { key: 'default', color: rgbToColor(30, 39, 46 )},
  { key: 'red', color: rgbToColor(232, 65, 24 )},
  { key: 'orange', color: rgbToColor(253, 150, 68 )},
  { key: 'yellow', color: rgbToColor(251, 197, 49 )},
  { key: 'green', color: rgbToColor(76, 209, 55 )},
  { key: 'blue', color: rgbToColor(0, 168, 255 )},
  { key: 'white', color: rgbToColor(245, 246, 250 )}
];

export class Block {
  faceColors: [Color4, Color4, Color4, Color4, Color4, Color4];
  material: StandardMaterial;
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.material = new StandardMaterial('boxMaterial', this.scene);
    this.material.specularColor = new Color3(0.2, 0.2, 0.2);
  }

  setFaceColors(values: [{ index: number, colorKey: number }]) {
    values.forEach(value => {
      this.faceColors[value.index] = blockColors[value.colorKey].color;
    });
  }

  set position(vector: Vector3) {
    this.position = vector;
  }

  get position() {
    return this.position;
  }

  set rotation(vector: Vector3) {
    this.rotation = vector;
  }

  get rotation() {
    return this.rotation;
  }

  render() {

  }
}

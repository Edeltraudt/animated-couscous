import { Color3, Color4, Vector3, StandardMaterial, Material, Scene, MeshBuilder, Mesh } from "@babylonjs/core";

import { rgbToColor } from '../helpers';

const blockColors = [
  { key: 'default', color: rgbToColor(30, 39, 46) },
  { key: 'red', color: rgbToColor(234, 32, 39) },
  { key: 'orange', color: rgbToColor(255, 121, 63) },
  { key: 'yellow', color: rgbToColor(251, 197, 49) },
  { key: 'green', color: rgbToColor(62, 165, 18) },
  { key: 'blue', color: rgbToColor(0, 168, 255) },
  { key: 'white', color: rgbToColor(245, 246, 250) }
];

export class Block {
  faceColors: Array<Color4>;
  material: StandardMaterial;
  scene: Scene;
  box: Mesh;
  key: string;

  constructor(key: string, scene: Scene) {
    this.scene = scene;
    this.material = new StandardMaterial('boxMaterial', this.scene);
    this.material.specularColor = new Color3(0.2, 0.2, 0.2);
    this.key = key;
    this.faceColors = [
      blockColors['default'], blockColors['default'], blockColors['default'],
      blockColors['default'], blockColors['default'], blockColors['default']
    ];
  }

  setFaceColors(values: [{ index: number, colorKey: number }]) {
    values.forEach(value => {
      this.faceColors[value.index] = blockColors[value.colorKey].color;
    });
  }

  set position(vector: Vector3) {
    if (this.box !== null) {
      this.box.position = vector;
    }
  }

  get position(): Vector3 {
    if (this.box !== null) {
      return this.box.position;
    } else {
      return Vector3.Zero();
    }
  }

  set rotation(vector: Vector3) {
    this.rotation = vector;
  }

  get rotation(): Vector3 {
    if (this.box !== null) {
      return this.box.rotation;
    } else {
      return Vector3.Zero();
    }
  }

  render(position: Vector3): Mesh {
    this.box = MeshBuilder.CreateBox(this.key, {
      size: 1,
      faceColors: this.faceColors
    }, this.scene);
    this.box.material = this.material;
    this.position = position;

    return this.box;
  }
}

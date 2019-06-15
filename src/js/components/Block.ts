import { Color3, Color4, Vector3, StandardMaterial, Material, Scene, MeshBuilder, Mesh } from "@babylonjs/core";

import { rgbToColor } from '../helpers';
import { COLORS } from "./Colors";

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
      COLORS[0].color, COLORS[0].color, COLORS[0].color,
      COLORS[0].color, COLORS[0].color, COLORS[0].color
    ];
  }

  setFaceColors(values: [{ index: number, color: Color4 }]) {
    values.forEach(value => {
      this.faceColors[value.index] = value.color;
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

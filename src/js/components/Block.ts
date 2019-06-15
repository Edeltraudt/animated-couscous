import { Color3, Color4, Vector3, StandardMaterial, Scene, MeshBuilder, Mesh } from "@babylonjs/core";

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

  rotateFaceColors(axis: Vector3, amount: number) {
    const clone = this.faceColors.slice(0);

    if (axis.x > 0) {
      if (amount > 0) {
        this.faceColors[0] = clone[4];
        this.faceColors[1] = clone[5];
        this.faceColors[4] = clone[1];
        this.faceColors[5] = clone[0];
      } else {
        this.faceColors[0] = clone[5];
        this.faceColors[1] = clone[4];
        this.faceColors[4] = clone[0];
        this.faceColors[5] = clone[1];
      }
    } else if (axis.y > 0) {
      if (amount > 0) {
        this.faceColors[0] = clone[3];
        this.faceColors[1] = clone[2];
        this.faceColors[2] = clone[0];
        this.faceColors[3] = clone[1];
      } else {
        this.faceColors[0] = clone[2];
        this.faceColors[1] = clone[3];
        this.faceColors[2] = clone[1];
        this.faceColors[3] = clone[0];
      }
    } else if (axis.z > 0) {
      if (amount > 0) {
        this.faceColors[2] = clone[4];
        this.faceColors[3] = clone[5];
        this.faceColors[4] = clone[2];
        this.faceColors[5] = clone[3];
      } else {
        this.faceColors[2] = clone[5];
        this.faceColors[3] = clone[4];
        this.faceColors[4] = clone[3];
        this.faceColors[5] = clone[2];
      }
    }
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

  get rotation() {
    if (this.box !== null) {
      return this.box.rotation;
    } else {
      // return Vector3.Zero();
    }
  }

  getColor(face: Vector3) {
    if (face.z > 0) {
      return this.faceColors[0];
    } else if (face.z < 0) {
      return this.faceColors[1];
    } else if (face.x > 0) {
      return this.faceColors[2];
    } else if (face.x < 0) {
      return this.faceColors[3];
    } else if (face.y > 0) {
      return this.faceColors[4];
    } else if (face.y < 0) {
      return this.faceColors[5];
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

import { Color3, Color4, Vector3, StandardMaterial, Scene, MeshBuilder, Mesh } from "@babylonjs/core";

import { COLORS } from "./Colors";
import { rgbToColor } from "../helpers";

export class Block {
  faceColors: Array<Color4>;
  material: StandardMaterial;
  scene: Scene;
  box: Mesh;
  key: string;
  position: Vector3;

  constructor(key: string, scene: Scene) {
    const defaultColor = rgbToColor(30, 39, 46);

    this.scene = scene;
    this.material = new StandardMaterial('boxMaterial', this.scene);
    this.material.specularColor = new Color3(0.2, 0.2, 0.2);
    this.key = key;
    this.faceColors = [
      defaultColor, defaultColor, defaultColor,
      defaultColor, defaultColor, defaultColor
    ];
  }

  setFaceColors(values: [{ index: number, color: Color4 }]): void {
    values.forEach(value => {
      this.faceColors[value.index] = value.color;
    });
  }

  setFaceColor(index: number, color: Color4): void {
    this.faceColors[index] = color;
  }

  setFaceColorFromVector(face: Vector3, color: Color4): void {
    this.faceColors[this._getIndex(face)] = color;
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
        this.faceColors[2] = clone[5];
        this.faceColors[3] = clone[4];
        this.faceColors[4] = clone[2];
        this.faceColors[5] = clone[3];
      } else {
        this.faceColors[2] = clone[4];
        this.faceColors[3] = clone[5];
        this.faceColors[4] = clone[3];
        this.faceColors[5] = clone[2];
      }
    }
  }

  // set position(vector: Vector3) {
  //   if (this.box !== null) {
  //     this.box.position = vector;
  //   }
  // }

  // get position(): Vector3 {
  //   if (this.box !== null) {
  //     return this.box.position;
  //   } else {
  //     return Vector3.Zero();
  //   }
  // }

  get rotation() {
    if (this.box !== null) {
      return this.box.rotation;
    } else {
      // return Vector3.Zero();
    }
  }

  getColor(face: Vector3) {
    return this.faceColors[this._getIndex(face)];
  }

  getColors(face: Vector3) {
    const colors = { x: null, y: null, z: null };

    if (face.z > 0) {
      colors.z = this.faceColors[0];
    } else if (face.z < 0) {
      colors.z = this.faceColors[1];
    } else if (face.x > 0) {
      colors.x = this.faceColors[2];
    } else if (face.x < 0) {
      colors.x = this.faceColors[3];
    } else if (face.y > 0) {
      colors.x = this.faceColors[4];
    } else if (face.y < 0) {
      colors.x = this.faceColors[5];
    }

    return colors;
  }

  render(position?: Vector3): Mesh {
    if (position) this.position = position;
    else this.position = this.box.position;
    if (this.box) this.box.dispose();

    this.box = MeshBuilder.CreateBox(this.key, {
      size: 1,
      faceColors: this.faceColors
    }, this.scene);
    this.box.material = this.material;
    this.box.position = this.position;


    return this.box;
  }

  _getIndex(face: Vector3) {
    if (face.z > 0) return 0;
    else if (face.z < 0) return 1;
    else if (face.x > 0) return 2;
    else if (face.x < 0) return 3;
    else if (face.y > 0) return 4;
    else if (face.y < 0) return 5;
  }
}

import { Color3, Color4, Vector3, StandardMaterial, Scene, MeshBuilder, Mesh } from "@babylonjs/core";

import { rgbToColor } from "../helpers";

/**
 * A Block holds both the representation and logic of a single cube
 * inside the Rubik's cube.
 */
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

  /**
   * Sets all possible face colors and completely overrides the local
   * face colors array duplicate.
   */
  setFaceColors(values: [{ index: number, color: Color4 }]): void {
    values.forEach(value => {
      this.faceColors[value.index] = value.color;
    });
  }

  /**
   * Sets the face color of an index.
   */
  setFaceColor(index: number, color: Color4): void {
    this.faceColors[index] = color;
  }

  /**
   * Sets the face color on an exposed side.
   * Expects vector with a single non-zero value.
   */
  setFaceColorFromVector(face: Vector3, color: Color4): void {
    this.faceColors[this._getIndex(face)] = color;
  }

  /**
   * Handles rotation of the face colors separately.
   * Takes the same rotation arguments as the regular rotation method.
   *
   * @description Face colors are not an accessible property of the mesh,
   * so we have to keep track of the face colors in a duplicate array and
   * update it accordingly in order ot be able to match the colors.
   */
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

  get rotation(): Vector3 {
    if (this.box !== null) {
      return this.box.rotation;
    }

    return Vector3.Zero();
  }

  /**
   * Returns the face color for a given (exposed) axis.
   * Expects vector with a single non-zero value.
   */
  getFaceColor(face: Vector3): Color4 {
    return this.faceColors[this._getIndex(face)];
  }

  /**
   * Returns visible face colors.
   * Expects a vector with any amount of values.
   */
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

  /**
   * Renders the mesh of the box at the given position.
   * Disposes of the previous mesh, if available.
   */
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

  /**
   * Returns the corresponding faceColors array index for the exposed face.
   * Expects vector with a single non-zero value.
   */
  _getIndex(face: Vector3) {
    if (face.z > 0) return 0;
    else if (face.z < 0) return 1;
    else if (face.x > 0) return 2;
    else if (face.x < 0) return 3;
    else if (face.y > 0) return 4;
    else if (face.y < 0) return 5;
  }
}

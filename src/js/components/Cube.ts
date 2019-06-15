import { StandardMaterial, Scene, Vector3, TransformNode, Mesh, Animation, Color4 } from '@babylonjs/core';
import { Block } from './Block';
import { COLORS } from './Colors';
import { random, shuffle } from '../helpers';

export class Cube {
  size: number = 3;
  model: Array<any>;
  material: StandardMaterial;
  scene: Scene;
  centerOffset: number = 0;
  rotationCounter: number = 0;
  gap: number = 0.05;

  constructor(size: number, scene: Scene) {
    this.size = size;
    this.scene = scene;
    this.centerOffset = (size - 1) / 2;

    this.build();
  }

  /**
   * Build the internal cube reference.
   */
  build(): void {
    this.model = this._createMatrix(this.size, (matrix, x, y) => {
      const key = '' + x + y;

      for (let z = 0; z < this.size; z++) {
        matrix[x][y][z] = new Block(key + z, this.scene);
      }
    });
  }

  /**
   * Render and randomly paint all individual blocks inside the cube.
   */
  render(): void {
    const colors = this._colors();

    for (let x = 0; x < this.model.length; x++) {
      for (let y = 0; y < this.model[x].length; y++) {
        for (let z = 0; z < this.model[x][y].length; z++) {
          const block = this.model[x][y][z];
          let faces = [];

          if (x === this.size - 1) {
            faces.push({ index: 2, color: colors.pop() });
          } else if (x === 0) {
            faces.push({ index: 3, color: colors.pop() });
          }

          if (y === this.size - 1) {
            faces.push({ index: 4, color: colors.pop() });
          } else if (y === 0) {
            faces.push({ index: 5, color: colors.pop() });
          }

          if (z === this.size - 1) {
            faces.push({ index: 0, color: colors.pop() });
          } else if (z === 0) {
            faces.push({ index: 1, color: colors.pop() });
          }

          block.setFaceColors(faces);
          block.render(new Vector3(
            x - this.centerOffset - this.gap + (this.gap * x),
            y - this.centerOffset - this.gap + (this.gap * y),
            z - this.centerOffset - this.gap + (this.gap * z)
          ));
        }
      }
    }
  }

  /**
   * Animate the rotation of an axis by the specified amount.
   */
  rotateAxis(axis: Vector3, amount: number) {
    const root = new TransformNode('rotationAxis');
    const axes = ['x', 'y', 'z'];
    let animationTarget: string = '';
    let boxArray: Array<Mesh> = [];
    let modelClone: ([]|Block)[] = this._createMatrix();

    // get and group all boxes affected by the rotation
    for (let x = 0; x < this.model.length; x++) {
      for (let y = 0; y < this.model[x].length; y++) {
        for (let z = 0; z < this.model[x][y].length; z++) {
          if ((axis.x > 0 && (x === axis.x - 1)) ||
              (axis.y > 0 && (y === axis.y - 1)) ||
              (axis.z > 0 && (z === axis.z - 1))) {
            boxArray.push(this.model[x][y][z].box);
            modelClone[x][y][z] = this.model[x][y][z];
            this.model[x][y][z].box.parent = root;
          }
        }
      }
    }

    // set the rotation animation target axis
    axes.forEach(_axis => {
      if (axis[_axis] > 0) {
        animationTarget = 'rotation.' + _axis;
      }
    });

    // animation
    const framerate: number = 20;
    const animation = new Animation('rotationAnimation', animationTarget,
      framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    let keyframes = [];

    keyframes.push({ frame: 0, value: 0 });
    keyframes.push({ frame: framerate / 4, value: amount });
    animation.setKeys(keyframes);


    this.scene.beginDirectAnimation(root, [animation], 0, framerate, false, undefined, () => {
      // once the animation is finished, apply the transformations
      this._rotateInternal(boxArray, modelClone, axis, amount);
    });
  }

  _colors(): Array<Color4> {
    const perSide = this.size * this.size;
    const colors = new Array<Color4>();
    let sides = 6 + 1;

    while(--sides) {
      for (let i = 0; i < perSide; i++) {
        colors.push(COLORS[sides].color);
      }
    }

    return shuffle(colors);
  }

  _rowColors(): Array<Color4> {
    const colors = new Array<Color4>();

    for (let i = 0; i < this.size; i++) {
      colors.push(COLORS[random(0, COLORS.length)].color);
    }

    return colors;
  }

  /**
   * Update the rotation for all blocks inside the rotated axis
   */
  _rotateInternal(boxes: Array<Mesh>, modelClone: ([]|Block)[], axis, amount) {
    boxes.forEach(box => {
      const oldPos = box.position.clone();
      const arrX = this._getIndexFromPosition(box.position.x);
      const arrY = this._getIndexFromPosition(box.position.y);
      const arrZ = this._getIndexFromPosition(box.position.z);
      let newX = box.position.x;
      let newY = box.position.y;
      let newZ = box.position.z;

      // remove box from animation parent, resetting the position
      box.parent = null;

      // apply rotation for each box inside the matrix
      box.rotateAround(Vector3.Zero(), axis, amount);

      // calculate new positions in the matrix
      if (axis.x > 0) {
        newZ = oldPos.y * Math.sign(amount);
        newY = oldPos.z * Math.sign(amount * -1);
      } else if (axis.y > 0) {
        newX = oldPos.z * Math.sign(amount);
        newZ = oldPos.x * Math.sign(amount * -1);
      } else if (axis.z > 0) {
        newY = oldPos.x * Math.sign(amount);
        newX = oldPos.y * Math.sign(amount * -1);
      }

      // apply position rotation to box representations
      box.position.x = newX;
      box.position.y = newY;
      box.position.z = newZ;

      // apply position rotation to model reference matrix
      const newArrX = this._getIndexFromPosition(newX);
      const newArrY = this._getIndexFromPosition(newY);
      const newArrZ = this._getIndexFromPosition(newZ);
      this.model[newArrX][newArrY][newArrZ] =
           modelClone[arrX][arrY][arrZ];
    });
  }

  /**
   * Translates a box position inside the world to an array index.
   */
  _getIndexFromPosition(position) {
    return (position - (this.gap * Math.sign(position))) + 1;
  }

  /**
   * Builds an empty 3D-matrix.
   * Optionally takes a function to populate the cells.
   */
  _createMatrix(size: number = this.size, fillFn?: (matrix, x, y) => void): Array<any> {
    const matrix = new Array(size);

    for (let x = 0; x < size; x++) {
      matrix[x] = new Array(size);

      for (let y = 0; y < size; y++) {
        matrix[x][y] = new Array(size);

        if (fillFn) fillFn(matrix, x, y);
      }
    }

    return matrix;
  }
}

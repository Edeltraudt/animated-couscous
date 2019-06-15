import { StandardMaterial, Scene, Vector3, TransformNode, Mesh, Animation } from '@babylonjs/core';
import { Block } from './Block';

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
   * Build the internal cube reference
   */
  build(): void {
    this.model = this._createMatrix(this.size, (matrix, x, y) => {
      const key = '' + x + y;

      for (let z = 0; z < this.size; z++) {
        matrix[x][y][z] = new Block(key + z, this.scene);
      }
    });
  }

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

  /**
   * Render and paint all individual blocks inside the cube.
   */
  render(): void {
    for (let x = 0; x < this.model.length; x++) {
      for (let y = 0; y < this.model[x].length; y++) {
        for (let z = 0; z < this.model[x][y].length; z++) {
          const block = this.model[x][y][z];
          let faces = [];

          if (x === this.size - 1) {
            faces.push({ index: 2, colorKey: 1 });
          } else if (x === 0) {
            faces.push({ index: 3, colorKey: 4 });
          }

          if (y === this.size - 1) {
            faces.push({ index: 4, colorKey: 2 });
          } else if (y === 0) {
            faces.push({ index: 5, colorKey: 5 });
          }

          if (z === this.size - 1) {
            faces.push({ index: 0, colorKey: 3 });
          } else if (z === 0) {
            faces.push({ index: 1, colorKey: 6 });
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

      // remove the box from the rotation animation parent
      box.parent = null;

      // apply rotation for each box inside the matrix
      box.rotate(axis, amount);

      // translate the representation to the updated position
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

      box.position.x = newX;
      box.position.y = newY;
      box.position.z = newZ;

      const newArrX = this._getIndexFromPosition(newX);
      const newArrY = this._getIndexFromPosition(newY);
      const newArrZ = this._getIndexFromPosition(newZ);
      this.model[newArrX][newArrY][newArrZ] =
           modelClone[arrX][arrY][arrZ];
    });
  }

  _getIndexFromPosition(position) {
    return (position - (this.gap * Math.sign(position))) + 1;
  }
}

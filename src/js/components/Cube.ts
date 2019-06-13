import { StandardMaterial, Scene, Vector3, TransformNode, ModelShape, Mesh, Animation } from '@babylonjs/core';
import { Block } from './Block';

export class Cube {
  size: number = 3;
  model: Array<any>;
  material: StandardMaterial;
  scene: Scene;
  centerOffset: number = 0;

  constructor(size: number, scene: Scene) {
    this.size = size;
    this.scene = scene;
    this.centerOffset = (size - 1) / 2;

    this.build();
  }

  build(): void {
    this.model = new Array(this.size);

    for (let x = 0; x < this.size; x++) {
      this.model[x] = new Array(this.size);

      for (let y = 0; y < this.model[x].length; y++) {
        const key = '' + x + y;
        this.model[x][y] = new Array(this.size);

        for (let z = 0; z < this.model[x][y].length; z++) {
          this.model[x][y][z] = new Block(key + z, this.scene);
        }
      }
    }
  }

  render(): void {
    for (let x = 0; x < this.model.length; x++) {
      for (let y = 0; y < this.model[x].length; y++) {
        for (let z = 0; z < this.model[x][y].length; z++) {
          const block = this.model[x][y][z];
          const gap = 0.05;
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
            x - this.centerOffset - gap + (gap * x),
            y - this.centerOffset - gap + (gap * y),
            z - this.centerOffset - gap + (gap * z)
          ));
        }
      }
    }
  }

  rotateAxis(axis: Vector3, amount: number) {
    const root = new TransformNode('rotationAxis');
    const axes = ['x', 'y', 'z'];
    let animationTarget: string = '';
    let boxArray: Array<Mesh> = [];

    // get and group all boxes affected by the rotation
    for (let x = 0; x < this.model.length; x++) {
      for (let y = 0; y < this.model[x].length; y++) {
        for (let z = 0; z < this.model[x][y].length; z++) {
          if ((axis.x > 0 && (x === axis.x - 1)) ||
              (axis.y > 0 && (y === axis.y - 1)) ||
              (axis.z > 0 && (z === axis.z - 1))) {
            boxArray.push(this.model[x][y][z].box);
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
      this._rotateInternal(boxArray, axis, amount);
    });
  }

  _rotateInternal(boxes: Array<Mesh>, axis, amount) {
    boxes.forEach(box => {
      const oldPos = box.position.clone();

      // remove the box from the rotation animation parent
      box.parent = null;

      // apply rotation for each box inside the matrix
      box.rotate(axis, amount);

      // translate the representation to the updated position
      if (axis.x > 0) {
        box.position.z = oldPos.y * Math.sign(amount);
        box.position.y = oldPos.z * Math.sign(amount * -1);
      } else if (axis.y > 0) {
        box.position.x = oldPos.z * Math.sign(amount);
        box.position.z = oldPos.x * Math.sign(amount * -1);
      } else if (axis.z > 0) {
        box.position.y = oldPos.x * Math.sign(amount);
        box.position.x = oldPos.y * Math.sign(amount * -1);
      }
    });
  }
}

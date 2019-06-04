import { StandardMaterial, Scene, Vector3, TransformNode, ModelShape, Mesh } from '@babylonjs/core';
import { Block } from './Block';

export class Cube {
  size: number = 3;
  model: Array<any>;
  material: StandardMaterial;
  scene: Scene;
  centerOffset: number = 0;
  blocks: Array<Mesh> = [];

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
          let faces = [];
          const block = this.model[x][y][z];

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
            x - this.centerOffset,
            y - this.centerOffset,
            z - this.centerOffset
          ));

          this.blocks.push(block.box);
        }
      }
    }
  }

  rotateAxis(axis: Vector3, amount: number) {
    const root = new TransformNode('rotationAxis');
    let rotationAxis = new Vector3(0, 0, 0);
    let boxArray = [];

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

    if (axis.x > 0)  rotationAxis.x = 1;
    if (axis.y > 0)  rotationAxis.y = 1;
    if (axis.z > 0)  rotationAxis.z = 1;

    root.rotate(rotationAxis, amount);

    boxArray.forEach(box => {
      box.parent = null;
      box.rotationQuaternion = root.rotationQuaternion;
    });
    console.log(root);

    // root.dispose();
  }
}

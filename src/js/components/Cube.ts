import { StandardMaterial, Scene } from '@babylonjs/core';
import { Block } from './Block';

export class Cube {
  size: number = 3;
  model: Array<any>;
  material: StandardMaterial;
  scene: Scene;

  constructor(size: number, scene: Scene) {
    this.size = size;
    this.scene = scene;
    this.build();
  }

  build() {
    this.model = new Array(this.size);

    for (let x = 0; x < this.size; x++) {
      this.model[x] = new Array(this.size);

      for (let y = 0; y < this.size; y++) {
        this.model[x][y] = new Array(this.size);

        for (let z = 0; z < this.size; z++) {
          this.model[x][y][z] = new Block(this.scene);
        }
      }
    }

    console.log(this.model);

  }

  render() {

  }
}

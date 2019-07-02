import { StandardMaterial, Scene, Vector3, TransformNode, Mesh, Animation, Color4, HighlightLayer, Color3 } from '@babylonjs/core';
import { Block } from './Block';
import { COLORS } from './Colors';
import { random, rgbToColor3 } from '../helpers';

/**
 * The game object.
 * Summarises an array of little cubes depending on the size (side)
 * of the cube.
 */
export class Cube {
  size: number = 3;
  gap: number = 0.05;
  colorCount: number;
  centerOffset: number = 0;

  score: number = 0;
  scoreElement = document.querySelector('.js-score');
  scoreFillerElement = document.querySelector('.js-score-filler');

  material: StandardMaterial;
  scene: Scene;

  /**
   * Array representation of the size x size x size cube.
   * Holds all single Blocks inside the Cube.
   */
  model: Array<any>;

  /**
   * HighlightLayer for highlighting matching cubes.
   */
  hl: HighlightLayer;

  /**
   * Determines if the player can rotate.
   * Serves as a blocker in order to let the animation group rotate first
   * before queuing the next animation.
   */
  isBlocked = false;

  constructor(size: number, scene: Scene) {
    this.size = size;
    this.scene = scene;
    this.centerOffset = (size - 1) / 2;
    this.hl = new HighlightLayer('hl', this.scene);

    this.build();
  }

  /**
   * Build the internal cube reference 3D-array.
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
   * Will take an optional argument of the amount of colors to be generated.
   */
  render(colorCount: number = 4): void {
    const colors = this._colors(colorCount);
    this.colorCount = colorCount;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.size; z++) {
          const block = this.model[x][y][z];
          let faces = [];

          if (z === this.size - 1) {
            faces.push({ index: 0, color: colors.pop() });
          } else if (z === 0) {
            faces.push({ index: 1, color: colors.pop() });
          }

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

          block.setFaceColors(faces);
          block.render(new Vector3(
            x - this.centerOffset - this.gap + (this.gap * x),
            y - this.centerOffset - this.gap + (this.gap * y),
            z - this.centerOffset - this.gap + (this.gap * z)
          ));
        }
      }
    }

    this._checkMatches();
  }

  /**
   * Animate the rotation of an axis by the specified amount.
   *
   * @description Groups the single Blocks together in a transform node
   * to handle the rotation in a collective in order to animate it.
   */
  rotateAxis(axis: Vector3, amount: number) {
    const root = new TransformNode('rotationAxis');
    const axes = ['x', 'y', 'z'];
    let animationTarget: string = '';
    let blockArray: Array<Block> = [];
    let modelClone: ([]|Block)[] = this._createMatrix();

    // get and group all boxes affected by the rotation
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.size; z++) {
          if ((axis.x > 0 && (x === axis.x - 1)) ||
              (axis.y > 0 && (y === axis.y - 1)) ||
              (axis.z > 0 && (z === axis.z - 1))) {
            blockArray.push(this.model[x][y][z]);
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


    this.isBlocked = true;
    this.scene.beginDirectAnimation(root, [animation], 0, framerate, false, undefined, () => {
      // once the animation is finished, apply the transformations
      this._rotateInternal(blockArray, modelClone, axis, amount);
      this.isBlocked = false;
      this._checkMatches();
    });
  }

  /**
   * Update the rotation for all blocks inside the rotated axis.
   * Calculates the updated vector positions of the cubes.
   *
   * @description Disbands the animation group before the permanent
   * rotation is applied to the single cubes.
   */
  _rotateInternal(blocks: Array<Block>, modelClone: ([] | Block)[], axis, amount) {
    blocks.forEach(block => {
      const box = block.box;
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
      block.key = '' + newArrX + newArrY + newArrZ;

      // rotate the face colors representation for win condition check
      block.rotateFaceColors(axis, amount);
    });
  }

  /**
   * Checks the cube for 3-in-a-row.
   */
  _checkMatches() {
    // iterate over axes
    for (let x = 0; x < 3; x++) {
      const exposedSide = new Vector3(
        x === 0 ? 1 : 0,
        x === 1 ? 1 : 0,
        x === 2 ? 1 : 0
      );

      // iterate over columns/rows
      for (let y = 0; y < this.size; y++) {
        let previous = { col: null, row: null };
        let match = { col: true, row: true };
        let matches = { col: [], row: [] };

        // iterate over items
        for (let z = 0; z < this.size; z++) {
          // both column and row
          for (let rowOrColumn in match) {
            let order = {};
            order[x] = this.size - 1;

            if (rowOrColumn === 'row') {
              order[(x + 1) % 3] = y;
              order[(x + 2) % 3] = z;
            } else {
              order[(x + 1) % 3] = z;
              order[(x + 2) % 3] = y;
            }

            const block = this.model[order[0]][order[1]][order[2]];

            matches[rowOrColumn].push(block);

            if (previous[rowOrColumn] !== null) {
              if (previous[rowOrColumn].getFaceColor(exposedSide) !==
                  block.getFaceColor(exposedSide)) {
                match[rowOrColumn] = false;
                matches[rowOrColumn] = [];
              }
            }

            previous[rowOrColumn] = block;
          }
        }

        if (match.col) {
          this._replaceRow(matches.col, exposedSide);
          this._score(300);
        }
        if (match.row) {
          this._replaceRow(matches.row, exposedSide);
          this._score(300);
        }
      }
    }
  }

  /**
   * Replaces face colors on one row of cubes.
   *
   * @description First highlights the affected meshes and then replaces
   * the row with newly generated (random) face colors.
   */
  _replaceRow(blocks: Array<Block>, side: Vector3) {
    const colors = this._rowColors();
    blocks.forEach(block => {
      this.hl.addMesh(block.box, rgbToColor3(255, 255, 102));

      // updates the colors only after a timeout to give the player
      // enough time to see the highlight
      window.setTimeout(() => {
        this.hl.removeMesh(block.box);
        block.setFaceColorFromVector(side, colors.pop());
        block.render();
      }, 300)
    });
  }

  /**
   * Generates an array of randomised colors for the entire cube.
   */
  _colors(colorCount: number = this.colorCount || COLORS.length): Array<Color4> {
    const colors = new Array<Color4>();
    let total = this.size * this.size * 6;

    while(total--) {
      colors.push(COLORS[random(0, colorCount)].color);
    }

    return colors;
  }

  /**
   * Generates an array of randomised colors for one row.
   */
  _rowColors(colorCount: number = this.colorCount || COLORS.length): Array<Color4> {
    const colors = new Array<Color4>();

    for (let i = 0; i < this.size; i++) {
      colors.push(COLORS[random(0, colorCount)].color);
    }

    return colors;
  }

  /**
   * Updates score and score display.
   *
   * @description For style points, the score counter has a secondary
   * display that visually pads the number with leading zeros in half opacity.
   * This function handles the amount of zeros depending on the score to leave
   * the alignment of numbers intact.
   */
  _score(add: number) {
    this.score += add;

    const previousLength = this.scoreElement.textContent.length;
    const scoreStr = this.score.toString();
    const diff = previousLength - scoreStr.length;

    if (diff < 0) {
      this.scoreFillerElement.textContent =
        this.scoreFillerElement.textContent.slice(0, diff);
    }

    this.scoreElement.textContent = scoreStr;
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

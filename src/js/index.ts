import { rgbToColor } from './helpers';
import { Cube } from './components/Cube';

import '../scss/styles.scss';

import { Engine, Scene, ArcRotateCamera, DirectionalLight, Vector3, PointLight } from '@babylonjs/core';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement> document.getElementById('view');
  const engine = new Engine(canvas, true, { stencil: true });
  const controls = document.querySelector('.controls');
  const difficultySettings = document.querySelectorAll('.difficulty');
  let camera: ArcRotateCamera;
  let cube: Cube;
  let scene: Scene;
  let colorCount = 4;

  const createScene = function() {
    const scene = new Scene(engine);
    scene.clearColor = rgbToColor(15, 15, 15, 0);

    camera = new ArcRotateCamera('camera', Math.PI / 4, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());

    // disable zoom
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;

    new DirectionalLight('sunLeft', new Vector3(-1, -2, -1), scene);
    new DirectionalLight('sunRight', new Vector3(1, 1, 1), scene);

    // point light from front
    const light = new PointLight('pointLight', new Vector3(-1, 0, 1), scene);
    light.parent = camera;
    cube = new Cube(3, scene);
    cube.render(colorCount);

    // initialise control buttons
    controls.classList.remove('-hidden');
    difficultySettings.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        colorCount = Number.parseInt(button.getAttribute('data-colors'));
        cube.render(colorCount);

        difficultySettings.forEach(btn => btn.classList.remove('-active'));
        button.classList.add('-active');
      })
    });

    return scene;
  }

  scene = createScene();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());

  // attach event listeners to all rotation control buttons
  controls.querySelectorAll('.controls-button').forEach(button => {
    button.addEventListener('click', e => {
      // only allow rotation trigger if the cube finished
      // executing the animation of the previous command
      if (!cube.isBlocked) {
        const axis = button.getAttribute('data-axis');
        const target = button.getAttribute('data-target');
        const axisVector = new Vector3();
        let amount = Math.PI / 2;

        // rotation the other way around feels better for z
        if (axis === 'z') amount *= -1;

        if (button.classList.contains('-inverse')) amount *= -1;

        axisVector[axis] = Number.parseInt(target);

        e.preventDefault();
        cube.rotateAxis(axisVector, amount);
      }
    });
  });
});

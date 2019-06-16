import { rgbToColor } from './helpers';
import { Cube } from './components/Cube';

import '../scss/styles.scss';

import { Engine, Scene, ArcRotateCamera, Animation, DirectionalLight, Vector3, PointLight } from '@babylonjs/core';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement> document.getElementById('view');
  const engine = new Engine(canvas, true, { stencil: true });
  const controls = document.querySelector('.controls');
  let camera: ArcRotateCamera;
  let cube: Cube;
  let scene: Scene;
  // let cameraPosition: Vector3;

  const createScene = function () {
    const scene = new Scene(engine);
    scene.clearColor = rgbToColor(15, 15, 15, 0);

    camera = new ArcRotateCamera('camera', Math.PI / 4, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    // camera.attachControl(canvas, false);
    // cameraPosition = camera.position.clone();

    // disable zoom
    camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;

    new DirectionalLight('sunLeft', new Vector3(-1, -2, -1), scene);
    new DirectionalLight('sunRight', new Vector3(1, 1, 1), scene);

    // point light from front
    const light = new PointLight('pointLight', new Vector3(-1, 0, 1), scene);
    light.parent = camera;
    cube = new Cube(3, scene);
    cube.render();

    controls.classList.remove('-hidden');

    return scene;
  }

  scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });

  /**
   * Animates the camera view back to the default position.
   */
  // const resetCamera = function(camera: ArcRotateCamera) {
  //   const animation = new Animation('cameraPosition', 'position', 30,
  //     Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
  //   const keyframes = [
  //     { frame: 0, value: camera.position },
  //     { frame: 20, value: cameraPosition }
  //   ];

  //   animation.setKeys(keyframes);
  //   camera.animations.push(animation);
  //   scene.beginAnimation(camera, 0, 20, false, 1, () => {
  //     camera.rebuildAnglesAndRadius();
  //   });
  // }

  // document.addEventListener('pointerup', function () {
  //   resetCamera(camera);
  //   controls.classList.remove('-hidden');
  // });

  // document.addEventListener('pointerdown', (e: Event) => {
  //   if (!(e.target instanceof Element &&
  //         e.target.classList.contains('controls-button'))) {
  //     controls.classList.add('-hidden');
  //   }
  // });

  controls.querySelectorAll('.controls-button').forEach(button => {
    button.addEventListener('click', e => {
      const axis = button.getAttribute('data-axis');
      const target = button.getAttribute('data-target');
      const axisVector = new Vector3();
      let amount = Math.PI / 2;

      // rotation the other way around feels better for x
      if (axis === 'z') amount *= -1;

      if (button.classList.contains('-inverse')) amount *= -1;

      axisVector[axis] = Number.parseInt(target);

      e.preventDefault();
      cube.rotateAxis(axisVector, amount);
    });
  });
});

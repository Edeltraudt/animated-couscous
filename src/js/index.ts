import { rgbToColor } from './helpers';
import { Cube } from './components/Cube';

import '../scss/styles.scss';

import { Engine, Scene, ArcRotateCamera, DirectionalLight, Vector3, PointLight } from '@babylonjs/core';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement> document.getElementById('view');
  const engine = new Engine(canvas, true);
  let cube: Cube;
  let scene: Scene;

  const createScene = function () {
    const scene = new Scene(engine);
    scene.clearColor = rgbToColor(15, 15, 15);

    const camera = new ArcRotateCamera('camera', Math.PI / 4, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    new DirectionalLight('sunLeft', new Vector3(-1, -1, -1), scene);
    new DirectionalLight('sunRight', new Vector3(1, 1, 1), scene);

    // point light from front
    const light = new PointLight('pointLight', new Vector3(-1, 0, 1), scene);
    light.parent = camera;
    cube = new Cube(3, scene);
    cube.render();

    return scene;
  }

  scene = createScene();

  scene.registerAfterRender(function () {
  });

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });

  document.addEventListener('click', function() {
    cube.rotateAxis(new Vector3(0, 2, 0), Math.PI / 2);
  });
});

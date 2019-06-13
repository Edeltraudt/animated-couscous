import { rgbToColor } from './helpers';
import { Cube } from './components/Cube';

import '../scss/styles.scss';

import { Engine, Scene, ArcRotateCamera, Animation, DirectionalLight, Vector3, PointLight } from '@babylonjs/core';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement> document.getElementById('view');
  const engine = new Engine(canvas, true);
  let camera: ArcRotateCamera;
  let cube: Cube;
  let scene: Scene;
  let cameraPosition: Vector3;

  const createScene = function () {
    const scene = new Scene(engine);
    scene.clearColor = rgbToColor(15, 15, 15);

    camera = new ArcRotateCamera('camera', Math.PI / 4, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, false);
    cameraPosition = camera.position.clone();

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

  const resetCamera = function(camera: ArcRotateCamera) {
    const animation = new Animation('cameraPosition', 'position', 30,
      Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyframes = [
      { frame: 0, value: camera.position },
      { frame: 20, value: cameraPosition }
    ];

    animation.setKeys(keyframes);
    camera.animations.push(animation);
    scene.beginAnimation(camera, 0, 20);
    // scene.beginAnimation(camera, 0, 100, false, 1);

    // scene.onBeforeRenderObservable.add(() => {
    //   camera.rebuildAnglesAndRadius();
    // });
  }

  document.addEventListener('pointerup', function () {
    console.log(camera);
    resetCamera(camera);
    // console.log(camera);
  });
});

import { rgbToColor } from './helpers';
import { Cube } from './components/Cube';

import '../scss/styles.scss';
import { Engine, Scene, ArcRotateCamera, StandardMaterial, Color3, MeshBuilder, DirectionalLight, Vector3, PointLight, ShadowGenerator } from '@babylonjs/core';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = <HTMLCanvasElement> document.getElementById('view');
  const engine = new Engine(canvas, true);

  const createScene = function () {
    const colors = {
      default:  rgbToColor( 30,  39,  46),
      red:      rgbToColor(232,  65,  24),
      orange:   rgbToColor(253, 150,  68),
      yellow:   rgbToColor(251, 197,  49),
      green:    rgbToColor( 76, 209,  55),
      blue:     rgbToColor(  0, 168, 255),
      white:    rgbToColor(245, 246, 250)
    };

    const scene = new Scene(engine);
    scene.clearColor = rgbToColor(15, 15, 15);

    const camera = new ArcRotateCamera('camera', Math.PI / 4, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    new DirectionalLight('sunLeft', new Vector3(-1, -1, -1), scene);
    new DirectionalLight('sunRight', new Vector3(1, 1, 1), scene);

    // point light from front
    const light = new PointLight('pointLight', new Vector3(-1, 0, 1), scene);
    light.parent = camera;

    const cube = new Cube(3, scene);
    cube.render();
    // cube.rotateAxis(new Vector3(0, 2, 0), Math.PI / 2);
    // cube.rotateAxis(new Vector3(0, 2, 0), Math.PI / 2);

    return scene;
  }


  const scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });
});

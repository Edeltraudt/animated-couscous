import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import { rgbToColor } from './helpers';

import '../scss/styles.scss';

window.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('view');
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const cubeSize = 3;

    const colors = {
      red: rgbToColor(232, 65, 24),
      orange: rgbToColor(253, 150, 68),
      yellow: rgbToColor(251, 197, 49),
      green: rgbToColor(76, 209, 55),
      blue: rgbToColor(0, 168, 255),
      white: rgbToColor(245, 246, 250)
    };

    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / -3, Math.PI / -3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    const faceColors = [colors['red'], colors['orange'], colors['yellow'], colors['green'], colors['blue'], colors['white'] ];
    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1, faceColors }, scene);
    const material = new BABYLON.StandardMaterial('boxMaterial', scene);
    material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    box.material = material;

    camera.setTarget(box);

    // 1-2 directional light sun from behind
    // point light from front
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    // var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 100, -1), scene);
    // light.diffuse = new BABYLON.Color3(1, 0, 0);
    // light.specular = new BABYLON.Color3(0, 1, 0);
    // light.groundColor = new BABYLON.Color3(0, 1, 0);

    // light.parent = camera;
    light.intensity = 2;

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

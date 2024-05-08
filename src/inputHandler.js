// inputHandler.js
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { keys, player } from './controls.js';
import { camera, scene } from './sceneSetup.js';
import renderer from './sceneSetup.js';

const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

controls.getObject().position.y = player.height;

document.addEventListener('click', function () {
    controls.lock();
}, false);

export default controls;

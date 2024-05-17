// sceneSetup.js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// post processing composer
export const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

export const outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
outlinePass.edgeStrength = 5.0;
outlinePass.edgeGlow = 1.0;
outlinePass.edgeThickness = 3.0;
outlinePass.pulsePeriod = 0;
// outlinePass.usePatternTexture = false; // patter texture for an object mesh
outlinePass.visibleEdgeColor.set("#1abaff"); // set basic edge color
outlinePass.hiddenEdgeColor.set("#1abaff"); // set edge color when it hidden by other objects
composer.addPass( outlinePass );

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
});

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);

// Add a directional light
const pointLight = new THREE.PointLight(0xffffff, 100, 900, 1);
pointLight.position.set(0, 15, -27);
pointLight.castShadow = true;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 10;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.radius = 4;
pointLight.shadow.bias = - 0.00006;
scene.add(pointLight);

// const helper = new THREE.CameraHelper( pointLight.shadow.camera );
// scene.add( helper );

const morningColor = new THREE.Color(0xff8170);
const noonColor = new THREE.Color('lightblue');
const eveningColor = new THREE.Color(0xff8170);
const nightColor = new THREE.Color('black');

export function updateBackground(clock) {
    let elapsedTime = clock.getElapsedTime();
    let currentHour = (elapsedTime + 60) % 240;
    let currentColor = new THREE.Color();

    // Interpolate between the colors for different times of the day
    if (currentHour >= 190 || currentHour < 40) {
        // Night - black
        currentColor = nightColor;
    } else if (currentHour < 60) {
        // Transition from night to morning - interpolate between black and red
        let t = (currentHour - 40) / 30;
        currentColor.lerpColors(nightColor, morningColor, t);
    } else if (currentHour < 80) {
        // Transition from morning to noon - interpolate between red and light blue
        let t = (currentHour - 60) / 20;
        currentColor.lerpColors(morningColor, noonColor, t);
    } else if (currentHour < 140) {
        // Noon - light blue
        currentColor = noonColor;
    } else if (currentHour < 160) {
        // Transition from noon to evening - interpolate between light blue and red
        let t = (currentHour - 140) / 20;
        currentColor.lerpColors(noonColor, eveningColor, t);
    } else {
        // Transition from evening to night - interpolate between red and black
        let t = (currentHour - 160) / 30;
        currentColor.lerpColors(eveningColor, nightColor, t);
    }

    scene.background = currentColor;

}
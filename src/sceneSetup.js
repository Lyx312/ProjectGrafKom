// sceneSetup.js
import * as THREE from 'three';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 100);
});
// Change the background color of the scene
scene.background = new THREE.Color(0xdefeff);

// Add an ambient light
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0x00ff00, 2.5);
directionalLight.position.set(0, 9, 1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.00006;
scene.add(directionalLight);

export default renderer;

// Define the colors for different times of the day
const morningColor = new THREE.Color(0xff8170);
const noonColor = new THREE.Color('lightblue');
const eveningColor = new THREE.Color(0xff8170);
const nightColor = new THREE.Color('black');

// Function to update the scene
export function updateBackground(clock) {
    // Get the elapsed time
    let elapsedTime = clock.getElapsedTime();

    // Calculate the current hour (we assume that every second in real time is an hour in the simulation)
    let currentHour = (elapsedTime + 60) % 240;

    // Create a new color object to store the interpolated color
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

    // Change the background color of the scene
    scene.background = currentColor;

}
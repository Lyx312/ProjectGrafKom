// objectLoader.js
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MTL_PATH = '../assets/mtl/';
const OBJ_PATH = '../assets/objects/';
const MODEL_PATH = '../assets/models/';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0 });
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

function setPositionScaleRotation(object, position, scale, rotation) {
    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(...rotation.map(deg => deg * Math.PI / 180));
}

export function loadObject(scene, fileName, position, scale, rotation) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`${MTL_PATH}${fileName}.mtl`, function (materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(`${OBJ_PATH}${fileName}.obj`, function (object) {
            setPositionScaleRotation(object, position, scale, rotation);
            scene.add(object);
        });
    });
}

// Load the model
export function loadModel(scene, folder, position, scale, rotation, callback) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}${folder}/scene.gltf`,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            scene.add(model);

            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });

                // Pass the mixer to the callback function
                if (callback && typeof callback === 'function') {
                    callback(mixer);
                }
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

export function loadModelInterior(scene, file, position, scale, rotation, interactibles, worldPosition) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}individual_equipments/${file}.glb`,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            scene.add(model);

            if (interactibles && worldPosition) {
                interactibles[file] = {}
                interactibles[file].position = new THREE.Vector3(...worldPosition);
                interactibles[file].model = model;
                interactibles[file].isAnimating = false;
                interactibles[file].state = 0;
                interactibles[file].substate = 0;
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

export function createBoundingBox(scene, position, scale, rotation, octree, boundingBox, interactibles) {
    const cube = new THREE.Mesh(geometry, material);
    setPositionScaleRotation(cube, position, scale, rotation);
    octree.fromGraphNode(cube);
    scene.add(cube);

    const edges = new THREE.EdgesGeometry(cube.geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    line.position.copy(cube.position);
    line.scale.copy(cube.scale);
    line.rotation.copy(cube.rotation);
    scene.add(line);

    boundingBox.push({
        cube: cube,
        line: line,
    })

    if (interactibles) {
        console.log("yay");
        interactibles.boundingBox = {
            cube: cube,
            line: line,
        }
    }
}

export function loadPlayer(scene, folder, position, scale, rotation, callback) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}${folder}/scene.gltf`,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            scene.add(model);

            let mixer;
            let animations = {};

            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    animations[clip.name] = mixer.clipAction(clip);
                });
            }

            // Pass the model, mixer, and animations to the callback function
            if (callback && typeof callback === 'function') {
                callback(model, mixer, animations);
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}


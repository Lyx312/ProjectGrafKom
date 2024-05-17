// objectLoader.js
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MTL_PATH = '../assets/mtl/';
const OBJ_PATH = '../assets/objects/';
const MODEL_PATH = '../assets/models/';
const IMAGE_PATH = '../assets/images/';

const geometry = new THREE.BoxGeometry();
export const boundingMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0 });
export const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

function setPositionScaleRotation(object, position, scale, rotation) {
    object.position.set(...position);
    object.scale.set(...scale);
    object.rotation.set(...rotation.map(deg => deg * Math.PI / 180));
}

function addShadow(gltf) {
    gltf.scene.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material.map) {
                child.material.map.anisotropy = 4;
            }
        }
    });
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
            addShadow(gltf);
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
            addShadow(gltf);
            scene.add(model);

            if (interactibles && worldPosition) {
                interactibles[file] = {}
                interactibles[file].position = new THREE.Vector3(...worldPosition);
                interactibles[file].model = model;
                interactibles[file].isAnimating = false;
                interactibles[file].state = 0;
                interactibles[file].substate = 0;
                traverseThroughChildrenAndGiveName(model, "interactible " + file)
            }
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

export function createBoundingBox(scene, position, scale, rotation, octree, interactibles) {
    const cube = new THREE.Mesh(geometry, boundingMaterial);
    setPositionScaleRotation(cube, position, scale, rotation);
    octree.fromGraphNode(cube);
    scene.add(cube);

    const edges = new THREE.EdgesGeometry(cube.geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    line.position.copy(cube.position);
    line.scale.copy(cube.scale);
    line.rotation.copy(cube.rotation);
    scene.add(line);

    if (interactibles) {
        interactibles.boundingBox = {
            cube: cube,
            line: line,
        }
    }
}

export function createBoundingCylinder(scene, position, scale, rotation, octree, interactibles) {
    const geometry = new THREE.CylinderGeometry(1, 1, 1);
    const cylinder = new THREE.Mesh(geometry, boundingMaterial);
    setPositionScaleRotation(cylinder, position, scale, rotation);
    octree.fromGraphNode(cylinder);
    scene.add(cylinder);

    const edges = new THREE.EdgesGeometry(cylinder.geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    line.position.copy(cylinder.position);
    line.scale.copy(cylinder.scale);
    line.rotation.copy(cylinder.rotation);
    scene.add(line);

    if (interactibles) {
        interactibles.boundingCylinder = {
            cylinder: cylinder,
            line: line,
        }
    }
}

function traverseThroughChildrenAndGiveName(obj, name) {
    obj.name = name;
    if (obj.children.length != 0) {
      obj.children.forEach(child => {
        traverseThroughChildrenAndGiveName(child, name)
      });
    }
  }

export const createInteractionBox = (scene, name, position, scale, rotation) => {
    
}

export function loadPlayer(scene, folder, position, scale, rotation, callback) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}${folder}/scene.gltf`,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            scene.add(model);
            addShadow(gltf);

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

export function loadImage(scene, file, position, scale, rotation) {
    const texture = new THREE.TextureLoader().load(`${IMAGE_PATH}${file}.png`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    setPositionScaleRotation(mesh, position, scale, rotation);

   scene.add(mesh);
}

export function loadGroundModel(scene, file, worldOctree, position, scale, rotation) {
    // Set up the GLTF loader
    const loader = new GLTFLoader();

    // Load the ground model
    loader.load(`${MODEL_PATH}individual_equipments/${file}.glb`, function (gltf) {
        const ground = gltf.scene;
        addShadow(gltf);

        // Set the position, scale, and rotation of the ground model
        setPositionScaleRotation(ground, position, scale, rotation);

        // Ensure the ground model receives shadows
        ground.receiveShadow = true;

        // Add the ground model to the scene
        scene.add(ground);

        // Add the ground model to the worldOctree if needed
        if (worldOctree) {
            worldOctree.fromGraphNode(ground);
        }

    }, undefined, function (error) {
        console.error('An error occurred while loading the ground model:', error);
    });
}

export function loadAnimatedModel(scene, folder, position, scale, rotation, animationName, callback) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}${folder}/scene.gltf`,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            addShadow(gltf);
            scene.add(model);

            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    if (clip.name === animationName) {
                        mixer.clipAction(clip).play();
                    }
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
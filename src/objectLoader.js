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

function traverseThroughChildrenAndGiveName(obj, name) {
    obj.interact = name;
    obj.children.forEach(child => traverseThroughChildrenAndGiveName(child, name));
}

function handleError(error) {
    console.error(error);
}

function loadGLTF(loadingManager, path, name, scene, position, scale, rotation, interactables = null, type=null, callFunction=null, octree=null, callback = null) {
    const loader = new GLTFLoader(loadingManager);
    loader.load(
        path,
        function (gltf) {
            const model = gltf.scene;
            setPositionScaleRotation(model, position, scale, rotation);
            addShadow(gltf);

            if (octree) {
                octree.fromGraphNode(model);
            }

            if (interactables) {
                const newKey = `${type}_${name}`;

                if (type == "object") {
                    interactables[newKey] = {
                        model: model,
                        state: 0,
                        isAnimating: false,
                        startAnimation: callFunction
                    };
                } else if (type == "npc") {
                    interactables[newKey] = {
                        model: model,
                        startDialog: callFunction
                    };
                }
                traverseThroughChildrenAndGiveName(model, newKey);
                // console.log(newKey);
            }

            if (type == "static") {
                callFunction(model);
            }

            scene.add(model);

            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach(clip => mixer.clipAction(clip).play());
                if (callback) callback(mixer, model);
            } else if (callback) {
                callback(null);
            }
        },
        undefined,
        handleError
    );
}

export function loadObject(loadingManager, scene, fileName, position, scale, rotation) {
    const mtlLoader = new MTLLoader(loadingManager);
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
export function loadModel(loadingManager, scene, folder, position, scale, rotation, callback) {
    loadGLTF(loadingManager, `${MODEL_PATH}${folder}/scene.gltf`, null, scene, position, scale, rotation, null, null, null, null, callback);
}

export function loadModelInterior(loadingManager, scene, file, position, scale, rotation, interactables, interactFunction, number=0) {
    loadGLTF(loadingManager, `${MODEL_PATH}individual_equipments/${file}.glb`, file+"_"+number, scene, position, scale, rotation, interactables, "object", interactFunction);
}

export function loadAnimatedModelInterior(loadingManager, scene, file, position, scale, rotation, interactFunction, number=0) {
    loadGLTF(loadingManager, `${MODEL_PATH}individual_equipments/${file}.glb`, file+"_"+number, scene, position, scale, rotation, null, "static", interactFunction);
}

export function createBoundingBox(scene, position, scale, rotation, octree, callback) {
    const cube = new THREE.Mesh(geometry, boundingMaterial);
    setPositionScaleRotation(cube, position, scale, rotation);
    scene.add(cube);

    const edges = new THREE.EdgesGeometry(cube.geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    setPositionScaleRotation(line, position, scale, rotation);
    scene.add(line);

    if (octree) {
        octree.fromGraphNode(cube);
    } else if (callback) {
        callback({
            collider: new THREE.Box3(new THREE.Vector3(position[0]-scale[0]/2, position[1]-scale[1]/2, position[2]-scale[2]/2), new THREE.Vector3(position[0]+scale[0]/2, position[1]+scale[1]/2, position[2]+scale[2]/2)),
            box: cube,
            line: line,
        })
    }
}

export function createBoundingCylinder(scene, position, scale, rotation, octree) {
    const geometry = new THREE.CylinderGeometry(1, 1, 1);
    const cylinder = new THREE.Mesh(geometry, boundingMaterial);
    setPositionScaleRotation(cylinder, position, scale, rotation);
    octree.fromGraphNode(cylinder);
    scene.add(cylinder);

    const edges = new THREE.EdgesGeometry(cylinder.geometry);
    const line = new THREE.LineSegments(edges, lineMaterial);
    setPositionScaleRotation(line, position, scale, rotation);
    scene.add(line);
}
export function loadPlayer(loadingManager, scene, folder, position, scale, rotation, callback) {
    loadGLTF(loadingManager, `${MODEL_PATH}${folder}/scene.gltf`, null, scene, position, scale, rotation, null, null, null, null, (mixer, model) => {
        const animations = {};
        if (mixer) {
            mixer._actions.forEach(action => animations[action._clip.name] = action);
        }
        callback(model, mixer, animations);
    });
}

export function loadImage(loadingManager, scene, file, position, scale, rotation) {
    const texture = new THREE.TextureLoader(loadingManager).load(`${IMAGE_PATH}${file}.png`);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);

    setPositionScaleRotation(mesh, position, scale, rotation);

    scene.add(mesh);
}

export function loadGroundModel(loadingManager, scene, file, worldOctree, position, scale, rotation) {
    loadGLTF(loadingManager, `${MODEL_PATH}individual_equipments/${file}.glb`, null, scene, position, scale, rotation, null, null, null, worldOctree);
}

export function loadAnimatedModel(loadingManager, scene, folder, name, position, scale, rotation, animationName, interactables, dialogueFunction, callback) {
    loadGLTF(loadingManager, `${MODEL_PATH}${folder}/scene.gltf`, name, scene, position, scale, rotation, interactables, "npc", dialogueFunction, null, (mixer) => {
        const animations = {};
        if (mixer) {
            mixer._actions.forEach(action => {
                animations[action._clip.name] = action;
                if (action._clip.name === animationName) action.play();
            });
        }
        interactables[`npc_${name}`].animations = animations;
        callback(mixer);
    });
}

export function loadAudio(loadingManager, scene, audioFile, position, volume = 1.0, loop = false) {
    const listener = new THREE.AudioListener();
    const audioLoader = new THREE.AudioLoader(loadingManager);
    const audio = new THREE.PositionalAudio(listener);

    // Load audio file
    audioLoader.load(audioFile, function(buffer) {
        audio.setBuffer(buffer);
        audio.setVolume(volume); // Set initial volume here
        audio.setLoop(loop);
        audio.setRefDistance(10); // Adjust the reference distance as needed
        audio.setRolloffFactor(2); // Adjust the rolloff factor for attenuation

        // Set position
        audio.position.copy(position);

        // Add audio to the scene
        scene.add(audio);

        // Optionally, play the audio
        //audio.play();
    });

    return audio; // Return the positional audio object
}
// objectLoader.js
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MTL_PATH = '../assets/mtl/';
const OBJ_PATH = '../assets/objects/';
const MODEL_PATH = '../assets/models/';

export function loadObject(scene, fileName, position, scale, rotation, collidable) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`${MTL_PATH}${fileName}.mtl`, function(materials) {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(`${OBJ_PATH}${fileName}.obj`, function(object)
        {   
            object.position.set(...position);
            object.scale.set(...scale); 
            object.rotation.set(...rotation.map(deg => deg * Math.PI / 180));
            collidable.push(object)
            scene.add( object );
        });
    });
}

// Load the model
export function loadModel(scene, folder, position, scale, rotation) {
    const loader = new GLTFLoader();
    loader.load(
        `${MODEL_PATH}${folder}/scene.gltf`,
        function (gltf) {
            const model = gltf.scene;
            // Set the position of the model
            model.position.set(...position);
            // Set the scale of the model
            model.scale.set(...scale);
            model.rotation.set(...rotation.map(deg => deg * Math.PI / 180));
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}
// objectLoader.js
import * as THREE from 'https://jspm.dev/three';
import { MTLLoader } from 'https://jspm.dev/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://jspm.dev/three/examples/jsm/loaders/OBJLoader.js';

const MTL_PATH = '../assets/mtl/';
const OBJ_PATH = '../assets/objects/';

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

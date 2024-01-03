import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';


class MyPowerUp {
    constructor(powerUpData) {
        this.id = powerUpData.representations[0].id;
        this.subtype = powerUpData.representations[0].subtype;
        this.obj = powerUpData.representations[0].obj;
        this.mtl = powerUpData.representations[0].mtl;
        this.objPromise = this.buildObject();
    }

    buildObject() {
        return new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(this.mtl, materials => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(this.obj, obj => {
                    obj.name = this.id + "_mesh"
                    obj.subtype = this.subtype;
                    resolve(obj);
                });
            });
        });
    }
}

export { MyPowerUp };

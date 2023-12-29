import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

class MyPowerUp {
    constructor(powerUpData) {
        this.id = powerUpData.representations[0].id;
        this.subtype = powerUpData.representations[0].subtype;
        this.filepath = powerUpData.representations[0].filepath;
        this.objPromise = this.buildObject();
    }

    buildObject() {
        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();

            loader.load(this.filepath,
                (obj) => {
                    obj.name = this.id + "_mesh"
                    obj.subtype = this.subtype;
                    resolve(obj);
                },
                (xhr) => {
                },
                (error) => {
                    reject("An error happened: " + error);
                }
            );
        });
    }
}

export { MyPowerUp };

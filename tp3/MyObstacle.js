import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

class MyObstacle {
    constructor(obstacleData) {
        this.id = obstacleData.representations[0].id;
        this.subtype = obstacleData.representations[0].subtype;
        this.filepath = obstacleData.representations[0].filepath;
        this.objPromise = this.buildObject();
    }

    buildObject() {
        return new Promise((resolve, reject) => {
            const loader = new OBJLoader();

            loader.load(this.filepath,
                (obj) => {
                    obj.name = this.id;
                    obj.subtype = this.subtype;
                    resolve(obj);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    reject("An error happened: " + error);
                }
            );
        });
    }
}

export { MyObstacle };

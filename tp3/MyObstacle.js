import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

class MyObstacle {

    constructor(obstacleData, material) {
        this.id = obstacleData.representations[0].id;
        this.subtype = obstacleData.representations[0].subtype;
        this.value = obstacleData.representations[0].value;
        this.duration = obstacleData.representations[0].duration;
        this.controlpoints = obstacleData.representations[0].controlpoints;
        this.degree_u = obstacleData.representations[0].degree_u;
        this.degree_v = obstacleData.representations[0].degree_v;
        this.parts_u = obstacleData.representations[0].parts_u;
        this.parts_v = obstacleData.representations[0].parts_v;
        this.material = material;

        if (this.subtype == "invert") {
            let cone = new THREE.CylinderGeometry(1, 3, 7, 32, 32, true, 0, 2*Math.PI);
            cone.scale(0.2, 0.2, 0.2)
            cone.translate(0, -0.3, 0)
            this.material.side = THREE.DoubleSide;
            let mesh = new THREE.Mesh(cone, this.material);
            return mesh
        }
        // this.objPromise = this.buildObject();
        let points = []
        let count_v = 0
        let count_u = 0
        let temp = []
        for (const controlpoint of this.controlpoints) {
            temp.push(Object.values(controlpoint).slice(0, -2))
            count_v++
            if (count_v == this.degree_v + 1) {
                points.push(temp)
                temp = []
                count_v = 0
                count_u++
            }
            if (count_u == this.degree_u + 1) {
                break
            }
        }
        const builder = new MyNurbsBuilder()
        let geometry = builder.build(points, this.degree_u, this.degree_v, this.parts_u, this.parts_v)
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.name = this.id + "_mesh"
        mesh.subtype = this.subtype;
        mesh.value = this.value;
        mesh.duration = this.duration;
        mesh.degree_u = this.degree_u;
        mesh.degree_v = this.degree_v;
        mesh.parts_u = this.parts_u;
        mesh.parts_v = this.parts_v;

        return mesh 
    }
}

export { MyObstacle };

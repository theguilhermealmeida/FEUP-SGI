import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';


class MyGeometryBuilder {
    constructor(geometryData, materialData, materialObject, textureObject) {
        this.geometryData = geometryData
        this.materialData = materialData
        this.materialObject = materialObject
        this.textureObject = textureObject
        this.representations = geometryData.representations[0]
        let geometry

        switch (geometryData.subtype) {
            case "rectangle": {
                // handle texture
                if (this.textureObject != null) {
                    this.textureObject.wrapS = this.textureObject.wrapT = THREE.RepeatWrapping;
                    this.textureObject.repeat.set((this.representations.xy2[0] - this.representations.xy1[0]) / this.materialData.texlength_s, (this.representations.xy2[1] - this.representations.xy1[1]) / this.materialData.texlength_t);
                    this.materialObject.map = this.textureObject;
                }

                // build geometry
                let x = this.representations.xy1[0] - this.representations.xy2[0];
                let y = this.representations.xy1[1] - this.representations.xy2[1];
                geometry = new THREE.PlaneGeometry(x, y, this.representations.parts_x ?? 1, this.representations.parts_y ?? 1);
                break;
            }
            case "cylinder": {
                // handle texture
                // TODO: implement texture for cylinder


                // build geometry
                geometry = new THREE.CylinderGeometry(this.representations.top, this.representations.base, this.representations.height, this.representations.slices, this.representations.stacks, this.representations.capsclose, this.representations.thetastart, this.representations.thetalength);
                break;
            }
            case "sphere": {
                // handle texture
                // TODO: implement texture for sphere

                // build geometry
                geometry = new THREE.SphereGeometry(this.representations.radius, this.representations.slices, this.representations.stacks, this.representations.phistart, this.representations.philength, this.representations.thetastart, this.representations.thetalength);
                break;
            }
            case "triangle": {
                // handle texture
                // TODO: implement texture for triangle

                // build geometry
                geometry = new THREE.Geometry();
                let x2 = this.representations.xy1[0] - this.representations.xy2[0];
                let y2 = this.representations.xy1[1] - this.representations.xy2[1];
                let z2 = this.representations.xy1[2] - this.representations.xy2[2];
                let triangle = new THREE.Triangle(x2, y2, z2);
                let normal = triangle.normal();
                geometry.vertices.push(triangle.a, triangle.b, triangle.c);
                geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
                break;
            }
            // case "nurbs": {
            //     // TODO: implement nurbs
            //     break;
            // }
            // case "skybox": {
            //     // TODO: implement skybox
            //     break;
            // }
            // case "model3d": {
            //     // TODO: implement model3d 
            //     break;
            // }
            default:
                console.warn("Unknown primitive: " + geometryData.subtype);
                break;
        }

        this.mesh = new THREE.Mesh(geometry, this.materialObject);
        return this.mesh
    }

}

export { MyGeometryBuilder }





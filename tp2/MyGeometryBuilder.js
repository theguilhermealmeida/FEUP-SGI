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
                // const xWidth = Math.abs(this.representations.xy1[0] - this.representations.xy2[0]);
                // const yWidth = Math.abs(this.representations.xy1[1] - this.representations.xy2[1]);
                // geometry = new THREE.PlaneGeometry(xWidth, yWidth, this.representations.parts_x ?? 1, this.representations.parts_y ?? 1);
                // const xMin = Math.min(this.representations.xy1[0], this.representations.xy2[0]);
                // const yMin = Math.min(this.representations.xy1[1], this.representations.xy2[1]);
                // geometry.translate(xMin + xWidth / 2, yMin + yWidth / 2, 0);
                
                let x = this.representations.xy2[0] - this.representations.xy1[0];
                let y = this.representations.xy2[1] - this.representations.xy1[1];
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
                let x2 = this.representations.xy2[0] - this.representations.xy1[0];
                let y2 = this.representations.xy2[1] - this.representations.xy1[1];
                let z2 = this.representations.xy2[2] - this.representations.xy1[2];
                let triangle = new THREE.Triangle(x2, y2, z2);
                let normal = triangle.normal();
                geometry.vertices.push(triangle.a, triangle.b, triangle.c);
                geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
                break;
            }
            case "nurbs": {
                // TODO: implement nurbs
                console.log(this.geometryData)
                let points = []
                let count_v = 0
                let count_u = 0
                let temp = []
                for (const controlpoint of this.representations.controlpoints) {
                    temp.push(Object.values(controlpoint).slice(0, -1))
                    count_v++
                    if (count_v == this.representations.degree_v + 1) {
                        points.push(temp)
                        temp = []
                        count_v = 0
                        count_u++
                    }
                    if (count_u == this.representations.degree_u + 1) {
                        console.log("more points than expected")
                        break
                    }
                }

                const builder = new MyNurbsBuilder()
                geometry = builder.build(points, this.representations.degree_u, this.representations.degree_v, this.representations.parts_u, this.representations.parts_v)
                break;
            }
            case "box": {
                // handle texture
                geometry = new THREE.BoxGeometry(this.representations.xyz2[0] - this.representations.xyz1[0], this.representations.xyz2[1] - this.representations.xyz1[1], this.representations.xyz2[2] - this.representations.xyz1[2], this.representations.parts_x, this.representations.parts_y, this.representations.parts_z);
                break;
            }
            case "skybox": {
                // TODO: implement skybox
                break;
            }
            case "model3d": {
                // TODO: implement model3d 
                break;
            }
            case "lod": {
                // TODO: implement lod 
                break
            }
            default:
                console.warn("Unknown primitive: " + geometryData.subtype);
                break;
        }

        if (this.materialData.id === "pineApp") {
            console.log("pineMaterial")
        }
        this.mesh = new THREE.Mesh(geometry, this.materialObject);
        return this.mesh
    }

}

export { MyGeometryBuilder }





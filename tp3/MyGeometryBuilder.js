import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyTrack } from './MyTrack.js';
import { MyPolygon } from './MyPolygon.js';
import { MyTriangle } from './MyTriangle.js';


class MyGeometryBuilder {
    constructor(geometryData, materialObject, textureObject, castShadows, receiveShadows) { 
        this.geometryData = geometryData
        this.materialObject = materialObject
        this.textureObject = textureObject
        this.representations = geometryData.representations[0]
        this.castShadows = castShadows
        this.receiveShadows = receiveShadows
        let geometry

        switch (geometryData.subtype) {
            case "rectangle": {
                // handle texture
                if (this.textureObject != null) {
                    this.textureObject.wrapS = this.textureObject.wrapT = THREE.RepeatWrapping;
                    this.textureObject.repeat.set((this.representations.xy2[0] - this.representations.xy1[0]) / this.materialObject.texlength_s, (this.representations.xy2[1] - this.representations.xy1[1]) / this.materialObject.texlength_t);
                    this.materialObject.map = this.textureObject;
                }
                
                
                let x = this.representations.xy2[0] - this.representations.xy1[0];
                let y = this.representations.xy2[1] - this.representations.xy1[1];
                geometry = new THREE.PlaneGeometry(x, y, this.representations.parts_x ?? 1, this.representations.parts_y ?? 1);
                break;
            }
            case "cylinder": {
                // build geometry
                geometry = new THREE.CylinderGeometry(this.representations.top, this.representations.base, this.representations.height, this.representations.slices, this.representations.stacks, !this.representations.capsclose, this.representations.thetastart, this.representations.thetalength);
                break;
            }
            case "sphere": {
                // build geometry
                geometry = new THREE.SphereGeometry(this.representations.radius, this.representations.slices, this.representations.stacks, this.representations.phistart, this.representations.philength, this.representations.thetastart, this.representations.thetalength);
                break;
            }
            case "triangle": {
                // handle texture
                if (this.textureObject != null) {
                    this.textureObject.wrapS = this.textureObject.wrapT = THREE.RepeatWrapping;
                    // const v1 = new THREE.Vector3(this.representations.xyz1[0], this.representations.xyz1[1], this.representations.xyz1[2]);
                    // const v2 = new THREE.Vector3(this.representations.xyz2[0], this.representations.xyz2[1], this.representations.xyz2[2]);
                    // const v3 = new THREE.Vector3(this.representations.xyz3[0], this.representations.xyz3[1], this.representations.xyz3[2]);

                    // const a = v1.distanceTo(v2);
                    // const b = v2.distanceTo(v3);
                    // const c = v1.distanceTo(v3);

                    // const v213 = Math.acos((a*a - b*b + c*c) / (2*a*c));
                    // const v132 = Math.acos((-(a*a) + b*b + c*c) / (2*c*b));
                    // const v321 = Math.acos((a*a + b*b - (c*c)) / (2*a*b));

                    // TODO: use texlenght_s and texlenght_t
                    this.textureObject.repeat.set(1,1);
                    this.materialObject.map = this.textureObject;
                }

                // build geometry
                geometry = new MyTriangle(this.representations.xyz1[0], this.representations.xyz1[1], this.representations.xyz1[2], this.representations.xyz2[0], this.representations.xyz2[1], this.representations.xyz2[2], this.representations.xyz3[0], this.representations.xyz3[1], this.representations.xyz3[2]);
                break;
            }
            case "nurbs": {
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
                        break
                    }
                }

                const builder = new MyNurbsBuilder()
                geometry = builder.build(points, this.representations.degree_u, this.representations.degree_v, this.representations.parts_u, this.representations.parts_v)
                break;
            }
            case "track": {
                const builder = new MyTrack(this.representations.controlpoints, this.representations.numsegments)
                geometry = builder.build()
                break;
            }
            case "box": {
                // handle texture
                geometry = new THREE.BoxGeometry(this.representations.xyz2[0] - this.representations.xyz1[0], this.representations.xyz2[1] - this.representations.xyz1[1], this.representations.xyz2[2] - this.representations.xyz1[2], this.representations.parts_x, this.representations.parts_y, this.representations.parts_z);
                break;
            }
            case "model3d": {
                // TODO: implement model3d 
                break;
            }
            case "polygon": {
                geometry = new MyPolygon(geometryData)

                let material = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true, vertexColors: true})
                let primitive = new THREE.Mesh(geometry, material);
                return primitive
            }
            default:
                console.warn("Unknown primitive: " + geometryData.subtype);
                break;
        }

        this.mesh = new THREE.Mesh(geometry, this.materialObject);
        this.mesh.castShadow = this.castShadows;
        this.mesh.receiveShadow = this.receiveShadows;
        this.mesh.name = geometryData.id;
        return this.mesh
    }

}

export { MyGeometryBuilder }





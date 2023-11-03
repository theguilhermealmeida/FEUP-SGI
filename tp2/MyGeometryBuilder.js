import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';


class MyGeometryBuilder {
    constructor(geometryData, materialData, materialObject, textureObject) {
        this.geometryData = geometryData
        this.materialData = materialData
        this.materialObject = materialObject
        this.textureObject = textureObject
        // this.material = new THREE.MeshPhongMaterial({ color: `rgb(${material.color.r}, ${material.color.g}, ${material.color.b})`, specular: `rgb(${material.specular.r}, ${material.specular.g}, ${material.specular.b})`, emissive: `rgb(${material.emissive.r}, ${material.emissive.g}, ${material.emissive.b})`, shininess: material.shininess });
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
                console.error("Unknown primitive: " + geometryData.subtype);
                break;
        }

        this.mesh = new THREE.Mesh(geometry, this.materialObject);
        return this.mesh
    }









    // constructor(geometryData, material, textPath) {
    //     this.geometryData = geometryData;
    //     this.material = new THREE.MeshPhongMaterial({ color: `rgb(${material.color.r}, ${material.color.g}, ${material.color.b})`, specular: `rgb(${material.specular.r}, ${material.specular.g}, ${material.specular.b})`, emissive: `rgb(${material.emissive.r}, ${material.emissive.g}, ${material.emissive.b})`, shininess: material.shininess });
    //     //this.builder = new MyNurbsBuilder();
    //     this.mesh = new THREE.Mesh();

    //     if (material.textureref != null ) {
    //         if (geometryData.type == "rectangle") {
    //             let map = new THREE.TextureLoader().load(textPath.filepath);
    //             map.wrapS = map.wrapT = THREE.RepeatWrapping;
    //             map.repeat.set((this.geometryData.xy2[0] - this.geometryData.xy1[0]) / material.texlength_s, (this.geometryData.xy2[1] - this.geometryData.xy1[1]) / material.texlength_t);
    //             this.material.map = map;
    //         }
    //         else {
    //             let map = new THREE.TextureLoader().load(textPath.filepath);
    //             // map.wrapS = map.wrapT = THREE.RepeatWrapping;
    //             // map.repeat.set((this.geometryData.xy1[0] - this.geometryData.xy2[0]) / material.texlength_s, (this.geometryData.xy1[1] - this.geometryData.xy2[1]) / material.texlength_t);
    //             this.material.map = map;
    //         }
    //     }
    // }       this.material = material




    // createGeometry(nodeData) {
    //     let geometry;
    //     const representations = nodeData.representations[0]
    //     switch (nodeData.subtype) {
    //         case "rectangle":
    //             let x = representations.xy1[0] - representations.xy2[0];
    //             let y = representations.xy1[1] - representations.xy2[1];
    //             geometry = new THREE.PlaneGeometry(x, y, representations.parts_x ?? 1, representations.parts_y ?? 1);
    //             break;
    //         case "cylinder":
    //             geometry = new THREE.CylinderGeometry(representations.top, representations.base, representations.height, representations.slices, representations.stacks, representations.capsclose, representations.thetastart, representations.thetalength);
    //             break;
    //         case "sphere":
    //             geometry = new THREE.SphereGeometry(representations.radius, representations.slices, representations.stacks, representations.phistart, representations.philength, representations.thetastart, representations.thetalength);
    //             break;
    //         case "triangle":
    //             geometry = new THREE.Geometry();
    //             let x2 = representations.xy1[0] - representations.xy2[0];
    //             let y2 = representations.xy1[1] - representations.xy2[1];
    //             let z2 = representations.xy1[2] - representations.xy2[2];
    //             let triangle = new THREE.Triangle(x2, y2, z2);
    //             let normal = triangle.normal();
    //             geometry.vertices.push(triangle.a, triangle.b, triangle.c);
    //             geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
    //             break;
    //         case "nurbs":
    //             // TODO: implement nurbs
    //             // geometry = new MyNurbsBuilder()
    //             // const representations = nodeData.representations[0]
    //             // console.log(representations)
    //             // geometry.build(representations.controlpoints, representations.degree_u, representations.degree_v, representations.parts_u, representations.parts_v)
    //             break;
    //         case "skybox":
    //             // TODO: implement skybox
    //             break;
    //         case "model3d":
    //             // TODO: implement model3d
    //             break;
    //         default:
    //             // console.error("Unknown primitive: " + nodeData.primitive);
    //             break;
    //     }

    //     return geometry
    // }


}

export { MyGeometryBuilder }





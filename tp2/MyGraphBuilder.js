import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyGeometryBuilder } from './MyGeometryBuilder.js';


class MyGraphBuilder {
    constructor(sceneData) {
        this.sceneData = sceneData
        this.group = new THREE.Group();
        this.nodes = new Map()
        this.materials = new Map()
        this.textures = new Map()
        this.lights = [] 
        this.transformations = new Map()
        this.lods = new Map()
        this.cameras = []

        this.no_materials = new Map()
        this.videos = [] 

        this.initTextures()
        this.initMaterials()
        this.buildCameras(sceneData.cameras)
    }


    initTextures() {
        for (let key in this.sceneData.textures) {
            let texture = this.sceneData.textures[key];
            let textureObject
            if (texture.isVideo) {
                const video = document.createElement('video');
                video.src = texture.filepath
                video.loop = true;
                video.muted = true
                video.autoplay = true;
                textureObject = new THREE.VideoTexture(video);

                this.videos.push(video)


            }
            else {
                textureObject = new THREE.TextureLoader().load(texture.filepath);
                textureObject.magFilter = texture.magFilter == "NearestFilter" ? THREE.NearestFilter : THREE.LinearFilter;
                switch (texture.minFilter) {
                    case "NearestFilter":
                        textureObject.minFilter = THREE.NearestFilter;
                        break;
                    case "LinearFilter":
                        textureObject.minFilter = THREE.LinearFilter;
                        break;
                    case "NearestMipMapNearestFilter":
                        textureObject.minFilter = THREE.NearestMipMapNearestFilter;
                        break;
                    case "NearestMipMapLinearFilter":
                        textureObject.minFilter = THREE.NearestMipMapLinearFilter;
                        break;
                    case "LinearMipMapNearestFilter":
                        textureObject.minFilter = THREE.LinearMipMapNearestFilter;
                        break;
                    case "LinearMipMapLinearFilter":
                        textureObject.minFilter = THREE.LinearMipMapLinearFilter;
                        break;
                    default:
                        textureObject.minFilter = THREE.LinearMipmapLinearFilter;
                        break;
                }
                textureObject.anisotropy = texture.anisotropy;
                if (texture.mipmap0 !== undefined && texture.mipmap0 !== null) {
                    textureObject.generateMipmaps = false
                    for (let i = 0; i <= 7; i++) {
                        const mipmapPath = texture[`mipmap${i}`]
                        if (texture[`mipmap${i}`] !== undefined && texture[`mipmap${i}`] !== null) {
                            new THREE.TextureLoader().load(mipmapPath,
                                function (mipmap) {
                                    textureObject.mipmaps[i] = mipmap.image
                                },
                                undefined,
                                function (error) {
                                    console.error("Error loading mipmap: " + error)
                                })
                        }
                    }
                }
            }
            this.textures.set(texture.id, textureObject)
        }
    }

    initMaterials() {
        for (let key in this.sceneData.materials) {
            let material = this.sceneData.materials[key];
            let materialObject = new THREE.MeshPhongMaterial();
            materialObject.name = material.id;
            materialObject.color = new THREE.Color(material.color.r, material.color.g, material.color.b);
            materialObject.specular = new THREE.Color(material.specular.r, material.specular.g, material.specular.b);
            materialObject.emissive = new THREE.Color(material.emissive.r, material.emissive.g, material.emissive.b);
            materialObject.shininess = material.shininess;
            materialObject.wireframe = material.wireframe ?? false;
            if (material.shading === "flat") {
                materialObject.flatShading = true;
            }
            else if (material.shading === "smoooth" || material.shading === "none") {
                materialObject.flatShading = false;
            }
            if (material.textureref != null) {
                let materialTextureref = this.textures.get(material.textureref ?? null);
                materialObject.map = materialTextureref;
                materialTextureref.wrapS = materialTextureref.wrapT = THREE.RepeatWrapping;
                materialObject.textureObject = materialTextureref;
            }
            materialObject.side = material.twosided ? THREE.DoubleSide : THREE.FrontSide;

            let bump_ref = material.bumpref ?? null;
            if (bump_ref != null) {
                const bump_texture = this.textures.get(bump_ref ?? null);
                materialObject.bumpMap = bump_texture;
                materialObject.bumpScale = material.bumpscale ?? 1.0;
            }

            let specular_ref = material.specularref ?? null;
            if (specular_ref != null) {
                const specular_texture = this.textures.get(specular_ref ?? null);
                materialObject.specularMap = specular_texture;
            }
            materialObject.texlength_s = material.texlength_s  ?? 1.0;
            materialObject.texlength_t = material.texlength_t ?? 1.0;
            this.materials.set(material.id, materialObject);
        }
    }


    buildGraph() {
        const rootNode = this.sceneData.getNode(this.sceneData.rootId);
        if (rootNode) {
            let group = new THREE.Group();
            this.processNode(rootNode, group);
            return group
        } else {
            console.error("Root node not found.");
        }
    }


    // TODO: fix inheritance
    // handleClone(nodeGroup, material) {
    //    for (let child of nodeGroup.children) {
    //         if (child.type === "primitive") {
    //             child = new MyGeometryBuilder(child, material, material.map, nodeGroup.castShadow, nodeGroup.receiveShadow);
    //         }    
    //         else {
    //             this.handleClone(child, material)
    //         }
    //    }
    // }

    // Recursively process nodes and add them to the group
    processNode(nodeData, parentGroup) {
        const nodeGroup = new THREE.Group();
        parentGroup.add(nodeGroup);
        if (nodeData.type === "primitive") nodeGroup.name = nodeData.subtype
        else nodeGroup.name = nodeData.id

        // if (this.nodes.has(nodeData.id)) {
        //     console.log("node already exists")
        //     nodeGroup.add(this.nodes.get(nodeData.id).clone())
        //     // let clone = this.nodes.get(nodeData.id).clone()
        //     // this.handleClone(clone, nodeGroup.material)
        //     // nodeGroup.add(clone) 
        //     return
        // }

        if (nodeData == undefined) {
            console.warn("Undefined node: " + nodeData.id)
            return THREE.Object3D()
        }
        if (nodeData.castShadows || parentGroup.castShadow) {
            nodeGroup.castShadow = true
        }
        if (nodeData.receiveShadows || parentGroup.receiveShadow) {
            nodeGroup.receiveShadow = true
        }

        if (nodeData.type === "primitive") {
            const materialObject = parentGroup.material
            const textureObject = parentGroup.material.map 

            let geometry = new MyGeometryBuilder(nodeData, materialObject, textureObject, nodeGroup.castShadow, nodeGroup.receiveShadow);
            nodeGroup.add(geometry);
        }

        else if (nodeData.type === "node") {
            if (nodeData.materialIds[0]) {
                nodeGroup.material = this.materials.get(nodeData.materialIds[0])
            } else {
                nodeGroup.material = parentGroup.material
            }
        }

        else if (nodeData.type === "spotlight" || nodeData.type === "pointlight" || nodeData.type === "directionallight") {
            let light = this.buildLight(nodeData)
            nodeGroup.add(light)
        }

        else if (nodeData.type === "lod") {
            this.lods.set(nodeData.id, new THREE.LOD())
            this.buildLod(nodeData, parentGroup)
            nodeGroup.add(this.lods.get(nodeData.id))
        }

        if (nodeData.children) {
            for (let childData of nodeData.children) {
                this.processNode(childData, nodeGroup);
            }
        }
        if (nodeData.transformations) {
            nodeGroup.transformations = nodeData.transformations
            for (let transformation of nodeData.transformations) {
                switch (transformation.type) {
                    case "T":
                        nodeGroup.translateX(transformation.translate[0])
                        nodeGroup.translateY(transformation.translate[1])
                        nodeGroup.translateZ(transformation.translate[2])
                        break;
                    case "R":
                        nodeGroup.rotateX(transformation.rotation[0])
                        nodeGroup.rotateY(transformation.rotation[1])
                        nodeGroup.rotateZ(transformation.rotation[2])
                        break;
                    case "S":
                        nodeGroup.scale.set(transformation.scale[0], transformation.scale[1], transformation.scale[2])
                        break;
                    default:
                        console.warn("unknow transformation type: " + transformation.type)
                        break;
                }
            }
        }

        if (nodeData.type === "node") {
            this.nodes.set(nodeData.id, nodeGroup)
        }
    }

    buildLight(lightData) {

        console.log(lightData)
        let light
        switch (lightData.type) {
            case "spotlight": {
                light = new THREE.SpotLight(lightData.color)
                const target = new THREE.Object3D();
                target.position.set(...lightData.target);
                light.angle = lightData.angle;
                light.penumbra = lightData.penumbra;
                light.target = target;
                break
            }
            case "pointlight": {
                light = new THREE.PointLight()
                light.color = new THREE.Color(lightData.color);
                const helper = new THREE.PointLightHelper(light);
                light.add(helper)
                break
            }
            case "directionallight": {
                light = new THREE.DirectionalLight(lightData.color);
                light.shadow.camera.left = lightData.shadowleft ?? -5;
                light.shadow.camera.right = lightData.shadowright ?? -5;
                light.shadow.camera.bottom = lightData.shadowbottom ?? -5;
                light.shadow.camera.top = lightData.shadowtop ?? -5;
                const helper = new THREE.DirectionalLightHelper(light);
                light.add(helper)
                break
            }
        }

        // commom attributes
        light.position.set(lightData.position[0], lightData.position[1], lightData.position[2]);
        light.visible = lightData.enabled ?? true;
        light.intensity = lightData.intensity ?? 1.0;
        light.distance = lightData.distance ?? 1000;
        light.decay = lightData.decay ?? 2.0;
        light.castShadow = lightData.castshadow ?? false;
        light.shadow.camera.far = lightData.shadowfar ?? 500.0;
        light.shadow.mapSize.width = lightData.shadowmapsize ?? 512;
        light.shadow.mapSize.height = lightData.shadowmapsize ?? 512;

        if (lightData.type === "spotlight") {
            const group = new THREE.Group();
            const helper = new THREE.SpotLightHelper(light);
            //light.add(helper);
        }
        
        console.log("LIGHTDATA")
        console.log(lightData)
        this.lights.push(light)
        return light
    }

    buildLod(lodData, parent) {
        for (let childNodeData of lodData.children) {
                this.processNode(childNodeData.node, parent)
                console.log(this.nodes.get(childNodeData.node.id))
                this.lods.get(lodData.id).addLevel(this.nodes.get(childNodeData.node.id), childNodeData.mindist)
        }
    }

    buildCameras(camerasData) {
        let countP = 1
        let countO = 1
        for (var key in camerasData) {
            let camera = camerasData[key]
            if (camera.type === "perspective") {
                const cameraObj = new THREE.PerspectiveCamera();
                cameraObj.name = camera.type + " " + countP 
                countP++
                cameraObj.fov = camera.angle
                cameraObj.far = camera.far
                cameraObj.near = camera.near
                cameraObj.position.set(...camera.location)
                cameraObj.lookAt(...camera.target)
                // this.app.cameras['Perspective2'] = cameraObj
                this.cameras.push(cameraObj)
            }
            if (camera.type === "orthogonal") {
                const cameraObj = new THREE.OrthographicCamera();
                cameraObj.name = camera.type + " " + countO 
                countO++
                cameraObj.fov = camera.angle
                cameraObj.left = camera.left
                cameraObj.right = camera.right
                cameraObj.top = camera.top
                cameraObj.bottom = camera.bottom
                cameraObj.far = camera.far
                cameraObj.near = camera.near
                cameraObj.position.set(...camera.location)
                cameraObj.lookAt(...camera.target)
                // add a left, right, top bootom, near and far camera
                // this.app.cameras['Orthogonal'] = cameraObj
                this.cameras.push(cameraObj)

            }

        }
    }
}

export { MyGraphBuilder }

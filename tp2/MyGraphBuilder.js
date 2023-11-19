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
        this.lights = new Map()
        this.transformations = new Map()

        this.initTextures()
        this.initMaterials()
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
                video.playbackRate = 0.55 
                // let playPromise = video.play()
                // if (playPromise !== undefined) {
                //     playPromise.then(_ => {
                //         // Automatic playback started!
                //         // Show playing UI.
                //         console.log("video started")
                //     })
                //     .catch(error => {
                //         // Auto-play was prevented
                //         // Show paused UI.
                //         console.log("video not started")
                //     });
                // }

                
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
            // materialObject.map = this.textures.get(material.textureref ?? null);
            this.materials.set(material.id, materialObject);
        }
    }


    buildGraph() {
        const rootNode = this.sceneData.getNode(this.sceneData.rootId);
        if (rootNode) {
            let group = new THREE.Group();
            group = this.processNode(rootNode);
            console.log(group)
            return group
        } else {
            console.error("Root node not found.");
        }


    }

    // Recursively process nodes and add them to the group
    processNode(nodeData) {

        if (this.nodes.has(nodeData.id)) {
            return this.nodes.get(nodeData.id).clone()
        }

        if (nodeData == undefined) {
            console.warn("Undefined node: " + nodeData.id)
            return THREE.Object3D()
        }

        const nodeGroup = new THREE.Group();
        // Process the node's children
        for (let childData of nodeData.children) {
            let no_material = false
            let child

            if (childData.type === "primitive") {
                const materialData = this.sceneData.getMaterial(nodeData.materialIds[0]);
                const materialObject = this.materials.get(nodeData.materialIds[0]);
                const textureObject = this.textures.get(materialData.textureref ?? null);
                let castShadows = nodeData.castShadows
                let receiveShadows = nodeData.receiveShadows
                child = new MyGeometryBuilder(childData, materialData, materialObject, textureObject, castShadows, receiveShadows);


            } else if (childData.type === "node") {
                if (childData.materialIds.length == 0) {
                    //TODO: IF NODE HAS NO MATERIAL THEN STORE IT IN THE MAP WITHOUT MATERIAL
                    no_material = true
                    childData.materialIds = nodeData.materialIds
                }

                if (nodeData.castShadows) childData.castShadows = true
                if (nodeData.receiveShadows) childData.receiveShadows = true

                child = this.processNode(childData);
            }
            else if (childData.type === "spotlight" || childData.type === "pointlight" || childData.type === "directionallight") {
                child = this.buildLight(childData)
            }
            else {
                console.warn("Unknown node type: " + childData.type);
            }

            if (child !== undefined) {
                nodeGroup.add(child);
                if (no_material) {
                    childData.materialIds = []
                    child.material = null
                }
                this.nodes.set(childData.id, child)
            }
        }

        for (let transformation of nodeData.transformations) {
            switch (transformation.type) {
                case "T":
                    nodeGroup.translateX(transformation.translate[0])
                    nodeGroup.translateY(transformation.translate[1])
                    nodeGroup.translateZ(transformation.translate[2])
                    break;
                case "R":
                    nodeGroup.rotateX(transformation.rotation[0] * (Math.PI / 180)) 
                    nodeGroup.rotateY(transformation.rotation[1] * (Math.PI / 180)) 
                    nodeGroup.rotateZ(transformation.rotation[2] * (Math.PI / 180))
                    break;
                case "S":
                    nodeGroup.scale.set(transformation.scale[0], transformation.scale[1], transformation.scale[2])
                    break;
                default:
                    console.warn("unknow transformation type: " + transformation.type)
                    break;
            }
        }


        return nodeGroup
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
                const helper = new THREE.SpotLightHelper(light);
                light.add(helper);
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
            group.add(light);
            group.add(light.target);
            return group;
        }
        return light
    }

}

export { MyGraphBuilder }

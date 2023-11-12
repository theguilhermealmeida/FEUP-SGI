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
            let textureObject = new THREE.TextureLoader().load(texture.filepath);
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
            if (texture.mipmaps) {
                textureObject.mipmaps[0] = texture.mipmap0;
                textureObject.mipmaps[1] = texture.mipmap1;
                textureObject.mipmaps[2] = texture.mipmap2;
                textureObject.mipmaps[3] = texture.mipmap3;
                textureObject.mipmaps[4] = texture.mipmap4;
                textureObject.mipmaps[5] = texture.mipmap5;
                textureObject.mipmaps[6] = texture.mipmap6;
                textureObject.mipmaps[7] = texture.mipmap7;

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
                let materialTextureref = this.textures.get(material.textureref);
                materialTextureref.wrapS = materialTextureref.wrapT = THREE.RepeatWrapping;
            }
            materialObject.side = material.twosided ? THREE.DoubleSide : THREE.FrontSide;
            materialObject.map = this.textures.get(material.textureref ?? null);
            // TODO: materialObject.bump_ref = material.bump_ref;
            // TODO: materialObject.bumpScale = material.bump_scale ?? 1.0;
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
            let child

            if (childData.type === "primitive") {
                const materialData = this.sceneData.getMaterial(nodeData.materialIds[0]);
                const materialObject = this.materials.get(nodeData.materialIds[0]);
                const textureObject = this.textures.get(materialData.textureref ?? null);
                child = new MyGeometryBuilder(childData, materialData, materialObject, textureObject);

            } else if (childData.type === "node") {
                if (childData.materialIds.length == 0) {
                    childData.materialIds = nodeData.materialIds
                }
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
        light.castShadow = lightData.castShadow ?? false;
        light.shadow.camera.far = lightData.shadowfar ?? 500.0;
        light.shadow.mapSize = new THREE.Vector2(lightData.shadowmapsize, lightData.shadowmapsize);

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

import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';


class MyGraphBuilder {
    constructor(sceneData) {
        this.sceneData = sceneData
        this.group = new THREE.Group();
        this.nodes = new Map()
        this.materials = new Map()
        this.cameras = []
        this.textures = new Map()
        this.lights = new Map()
        this.cameras = new Map()

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
            // TODO: handle mipmaps?
            this.textures.set(texture.id, textureObject)
        }
    }

    initMaterials() {
        for (let key in this.sceneData.materials) {
            let material = this.sceneData.materials[key];
            let materialObject = new THREE.MeshPhongMaterial({ map: this.textures.get(material.textureref ?? null) });
            materialObject.color = new THREE.Color(material.color);
            materialObject.specular = material.specular;
            materialObject.emissive = material.emissive;
            materialObject.shininess = material.shininess;
            materialObject.wireframe = material.wireframe ?? false;
            if (material.shading === "flat") {
                materialObject.flatShading = true;
            }
            else if (material.shading === "smoooth" || material.shading === "none") {
                materialObject.flatShading = false;
            }
            let texture = this.textures.get(material.textureref ?? null);
            if (texture !== null) {
                texture.wrapS = texture.wrapt = THREE.RepeatWrapping;
                texture.repeat.set(material.length_s, material.length_t);
            }
            materialObject.side = material.twosided ? THREE.DoubleSide : THREE.FrontSide;
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
                const geometry = this.createGeometry(childData);
                const material = this.materials.get(nodeData.materialIds[0])
                child = new THREE.Mesh(geometry, material);

            } else if (childData.type === "node") {
                console.log(childData.transformations)
                if (childData.transformations.length == 0) {
                    childData.transformations = nodeData.transformations
                }
                else {
                    this.handleTransformations(childData, nodeData)
                }
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
            // TODO: handle transformations


            if (child !== undefined) {
                nodeGroup.add(child);
            }
            this.nodes.set(childData.id, child)
        }
        return nodeGroup
    }

    createGeometry(nodeData) {
        let geometry;
        const representations = nodeData.representations[0]
        switch (nodeData.subtype) {
            case "rectangle":
                let x = representations.xy1[0] - representations.xy2[0];
                let y = representations.xy1[1] - representations.xy2[1];
                geometry = new THREE.PlaneGeometry(x, y, representations.parts_x ?? 1, representations.parts_y ?? 1);
                break;
            case "cylinder":
                geometry = new THREE.CylinderGeometry(representations.top, representations.base, representations.height, representations.slices, representations.stacks, representations.capsclose, representations.thetastart, representations.thetalength);
                break;
            case "sphere":
                geometry = new THREE.SphereGeometry(representations.radius, representations.slices, representations.stacks, representations.phistart, representations.philength, representations.thetastart, representations.thetalength);
                break;
            case "triangle":
                geometry = new THREE.Geometry();
                let x2 = representations.xy1[0] - representations.xy2[0];
                let y2 = representations.xy1[1] - representations.xy2[1];
                let z2 = representations.xy1[2] - representations.xy2[2];
                let triangle = new THREE.Triangle(x2, y2, z2);
                let normal = triangle.normal();
                geometry.vertices.push(triangle.a, triangle.b, triangle.c);
                geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
                break;
            case "nurbs":
                // TODO: implement nurbs
                // geometry = new MyNurbsBuilder()
                // const representations = nodeData.representations[0]
                // console.log(representations)
                // geometry.build(representations.controlpoints, representations.degree_u, representations.degree_v, representations.parts_u, representations.parts_v)
                break;
            case "skybox":
                // TODO: implement skybox
                break;
            case "model3d":
                // TODO: implement model3d
                break;
            default:
                // console.error("Unknown primitive: " + nodeData.primitive);
                break;
        }

        return geometry
    }
    
    handleTransformations(childData, nodeData) { 
        // for (let )
    }

    buildLight(lightData) {
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
        light.position.copy(...lightData.position);
        light.visible = lightData.enabled ?? true;
        light.intensity = lightData.intensity ?? 1.0;
        light.distance = lightData.distance ?? 1000;
        light.decay = lightData.decay ?? 2.0;
        light.castShadow = lightData.castShadow ?? false;
        light.shadow.camera.far = lightData.shadowfar ?? 500.0;
        light.shadow.mapSize = new THREE.Vector2(lightData.shadowmapsize, lightData.shadowmapsize, lightData.shadowmapsize);

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
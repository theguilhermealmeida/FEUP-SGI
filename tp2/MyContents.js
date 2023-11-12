import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraphBuilder } from './MyGraphBuilder.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		// this.reader.open("scenes/demo/demo.xml");		
		this.reader.open("scenes/t04g10/SGI_TP2_XML_T04_G10_v01.xml");		
		// this.reader.open("scenes/ricardo/ovalOffice.xml");		



    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        this.initCameras(data)
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        let defaultMaterial = {id: "default", color: 0x00ff00, specular: 0x000000, emissive: 0x00000, shininess: 0.0} 
        data.addMaterial(defaultMaterial)
        data.getNode("scene").materialIds[0] = defaultMaterial.id
        console.log(data.getNode("scene").cameras)

        let fog = new THREE.Fog( data.fog.color, data.fog.near, data.fog.far );
        this.app.scene.fog = fog;

        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        // loop through data camaras and add them to the scene
        this.graphBuilder = new MyGraphBuilder(data)


        const group = this.graphBuilder.buildGraph(data);
        // add group to the scene
        this.app.scene.add(group);
        
        this.printGroupInfo(group)

        // create target pointing to the origin
        const targetObject = new THREE.Object3D();
        targetObject.position.set(0, 0, 0);
        this.app.scene.add(targetObject);

        // add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff);
        ambientLight.intensity = 0.5;
        this.app.scene.add(ambientLight);

        this.output(data.options)
        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            this.output(texture, 1)
        }

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key]
            this.output(material, 1)
        }

        console.log("cameras:")
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            this.output(camera, 1)
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    printGroupInfo(group, ident = 0) {
        for (let child of group.children) {
            if (child.type === "Group") {
                this.printGroupInfo(child, ident +1)
            }
            else {
                console.log("" + new Array((ident + 1) * 4).join(' ') + " - " + child.type + " " + (child.id !== undefined ? "'" + child.id + "'" : ""))
            }
        }
    }

    initCameras(data) {
        for (var key in data.cameras) {
            let camera = data.cameras[key]
            if (camera.type === "perspective") {
                // create a perspective camera
                const cameraObj = new THREE.PerspectiveCamera();
                cameraObj.fov = camera.angle
                cameraObj.far = camera.far
                cameraObj.near = camera.near
                cameraObj.position.set(...camera.location)
                cameraObj.lookAt(...camera.target)
                this.app.cameras['Perspective2'] = cameraObj
            }
            if (camera.type === "orthogonal") {
                const cameraObj = new THREE.OrthographicCamera();
                cameraObj.left = camera.left
                cameraObj.right = camera.right
                cameraObj.top = camera.top
                cameraObj.bottom = camera.bottom
                cameraObj.far = camera.far
                cameraObj.near = camera.near
                cameraObj.position.set(...camera.location)
                cameraObj.lookAt(...camera.target)
                // add a left, right, top bootom, near and far camera
                console.log(camera)
                console.log(cameraObj)
                this.app.cameras['Orthogonal'] = cameraObj

            }

        }
    }


    
    update() {
        
    }
}

export { MyContents };
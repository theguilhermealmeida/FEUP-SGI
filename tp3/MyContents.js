import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraphBuilder } from './MyGraphBuilder.js';
import { MenuState } from './states/MenuState.js';
import { MyTextRenderer } from './MyTextRenderer.js';

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
		this.reader.open("scenes/t04g10/SGI_TP3_XML_T04_G10.xml");		

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

        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        // default material
        let defaultMaterial = {id: "default", color: 0x00ff00, specular: 0x000000, emissive: 0x00000, shininess: 0.0} 
        data.addMaterial(defaultMaterial)
        data.getNode("scene").materialIds[0] = defaultMaterial.id

        // ambient light
        let red = data.options.ambient.r
        let green = data.options.ambient.g
        let blue = data.options.ambient.b
        let alpha = data.options.ambient.a
        let ambientLight = new THREE.AmbientLight( new THREE.Color(red, green, blue), alpha);
        this.app.scene.add( ambientLight );

        // fog
        let fog = new THREE.Fog( data.fog.color, data.fog.near, data.fog.far );
        this.app.scene.fog = fog;

        // skybox
        let data_skybox = data.skyboxes.default
        let skybox = new THREE.BoxGeometry(...data_skybox.size)
        skybox.translate(...data_skybox.center)
        const skyboxTexturesArray = [
            new THREE.TextureLoader().load(data_skybox.right),
            new THREE.TextureLoader().load(data_skybox.left),
            new THREE.TextureLoader().load(data_skybox.up),
            new THREE.TextureLoader().load(data_skybox.back),
            new THREE.TextureLoader().load(data_skybox.front),
            new THREE.TextureLoader().load(data_skybox.down),
        ]
        let emissive = new THREE.Color(data_skybox.emissive.r, data_skybox.emissive.g, data_skybox.emissive.b)
        const skyBoxMaterialsArray = [
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[0]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[1]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[2]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[3]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[4]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[5]}),
        ];

        // Change texture wrapping and repeat for all textures in the skybox
        for (let i = 0; i < skyboxTexturesArray.length; i++) {
            // Set texture wrapping to RepeatWrapping
            skyboxTexturesArray[i].wrapS = THREE.RepeatWrapping;
            skyboxTexturesArray[i].wrapT = THREE.RepeatWrapping;

            // Set texture repeat - change these values as needed
            skyboxTexturesArray[i].repeat.set(1, 2); // This will repeat the texture twice along S and T axes
            // You can adjust the repeat values for different lengths on the skybox
        }

        let skyboxMesh = new THREE.Mesh(skybox, skyBoxMaterialsArray)
        this.app.scene.add(skyboxMesh)


        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        
        // loop through data camaras and add them to the scene
        this.graphBuilder = new MyGraphBuilder(data, this.app)


        const group = this.graphBuilder.buildGraph(data);  
    
        // add group to the scene
        this.app.scene.add(group);

        this.app.currentState.init()

        this.app.pickedMaterial = this.app.materials.get("violetApp");

        // this.track = this.app.scene.getObjectByName("track");

        // const trackControlPoints = this.track.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));

        // // at each track control point add a little box to the scene
        // trackControlPoints.forEach(point => {
        //     const geometry = new THREE.BoxGeometry(2, 2, 2);
        //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //     const cube = new THREE.Mesh(geometry, material);
        //     cube.position.set(point.x, point.y, point.z);
        //     this.app.scene.add(cube);
        // }
        // );
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

    update() {
        this.app.currentState.update()
    }
}

export { MyContents };
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraphBuilder } from './MyGraphBuilder.js';
import { MenuState } from './states/MenuState.js';
import { MyTextRenderer } from './MyTextRenderer.js';
import { MyShader } from './MyShader.js';

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
        this.gui = null

        this.shaders = []
        this.shadersReady = false


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

        this.createShaders()
    
        // add group to the scene
        this.app.scene.add(group);

        this.app.currentState.init()

        this.app.pickedMaterial = this.app.materials.get("violetApp");
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

    createShaders() {
        this.shaders.push(new MyShader(this.app, 'Obstacle Shader', "Obstacle shader", 'shaders/scaled-normal.vert', 'shaders/normal.frag', {
            normScale: { type: 'f', value: 0.1 }, // Example value, adjust as needed
            normalizationFactor: { type: 'f', value: 1 }, // Example value, adjust as needed
            displacement: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.graphBuilder.textures.get("pinTex")}, // Example value, adjust as needed// Adjust the color as needed
        }, "dynamic"))

        this.shaders.push(new MyShader(this.app, 'Billboard Shader', "Billboard shader", 'shaders/texture.vert', 'shaders/texture.frag', {
            normScale: { type: 'f', value: 1.0 }, // Example value, adjust as needed
            normalizationFactor: { type: 'f', value: 1.0 }, // Example value, adjust as needed
            displacement: { type: 'f', value: 1.0 }, // Example value, adjust as needed// Adjust the color as needed
            uSampler1: { type: 'sampler2D', value: this.graphBuilder.textures.get("billBoardTex")},
            uSampler2: { type: 'sampler2D', value: this.graphBuilder.textures.get("billBoardGrayTex")},
        }))

        // console.log(this.app.activeCamera)
        this.shaders.push(new MyShader(this.app, '3dEffectShader', "3dEffectShader", "shaders/live.vert", "shaders/live.frag", {
            normScale: {type: 'f', value: 2.0},
            displacement: {type: 'f', value: 1.0},
            normalizationFactor: {type: 'f', value: 1},
            timeFactor: {type: 'f', value: 0.0},
            rgbTexture: {type: 'sampler2D', value: ""},
            grayTexture: {type: 'sampler2D', value: ""},
            cameraNear: {type: 'f', value: "0.1"},
            cameraFar: {type: 'f', value: "1000"},
        }))

        this.waitShaders()
    }

    waitShaders() {
        console.log(this.shaders)
        for (let shader of this.shaders) {
            if (!shader.ready) {
                console.log("Waiting for shader " + shader.name)
                setTimeout(this.waitShaders.bind(this), 100)
                return
            }
        }

        this.applyShaders()
        this.shadersReady = true
        
    }
    

    applyShaders() {
        let shader0 = this.shaders[0]
        let shader1 = this.shaders[1]
        let shader2 = this.shaders[2]

        const material0 = shader0.material 
        const material1 = shader1.material 
        const material2 = shader2.material




        // loop through obstacles in this.graphBUilder.obstacles
        this.graphBuilder.obstacles.forEach(obstacle => {
            obstacle.material = material0;
        })

        let billboard = this.app.scene.getObjectByName("displayImage").getObjectByProperty("type", "Mesh")        // get meshes of obstacles
        billboard.material = material2
        this.startLiveImageShader()
    }


    startLiveImageShader() {
        this.updateInterval = 6000
        // Variable to store the interval ID
        let intervalId;

        // Add update interval folder to gui
        // let updateIntervalFolder = this.gui.addFolder("Live Billboard Controls");
        // Add update interval controller to gui
        // updateIntervalFolder.add(this, 'updateInterval', 1, 60000, 1).name("Snapshot Interval").onChange(() => {
        //     // Clear the current interval if it exists
        //     if (intervalId) {
        //         clearInterval(intervalId);
        //     }

        //     // Set up a new interval with the updated updateInterval value
        //     intervalId = setInterval(() => {
        //         this.app.getLiveImage();
        //     }, this.updateInterval);
        // });

        // updateIntervalFolder.add(this.shaders[2].uniformValues.normScale, 'value', 0, 100, 0.01).name("Effect Intensity").onChange((value) => {
        //     this.shaders[2].updateUniformsValue("normScale", value);
        // });

        // Initial setup of the interval
        intervalId = setInterval(() => {
            console.log("Getting live image")
            this.app.getLiveImage();
        }, this.updateInterval);
        
        // this.app.getLiveImage();
    }
    
    updateShaders() {
        this.shaders.forEach(shader => {
            if (shader.ready && shader.type === "dynamic") {
                const time = Date.now() * 0.001;
                shader.updateUniformsValue("normScale", Math.sin(time * 5) / 25 + 0.065);
            }
        });
    }

    update() {
        this.app.currentState.update()

        if (this.shadersReady) {
            this.updateShaders()
        }
    }

    setGUI(gui) {
        this.gui = gui
    }
}

export { MyContents };
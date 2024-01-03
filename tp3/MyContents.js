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

        // // add a cylinder
        // const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );

        // const vertShaderPath = 'shaders/scaled-normal.vert';  // Adjust the path to your shaders
        // const fragShaderPath = 'shaders/normal.frag';

        // // Define uniform values (you can adjust these as needed)
        // const uniformValues = {
        //     normScale: { type: 'f', value: 0.1 }, // Example value, adjust as needed
        //     normalizationFactor: { type: 'f', value: 1 }, // Example value, adjust as needed
        //     displacement: { type: 'f', value: 0.0 } // Example value, adjust as needed// Adjust the color as needed
        // };

        // // Create an instance of MyShader
        // this.shader = new MyShader(this, 'YourShaderName', 'Shader description', vertShaderPath, fragShaderPath, uniformValues);

        // // create a random material
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // const cylinder = new THREE.Mesh( geometry, this.shader.material );
        // // change position
        // cylinder.position.set(0, 10, 160)
        // this.app.scene.add( cylinder );

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

    createShaders() {
        this.shaders.push(new MyShader(this.app, 'Cylinder Shader', "Test shader", 'shaders/scaled-normal.vert', 'shaders/normal.frag', {
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
        let shader = this.shaders[0]

        const material = shader.material 

        let obstacle = this.app.scene.getObjectByName("cylinderShader").getObjectByProperty("type", "Mesh");
        obstacle.material = material;
        console.log("AQUI")
        // let obstacle = this.app.scene.getObjectByName("obstacles").getObjectByName("obstacle").children[0];
        console.log(obstacle)
        let model = this.app.scene.getObjectByName("obstacle3").getObjectByName("obstacle").getObjectByName("obstacle2_mesh")
        console.log(model)

        let billboard = this.app.scene.getObjectByName("displayImage").getObjectByProperty("type", "Mesh")        // get meshes of obstacles
        billboard.material = this.shaders[1].material

        // let test = this.app.scene.getObjectByName("shaderTester").getObjectByProperty("type", "Mesh")        // get meshes of obstacles
        // rotate test
        // test.rotation.x = - Math.PI / 2
        
        // test.material = this.shaders[1].material
        // let meshes = []
        // obstacle.children.forEach(obstacle => {
        //     obstacle.children.forEach(mesh => {
        //     })
        // })


        // const obstacles = this.graphBuilder.getObstacles();
        // console.log(obstacles)

        // // Now you can work with the fully loaded obstacles
        // obstacles.forEach(async (obstacle) => {
        //     const obj = await obstacle.objPromise;
        //     console.log(obj)
        //     // Do something with the fully loaded obj
        //     // e.g., add it to the scene
        // });
        


        // this.graphBuilder.getObstacles().then((obstacles) => {
        //     // Now you can work with the resolved obstacles array
        //     console.log(obstacles); // This should show the array with objects
        
        //     // Perform operations with the obstacles array here
        //     // ...
        // }).catch((error) => {
        //     console.error('Error fetching obstacles:', error);
        // });


        // loop through obstacles
            // loop through obstacle meshes
            // obstacle.children.forEach(mesh => {
            //     // if mesh is a mesh
            //     if (mesh.type === "Mesh") {
            //         // apply shader
            //         mesh.material = material;
            //     }
            // })

        // loop through obstacles in obstacles group



        // cylinder.material = material;
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

        // this.app.scene.getObjectByName("cylinderShader")
        // let cylinder = this.app.scene.getObjectByName("cylinderShader").getObjectByProperty("type", "Mesh");
        // console.log(cylinder)
        // cylinder.rotation.y += 0.01;
        // keep changing cylinder colors to test shader
        // cylinder.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());


        if (this.shadersReady) {
            this.updateShaders()
        }

        // let t = this.app.clock.getElapsedTime()
        // console.log(t)
        // let displacementValue = Math.sin(t); 
        // this.shader.updateUniformsValue("displacement", displacementValue);
        // const time = Date.now() * 0.001;
        // this.shader.updateUniformsValue("normScale", Math.sin(time*3));

    }
}

export { MyContents };
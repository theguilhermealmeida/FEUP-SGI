import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import { MyCake } from './MyCake.js';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';
import { MyHat } from './MyHat.js';
import { MyChair } from './MyChair.js'
import { MyFlashlight } from './MyFlashlight.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyFrame } from './MyFrame.js';
import { MyVase } from './MyVase.js';
import { MyNewspaper } from './MyNewspaper.js';
import { MySpiral } from './MySpiral.js';
import { MyFlower } from './MyFlower.js';
import { MyBalloon } from './MyBaloon.js';
import { MyTifo } from './MyTifo.js';


/**
 *  This class contains the contents of out application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */

    constructor(app) {
        this.app = app
        this.axis = null

        // floor related attributes
        this.floorHeight = 30
        this.floorWidth = 30
        this.floorTexture = new THREE.TextureLoader().load('textures/floor.jpeg');
        this.floorMaterial = new THREE.MeshStandardMaterial({ map: this.floorTexture });
        this.wallHeight = 0.4 * this.floorWidth

        // wall related attributes

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess
        })


        // walls related attributes
        this.wallTexture = new THREE.TextureLoader().load('textures/wall.jpeg');
        this.wallMaterial = new THREE.MeshStandardMaterial({
            map: this.wallTexture
        });

        // table related attributes
        this.tableWidth = 10
        this.tableDepth = 5
        this.tableThickness = 0.5
        this.legHeight = 2
        this.legRadius = 0.15
        this.tableColor = '#5C4033'
        this.tableLegsColor = '#a19d94'
        this.tablePosition = new THREE.Vector3(0, this.legHeight, 0)
        this.tableTexture = new THREE.TextureLoader().load('textures/table.jpeg');
        this.tableMaterial = new THREE.MeshPhongMaterial({
            map: this.tableTexture,
            color: 0xFFFFFF, // Set a neutral color (you can adjust this to match the wood texture)
            specular: 0x111111, // Adjust the specular color
            shininess: 20
        });
        this.tableLegsMaterial = new THREE.MeshPhongMaterial({
            color: this.tableLegsColor,
            specular: 0xffffff, // Set the specular color to white
            shininess: 50 // Increase the shininess value
        });

        // plate related attributes
        this.plateHeight = 0.2
        this.platePosition = new THREE.Vector3(this.tablePosition.x, this.tablePosition.y + this.tableThickness / 2 + this.plateHeight / 2, this.tablePosition.z)
        this.plateRadius = 0.9
        this.plateColor = '#ffffff'

        // cake related attributes
        this.cakeHeight = 0.4
        this.cakePosition = new THREE.Vector3(this.tablePosition.x, this.tablePosition.y + this.tableThickness / 2 + this.plateHeight + this.cakeHeight / 2 + 0.001, this.tablePosition.z)
        this.cakeRadius = 0.6
        this.cakeColor = '#964b00'

        // candle related attributes
        this.candleHeight = 0.25
        this.candlePosition = new THREE.Vector3(this.cakePosition.x + 0.2, this.tablePosition.y + this.tableThickness / 2 + this.plateHeight + this.cakeHeight + this.candleHeight / 2, this.cakePosition.z - 0.2)
        this.candleRadius = 0.01
        this.candleColor = '#ffffff'

        // hat related attributes
        this.hatHeight = 0.5
        this.hatPosition = new THREE.Vector3(this.tablePosition.x + 0.3 * this.tableWidth, this.tablePosition.y + this.tableThickness / 2 + this.hatHeight / 2, this.tablePosition.z + 0.2 * this.tableDepth)
        this.hatRadius = 0.2
        this.hatColor = '#FF69B4'

        // chair related attributes
        this.position = new THREE.Vector3(this.tablePosition.x, this.tablePosition.y * 0.65, this.tablePosition.z - 0.5 * this.tableDepth);
        this.seatSize = { width: 1, depth: 1 };
        this.backSize = { width: 1, height: 1 };
        this.chairLegHeight = this.position.y;
        this.chariLegRadius = 0.1;
        this.chairColor = 0x808080;



        // create rectLight helper
        // this.rectLightHelper = new THREE.RectAreaLightHelper( this.rectLight );
        // this.app.scene.add( this.rectLightHelper );



        // plane related attributes
        this.planeSizeU = 10;
        this.planeSizeV = 7;
        let planeUVRate = this.planeSizeV / this.planeSizeU;
        let planeTextureUVRate = 3354 / 2385; // image dimensions

        this.planeWrappingModeU = THREE.RepeatWrapping
        this.planeWrappingModeV = THREE.RepeatWrapping
        this.planeRepeatU = 1
        this.planeRepeatV = this.planeRepeatU * planeUVRate * planeTextureUVRate;
        this.planeOffsetU = 0
        this.planeOffsetV = 0
        this.planeRotation = 0


        //texture
        this.planeTexture = new THREE.TextureLoader().load('textures/feup_b.jpg');
        this.cubeTexture = new THREE.TextureLoader().load('textures/feup_entry.jpg');

        this.cubeTexture.wrapS = THREE.RepeatWrapping;

        this.cubeTexture.wrapT = THREE.RepeatWrapping;

        // material

        this.diffusePlaneColor = "rgb(128,0,0)"

        this.specularPlaneColor = "rgb(0,0,0)"

        this.planeShininess = 0

        // relating texture and material:

        // two alternatives with different results

        // alternative 1

        // this.planeMaterial = new THREE.MeshPhongMaterial({

        //     color: this.diffusePlaneColor,

        //     specular: this.specularPlaneColor,

        //     emissive: "#000000", shininess: this.planeShininess,

        //     map: this.planeTexture
        // })

        // end of alternative 1

        // alternative 2

        // this.planeMaterial = new THREE.MeshLambertMaterial({

        //     map: this.planeTexture
        // });

        // // end of alternative 2

        // let plane = new THREE.PlaneGeometry(10, 10);

        const map =
            new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map,
                        side: THREE.DoubleSide,
                        transparent: true, opacity: 0.90 } );
        this.builder = new MyNurbsBuilder()

        this.meshes = []

        this.samplesU = 16         // maximum defined in MyGuiInterface
        this.samplesV = 16        // maximum defined in MyGuiInterface

        this.init()

        //this.createNurbsSurfaces()  

        //this.vase = new MyVase(this.app,new THREE.Vector3(3,0,2))
        //this.vase.display()

        //this.newspaper = new MyNewspaper(this.app,new THREE.Vector3(3,0,2))
        //this.newspaper.display()

        //this.frame = new MyFrame(this.app, 10, 6, 0.3,new THREE.Vector3(3,0,2))
        //this.frame.display()

        //this.spiral = new MySpiral(this.app,new THREE.Vector3(3,0,0))
        //this.spiral.display()

        //this.flower = new MyFlower(this.app,new THREE.Vector3(3,0,0))
        //this.flower.display()

        //this.balloon = new MyBalloon(this.app,new THREE.Vector3(3,0,0),0xff0000)
        //this.balloon.display()

        this.tifo = new MyTifo(this.app,new THREE.Vector3(0,0,0))
        this.tifo.display()

    }



    /**
     * builds the box mesh with material assigned
     */
    

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

        // add lightbulb geometry on the point light
        // add a point light on top of the model

        let spotLight = new THREE.SpotLight(0xffffff, 500, 0, Math.PI / 4, 1);
        spotLight.position.set(this.tablePosition.x, this.wallHeight, this.tablePosition.z);
        spotLight.power = 100
        spotLight.target.position.copy(this.tablePosition);
        this.app.scene.add(spotLight);
        // create spotlight helper
        // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        // this.app.scene.add( spotLightHelper );

        // create a lightbulb object thats the source of the spotlight
        const lightbulbGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const lightbulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lightbulbMesh = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);
        lightbulbMesh.position.copy(spotLight.position);
        this.app.scene.add(lightbulbMesh);


        // create a cilinder
        // make the cilinder a child of the spotlight

        this.cilinder = new THREE.CylinderGeometry(0.08, 0.8, 0.5, 32, 1, true);
        this.cilinderMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 1, side: THREE.DoubleSide });
        this.cilinderMesh = new THREE.Mesh(this.cilinder, this.cilinderMaterial);
        this.cilinderMesh.position.copy(spotLight.position);
        this.app.scene.add(this.cilinderMesh);




        let isLightOn = true;
        setInterval(() => {
            if (isLightOn) {
                spotLight.intensity = 0;
                // remove lightbulb mesh
                this.app.scene.remove(lightbulbMesh);
            } else {
                spotLight.intensity = 10;
                this.app.scene.add(lightbulbMesh)
            }
            isLightOn = !isLightOn;
        }, 250);

        // add a point light helper for the previous point light
        // const sphereSize = 0.5;
        // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        // this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        // this.app.scene.add(ambientLight);

        // this.planeTexture.wrapS = this.planeWrappingModeU
        // this.planeTexture.wrapT = this.planeWrappingModeV;
        // this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV );
        // this.planeTexture.rotation = this.planeRotation
        // this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU,this.planeOffsetV);

        // this.planeWrappingModeU = THREE.RepeatWrapping
        // this.planeWrappingModeV = THREE.RepeatWrapping
        // this.planeRepeatU = 1
        // this.planeRepeatV = this.planeRepeatU * planeUVRate * planeTextureUVRate; 
        // this.planeOffsetU = 0
        // this.planeOffsetV = 0
        // this.planeRotation = 0

        let floorSizeU = 10;
        let floorSizeV = 10;
        let floorUVRate = floorSizeV / floorSizeU;
        let floorTextureUVRate = 3354 / 2385; // image dimensions
        let floorRepeatU = 3
        let floorRepeatV = floorRepeatU * floorUVRate * floorTextureUVRate
        let floorOffsetU = 0
        let floorOffsetV = 0
        let floor = new THREE.PlaneGeometry(this.floorHeight, this.floorWidth);

        this.floorTexture.wrapS = THREE.RepeatWrapping
        this.floorTexture.wrapT = THREE.RepeatWrapping
        this.floorTexture.repeat.set(floorRepeatU, floorRepeatV)
        this.floorTexture.rotation = 0
        this.floorTexture.offset = new THREE.Vector2(floorOffsetU, floorOffsetV)

        this.floorMesh = new THREE.Mesh(floor, this.floorMaterial);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add(this.floorMesh);


        let wallRepeatU = 1
        let wallRepeatV = 1
        let wallOffsetU = 0
        let wallOffsetV = 0
        let wall = new THREE.PlaneGeometry(this.floorHeight, this.floorWidth);

        this.wallTexture.wrapS = THREE.RepeatWrapping
        this.wallTexture.wrapT = THREE.ClampToEdgeWrapping
        this.wallTexture.repeat.set(wallRepeatU, wallRepeatV)
        this.wallTexture.rotation = 0
        this.wallTexture.offset = new THREE.Vector2(wallOffsetU, wallOffsetV)
        for (let i = 0; i < 4; i++) {
            if (i % 2 == 0) {
                wall = new THREE.PlaneGeometry(this.floorHeight, this.wallHeight);
            }
            else {
                wall = new THREE.PlaneGeometry(this.floorWidth, this.wallHeight);
            }
            let wallMesh = new THREE.Mesh(wall, this.wallMaterial);
            wallMesh.position.x = 0;
            wallMesh.position.y = this.wallHeight / 2;
            wallMesh.position.z = 0;
            wallMesh.rotation.y = Math.PI / 2 * i;
            if (i % 2 == 0) {
                wallMesh.translateZ(-this.floorWidth / 2);
            }
            else {
                wallMesh.translateZ(-this.floorHeight / 2);
            }
            this.app.scene.add(wallMesh);
        }

        let table = new MyTable(this.app, this.tableWidth, this.tableDepth, this.tableThickness, this.tableMaterial, this.tableLegsMaterial, this.legHeight, this.legRadius, this.tablePosition);
        // table.display();

        let plate = new MyPlate(this.app, this.platePosition, this.plateRadius, this.plateHeight, this.plateColor);
        // plate.display();

        let cake = new MyCake(this.app, this.cakePosition, this.cakeRadius, this.cakeHeight, this.cakeColor);
        // cake.display();

        let candle = new MyCandle(this.app, this.candlePosition, this.candleRadius, this.candleHeight, this.candleColor);
        // candle.display()

        let hat = new MyHat(this.app, this.hatPosition, this.hatRadius, this.hatHeight, this.hatColor);
        // hat.display()

        // let chair = new MyChair(this.app, this.position, this.seatSize, this.backSize, this.chairLegHeight, this.chariLegRadius, this.chairColor);
        // chair.display()


        this.windowTexture = new THREE.TextureLoader().load('textures/window2.jpeg');
        this.windowGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth, 0.15 * this.floorWidth); // Adjust the size as needed
        this.windowMaterial = new THREE.MeshBasicMaterial({ map: this.windowTexture });
        this.window = new THREE.Mesh(this.windowGeometry, this.windowMaterial);

        this.window.position.set(0, this.wallHeight * 0.65, -this.floorHeight / 2 + 0.102);

        this.frameGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth + 0.2, 0.15 * this.floorWidth + 0.2); // Slightly larger than the window
        this.frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }); // Black color for the frame

        this.frame = new THREE.Mesh(this.frameGeometry, this.frameMaterial);

        // Position the window frame behind the window
        this.frame.position.copy(this.window.position);
        this.frame.position.z -= 0.001;
        this.app.scene.add(this.frame);

        // Create a RectAreaLight
        const width = this.windowGeometry.parameters.width;
        const height = this.windowGeometry.parameters.height;
        const intensity = 1;
        this.rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        this.rectLight.position.set(this.frame.position.x, this.frame.position.y, this.frame.position.z);
        this.rectLight.lookAt(this.frame.position.x, this.frame.position.y, this.frame.position.z + this.floorHeight);
        this.rectLight.power = 400

        this.rectLight2 = new THREE.RectAreaLight(0xffffff, intensity, this.floorHeight, this.wallHeight);
        this.rectLight2.position.set(this.frame.position.x, this.wallHeight, this.frame.position.z);
        this.rectLight2.lookAt(this.frame.position.x, this.frame.position.y, -(this.frame.position.z + this.floorHeight));
        this.rectLight2.power = 0.4 * this.rectLight.power


        // let flashlight = new MyFlashlight(this.app, new THREE.Vector3(-this.tablePosition.y-this.tableWidth*0.8, this.tablePosition.y+0.35, this.tablePosition.z), 0xffffff, 0, this.tableWidth);
        // let flashlight2 = new MyFlashlight(this.app, new THREE.Vector3(-this.tablePosition.y-this.tableWidth*0.2, this.tablePosition.y+0.35, this.tablePosition.z), 0xffffff,1, this.tableWidth);
        let flashlight = new MyFlashlight(this.app, new THREE.Vector3(this.tablePosition.x - this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z), 0xffffff, 0, this.tableWidth);
        let flashlight2 = new MyFlashlight(this.app, new THREE.Vector3(this.tablePosition.x + this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z), 0xffffff, 1, this.tableWidth);
        // rotate the flashlight

        flashlight.display()
        flashlight2.display()

        this.app.scene.add(this.window);
        this.app.scene.add(this.rectLight)
        this.app.scene.add(this.rectLight2)

        // this.buildBox()


        // Create a Plane Mesh with basic material

        this.planeTexture.wrapS = this.planeWrappingModeU
        this.planeTexture.wrapT = this.planeWrappingModeV;
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV);
        this.planeTexture.rotation = this.planeRotation
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU, this.planeOffsetV);

        // uncomment to add plane to the scene
        // var plane = new THREE.PlaneGeometry( this.planeSizeU, this.planeSizeV );
        // this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        // this.planeMesh.rotation.x = -Math.PI / 2;
        // this.planeMesh.position.y = 0;
        // this.app.scene.add( this.planeMesh );
    }


    /**
     * removes (if existing) and recreates the nurbs surfaces
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    updateWrappingModeU(value) {
        this.planeWrappingModeU = value
        this.planeTexture.wrapS = this.planeWrappingModeU
    }

    updateWrappingModeV(value) {
        this.planeWrappingModeV = value
        this.planeTexture.wrapT = this.planeWrappingModeV
    }

    updateRepeatU(value) {
        this.planeRepeatU = value
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV);
    }

    updateRepeatV(value) {
        this.planeRepeatV = value
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV);
    }

    updateOffsetU(value) {
        this.planeOffsetU = value
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU, this.planeOffsetV);
    }

    updateOffsetV(value) {
        this.planeOffsetV = value
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU, this.planeOffsetV);
    }

    updateRotation(value) {
        let radians = value * Math.PI / 180;
        this.planeRotation = radians
        this.planeTexture.rotation = this.planeRotation
    }



    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {
            this.app.scene.remove(this.boxMesh);
        }
        // this.buildBox();
        this.lastBoxEnabled = null;
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    // updateBoxIfRequired() {
    //     if (this.boxEnabled !== this.lastBoxEnabled) {
    //         this.lastBoxEnabled = this.boxEnabled;
    //         if (this.boxEnabled) {
    //             this.app.scene.add(this.boxMesh);
    //         }
    //         else {
    //             this.app.scene.remove(this.boxMesh);
    //             this.createNurbsSurfaces();
    //         }
    //     }
    //     if (this.boxEnabled !== this.lastBoxEnabled) {
    //         this.lastBoxEnabled = this.boxEnabled
    //         if (this.boxEnabled) {
    //             this.app.scene.add(this.boxMesh)
    //         }
    //         else {
    //             this.app.scene.remove(this.boxMesh)
    //         }
    createNurbsSurfaces() {

        // are there any meshes to remove?
        if (this.meshes !== null) {
            // traverse mesh array
            for (let i = 0; i < this.meshes.length; i++) {
                // remove all meshes from the scene
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 1
        let orderV = 1

        // build nurb #1
        controlPoints =
            [   // U = 0
                [ // V = 0..1;
                    [-2.0, -2.0, 0.0, 1],
                    [-2.0, 2.0, 0.0, 1]
                ],
                // U = 1
                [ // V = 0..1
                    [2.0, -2.0, 0.0, 1],
                    [2.0, 2.0, 0.0, 1]
                ]
            ]

        surfaceData = this.builder.build(controlPoints,
            orderU, orderV, this.samplesU,
            this.samplesV, this.material)
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(-4, 3, 0)
        this.app.scene.add(mesh)
        this.meshes.push(mesh)


        // build nurb #2
        controlPoints =
            [   // U = 0
                [ // V = 0..1;
                    [-1.5, -1.5, 0.0, 1],
                    [-1.5, 1.5, 0.0, 1]
                ],

                // U = 1
                [ // V = 0..1
                    [0, -1.5, 3.0, 1],
                    [0, 1.5, 3.0, 1]
                ],

                // U = 2
                [ // V = 0..1
                    [1.5, -1.5, 0.0, 1],
                    [1.5, 1.5, 0.0, 1]
                ]
            ]

        surfaceData = this.builder.build(controlPoints,
            2, 1, this.samplesU,
            this.samplesV, this.material)
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(4, 3, 0)
        this.app.scene.add(mesh)
        this.meshes.push(mesh)

        // build nurb #3
        controlPoints =
            [   // U = 0
                [ // V = 0..3;
                    [-1.5, -1.5, 0.0, 1],
                    [-2.0, -2.0, 2.0, 1],
                    [-2.0, 2.0, 2.0, 1],
                    [-1.5, 1.5, 0.0, 1]
                ],
                // U = 1
                [ // V = 0..3
                    [0.0, 0.0, 3.0, 1],
                    [0.0, -2.0, 3.0, 1],
                    [0.0, 2.0, 3.0, 1],
                    [0.0, 0.0, 3.0, 1]
                ],
                // U = 2
                [ // V = 0..3
                    [1.5, -1.5, 0.0, 1],
                    [2.0, -2.0, 2.0, 1],
                    [2.0, 2.0, 2.0, 1],
                    [1.5, 1.5, 0.0, 1]
                ]
            ]

        surfaceData = this.builder.build(controlPoints,
            2, 3, this.samplesU,
            this.samplesV, this.material)
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(-4, -3, 0)
        this.app.scene.add(mesh)
        this.meshes.push(mesh)

        // build nurb #4
        controlPoints =
            [   // U = 0
                [ // V = 0..2;
                    [-2.0, -2.0, 1.0, 1],
                    [0, -2.0, 0, 1],
                    [2.0, -2.0, -1.0, 1]
                ],
                // U = 1
                [ // V = 0..2
                    [-2.0, -1.0, -2.0, 1],
                    [0, -1.0, -1.0, 1],
                    [2.0, -1.0, 2.0, 1]
                ],
                // U = 2
                [ // V = 0..2
                    [-2.0, 1.0, 5.0, 1],
                    [0, 1.0, 1.5, 1],
                    [2.0, 1.0, -5.0, 1]
                ],
                // U = 3
                [ // V = 0..2
                    [-2.0, 2.0, -1.0, 1],
                    [0, 2.0, 0, 1],
                    [2.0, 2.0, 1.0, 1]
                ]
            ]

        surfaceData = this.builder.build(controlPoints,
            3, 2, this.samplesU,
            this.samplesV, this.material)
        mesh = new THREE.Mesh(surfaceData, this.material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(4, -3, 0)
        this.app.scene.add(mesh)
        this.meshes.push(mesh)
    }
    // function to convert degrees to radians


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {
        // check if box mesh needs to be updated
        // this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        // this.boxMesh.position.x = this.boxDisplacement.x
        // this.boxMesh.position.y = this.boxDisplacement.y
        // this.boxMesh.position.z = this.boxDisplacement.z

    }
}

export { MyContents };
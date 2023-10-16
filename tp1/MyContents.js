import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyObjects/MyTable.js';
import { MyCake } from './MyObjects/MyCake.js';
import { MyPlate } from './MyObjects/MyPlate.js';
import { MyCandle } from './MyObjects/MyCandle.js';
import { MyHat } from './MyObjects/MyHat.js';
import { MyChair } from './MyObjects/MyChair.js'
import { MyFlashlight } from './MyObjects/MyFlashlight.js';
import { MyNurbsBuilder } from './MyObjects/MyNurbsBuilder.js';
import { MyCarocha } from './MyObjects/MyCarocha.js';
import { MyVase } from './MyObjects/MyVase.js';
import { MyNewspaper } from './MyObjects/MyNewspaper.js';
import { MySpiral } from './MyObjects/MySpiral.js';
import { MyFlower } from './MyObjects/MyFlower.js';
import { MyBalloon } from './MyObjects/MyBaloon.js';
import { MyTifo } from './MyObjects/MyTifo.js';


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

        this.mapSize  = 8192

        // floor related attributes
        this.floorHeight = 30
        this.floorWidth = 30
        this.floorTexture = new THREE.TextureLoader().load('textures/floor.jpeg');
        this.floorMaterial = new THREE.MeshStandardMaterial({ map: this.floorTexture });
        this.wallHeight = 0.4 * this.floorWidth

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

        this.spotLight = new THREE.SpotLight(0xffffff, 150, 0, Math.PI / 2.1);
        this.spotLight.position.set(this.tablePosition.x, this.wallHeight + 1, this.tablePosition.z);
        this.spotLight.target.position.copy(this.tablePosition);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = this.mapSize;
        this.spotLight.shadow.mapSize.height = this.mapSize;
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 500;
        this.spotLight.shadow.focus = 1;

        this.init()

    }

    /**
     * initializes the contents
     */
    init() {

        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }


        // main source of light

        this.app.scene.add(this.spotLight);
        const lightbulbGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const lightbulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lightbulbMesh = new THREE.Mesh(lightbulbGeometry, lightbulbMaterial);
        lightbulbMesh.position.copy(this.spotLight.position);
        this.app.scene.add(lightbulbMesh);

        this.cilinder = new THREE.CylinderGeometry(0.08, 0.8, 0.5, 32, 1, true);
        this.cilinderMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: 1, side: THREE.DoubleSide });
        this.cilinderMesh = new THREE.Mesh(this.cilinder, this.cilinderMaterial);
        this.cilinderMesh.position.copy(this.spotLight.position);
        this.app.scene.add(this.cilinderMesh);

        // Create an ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        //this.app.scene.add(ambientLight);


        let isLightOn = false;

        // Function to toggle the light state
        function toggleLight() {
            isLightOn = !isLightOn; // Toggle the state

            if (isLightOn) {
                spotLight.intensity = 0
            } else {
                spotLight.intensity = 20
            }
        }

        // Interval for changing the light state (e.g., every 2 seconds)
        // const interval = 100; // 2000 milliseconds (2 seconds)

        // // Set an interval to toggle the light
        // const lightInterval = setInterval(toggleLight, interval);

        // // Stop the interval after a certain duration (e.g., 10 seconds)
        // const stopDuration = 50000; // 10000 milliseconds (10 seconds)

        // setTimeout(() => {
        //     clearInterval(lightInterval); // Stop the interval
        //     console.log('Lightbulb simulation stopped');
        // }, stopDuration);

        // let isLightOn = true; setInterval(() => {
        //     if (isLightOn) {
        //         spotLight.intensity = 0;
        //         this.app.scene.remove(lightbulbMesh);
        //     } else {
        //         spotLight.intensity = 20;
        //         this.app.scene.add(lightbulbMesh)
        //     }
        //     isLightOn = !isLightOn;
        // }, 800);


        // FLOOR SECTION 

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
        this.floorMesh.receiveShadow = true;
        this.app.scene.add(this.floorMesh);


        // WALL SECTION

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
            wallMesh.receiveShadow = true;
            if (i % 2 == 0) {
                wallMesh.translateZ(-this.floorWidth / 2);
            }
            else {
                wallMesh.translateZ(-this.floorHeight / 2);
            }
            this.app.scene.add(wallMesh);
        }


        // OBJECTS SECTION 

        
        // table
        let table = new MyTable(this.app, this.tableWidth, this.tableDepth, this.tableThickness, this.tableMaterial, this.tableLegsMaterial, this.legHeight, this.legRadius, this.tablePosition);
        table.display();

        // plate
        let plate = new MyPlate(this.app, this.platePosition, this.plateRadius, this.plateHeight, this.plateColor);
        plate.display();

        // cake
        let cake = new MyCake(this.app, this.cakePosition, this.cakeRadius, this.cakeHeight, this.cakeColor);
        cake.display();

        // candle
        let candle = new MyCandle(this.app, this.candlePosition, this.candleRadius, this.candleHeight, this.candleColor);
        candle.display()

        // hat
        let hat = new MyHat(this.app, this.hatPosition, this.hatRadius, this.hatHeight, this.hatColor);
        hat.display()

        // chair
        let chair = new MyChair(this.app, this.position, this.seatSize, this.backSize, this.chairLegHeight, this.chariLegRadius, this.chairColor);
        chair.display()


        // paintings
        this.paintingFrameTexture = new THREE.TextureLoader().load('textures/bear.jpeg');

        this.paintingFrameGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth, 0.15 * this.floorWidth);
        this.paintingFrameMaterial = new THREE.MeshStandardMaterial({ map: this.paintingFrameTexture, emissive: "#000000" });
        this.paintingFrame = new THREE.Mesh(this.paintingFrameGeometry, this.paintingFrameMaterial);
        this.paintingFrame.position.set(this.floorHeight * 0.2, this.wallHeight * 0.65, this.floorWidth / 2 - 0.102);
        this.paintingFrame.rotation.y = Math.PI;

        this.frameGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth + 0.3, 0.15 * this.floorWidth + 0.3); // Slightly larger than the window
        this.frameMaterial = new THREE.MeshStandardMaterial({ color: 0x352500, side: THREE.DoubleSide }); // Black color for the frame
        this.frame = new THREE.Mesh(this.frameGeometry, this.frameMaterial);

        this.frame.position.copy(this.paintingFrame.position);
        this.frame.position.z += 0.01;
        this.app.scene.add(this.frame);
        this.app.scene.add(this.paintingFrame);


        this.paintingFrame2Texture = new THREE.TextureLoader().load('textures/bear2.webp');
        this.paintingFrameGeometry2 = new THREE.PlaneGeometry(0.15 * this.floorWidth, 0.15 * this.floorWidth);
        this.paintingFrameMaterial2 = new THREE.MeshStandardMaterial({ map: this.paintingFrame2Texture, emissive: "#000000" });
        this.paintingFrame2 = new THREE.Mesh(this.paintingFrameGeometry2, this.paintingFrameMaterial2);
        this.paintingFrame2.position.set(-this.floorHeight * 0.2, this.wallHeight * 0.65, this.floorWidth / 2 - 0.102);
        this.paintingFrame2.rotation.y = Math.PI;

        this.frameGeometry2 = new THREE.PlaneGeometry(0.15 * this.floorWidth + 0.3, 0.15 * this.floorWidth + 0.3); // Slightly larger than the window
        this.frameMaterial2 = new THREE.MeshStandardMaterial({ color: 0x352500, side: THREE.DoubleSide }); // Black color for the frame
        this.frame2 = new THREE.Mesh(this.frameGeometry2, this.frameMaterial2);
        this.frame2.position.copy(this.paintingFrame2.position);
        this.frame2.position.z += 0.01;

        this.app.scene.add(this.frame2);
        this.app.scene.add(this.paintingFrame2);


        // window
        this.windowTexture = new THREE.TextureLoader().load('textures/window2.jpeg');
        this.windowGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth, 0.15 * this.floorWidth); // Adjust the size as needed
        this.windowMaterial = new THREE.MeshBasicMaterial({ map: this.windowTexture });
        this.window = new THREE.Mesh(this.windowGeometry, this.windowMaterial);

        this.window.position.set(0, this.wallHeight * 0.65, -this.floorWidth / 2 + 0.102);

        this.frameGeometry = new THREE.PlaneGeometry(0.15 * this.floorWidth + 0.2, 0.15 * this.floorWidth + 0.2); // Slightly larger than the window
        this.frameMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }); // Black color for the frame

        this.frame = new THREE.Mesh(this.frameGeometry, this.frameMaterial);

        this.frame.position.copy(this.window.position);
        this.frame.position.z -= 0.01;
        this.app.scene.add(this.frame);

        // window light
        const width = this.windowGeometry.parameters.width;
        const height = this.windowGeometry.parameters.height;
        const intensity = 1;
        this.rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
        this.rectLight.position.set(this.frame.position.x, this.frame.position.y, this.frame.position.z);
        this.rectLight.lookAt(this.frame.position.x, this.frame.position.y, this.frame.position.z + this.floorHeight);
        this.rectLight.power = 200
        this.rectLight2 = new THREE.RectAreaLight(0xffffff, intensity, this.floorHeight, this.wallHeight);
        this.rectLight2.position.set(this.frame.position.x, this.wallHeight, this.frame.position.z);
        this.rectLight2.lookAt(this.frame.position.x, this.frame.position.y, -(this.frame.position.z + this.floorHeight));
        this.rectLight2.power = 0.4 * this.rectLight.power

        this.app.scene.add(this.window);
        this.app.scene.add(this.rectLight)
        this.app.scene.add(this.rectLight2)


        // flashlights
        // let flashlight = new MyFlashlight(this.app, new THREE.Vector3(this.tablePosition.x - this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z), 0xffffff, 0, this.tableWidth);
        // let flashlight2 = new MyFlashlight(this.app, new THREE.Vector3(this.tablePosition.x + this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z), 0xffffff, 1, this.tableWidth);
        // flashlight.display()
        // flashlight2.display()


        this.vase = new MyVase(this.app,new THREE.Vector3(this.tablePosition.x + this.tableWidth * 0.3, this.tablePosition.y + 0.25, this.tablePosition.z - 0.2 * this.tableDepth), 0.4,0.35,0.4)
        this.vase.display()

        // flower
        this.flower = new MyFlower(this.app, new THREE.Vector3(this.tablePosition.x + this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z - 0.2 * this.tableDepth))
        this.flower.display()

        this.newspaper = new MyNewspaper(this.app,new THREE.Vector3(this.tablePosition.x, this.tablePosition.y + 0.25, this.tablePosition.z - this.tableDepth/3), 0.2,0.2,0.2)
        this.newspaper.display()

        // carocha
        this.carocha = new MyCarocha(this.app, new THREE.Vector3(this.floorHeight / 2, this.wallHeight * 0.6, 0), 0.5, 0.5, 0.5)
        this.carocha.display()

        // spiral
        this.spiral = new MySpiral(this.app, new THREE.Vector3(this.tablePosition.x - this.tableWidth * 0.3, this.tablePosition.y + 0.35, this.tablePosition.z - 0.2 * this.tableDepth), 0.2, 0.2, 0.2)
        this.spiral.display()


        // balloons
        for (let i = 0; i < 8; i++) {
            let balloon = new MyBalloon(this.app,new THREE.Vector3(this.tablePosition.x + Math.cos(i * Math.PI / 4) * this.tableWidth/1.5 , 0, this.tablePosition.z + Math.sin(i * Math.PI / 4) * this.tableWidth / 1.5),0xffffff * Math.random())
            balloon.display()
        }
        

        // tifo
        this.tifo = new MyTifo(this.app, new THREE.Vector3(-this.floorHeight / 2 * 0.8, this.wallHeight * 0.6, 4))
        this.tifo.display()
        this.stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 32);
        this.stringMaterial = new THREE.MeshPhongMaterial({ color: 0xFFC0CB, transparent: false, opacity: 1, side: THREE.DoubleSide });
        this.stringMesh = new THREE.Mesh(this.stringGeometry, this.stringMaterial);
        this.stringMesh.position.set(-this.floorHeight / 2 * 0.8, this.wallHeight * 0.88, 4);
        this.stringMesh.castShadow = true;
        this.stringMesh.receiveShadow = true;
        this.app.scene.add(this.stringMesh);

        this.stringGeometry2 = new THREE.CylinderGeometry(0.02, 0.02, 3, 32);
        this.stringMaterial2 = new THREE.MeshPhongMaterial({ color: 0xFFC0CB, transparent: false, opacity: 1, side: THREE.DoubleSide });
        this.stringMesh2 = new THREE.Mesh(this.stringGeometry2, this.stringMaterial2);
        this.stringMesh2.position.set(-this.floorHeight / 2 * 0.8, this.wallHeight * 0.88, -4);
        this.stringMesh.castShadow = true;
        this.stringMesh.receiveShadow = true;
        this.app.scene.add(this.stringMesh2);

    }

    // function for interface to control light on and off
    lightOn() {
        if (this.spotLight.intensity == 0) {
            this.spotLight.intensity = 150 
        } else {
            this.spotLight.intensity = 0
        }
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {

    }
}

export { MyContents };
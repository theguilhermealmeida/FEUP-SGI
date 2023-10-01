import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';
import { MyCake} from './MyCake.js';
import { MyPlate} from './MyPlate.js';
import { MyCandle} from './MyCandle.js';

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

        // floor related attributes
        this.floorHeight = 30
        this.floorWidth = 30


        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })

        // table related attributes
        this.tableWidth = 6
        this.tableDepth = 4
        this.tableThickness = 0.5
        this.legHeight = 2
        this.legRadius = 0.3
        this.tableColor = '#8B4513'
        this.tablePosition = new THREE.Vector3(0, 2, 0)

        // plate related attributes
        this.plateHeight = 0.2
        this.platePosition = new THREE.Vector3(this.tablePosition.x, this.tablePosition.y + this.tableThickness/2 + this.plateHeight/2, this.tablePosition.z)
        this.plateRadius = 0.9
        this.plateColor = '#ffffff'

        // cake related attributes
        this.cakeHeight = 0.4
        this.cakePosition = new THREE.Vector3(this.tablePosition.x, this.tablePosition.y + this.tableThickness/2 + this.plateHeight + this.cakeHeight/2, this.tablePosition.z)
        this.cakeRadius = 0.6
        this.cakeColor = '#964b00'

        // candle related attributes
        this.candleHeight = 0.25 
        this.candlePosition = new THREE.Vector3(this.cakePosition.x + 0.2, this.tablePosition.y + this.tableThickness/2 + this.plateHeight + this.cakeHeight + this.candleHeight/2, this.cakePosition.z - 0.2)
        this.candleRadius = 0.01
        this.candleColor = '#ffffff'

    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );

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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );
        
        let floor = new THREE.PlaneGeometry(this.floorHeight,this.floorWidth);
        this.floorMesh = new THREE.Mesh( floor, this.planeMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add( this.floorMesh);

        for (let i = 0; i < 4; i++) {
            let wall = new THREE.PlaneGeometry(this.floorHeight, this.floorWidth);
            let wallMesh = new THREE.Mesh( wall, this.planeMaterial );
            wallMesh.position.x = 0;
            wallMesh.position.y = this.floorHeight/2;
            wallMesh.position.z = 0;
            wallMesh.rotation.y = Math.PI / 2 * i;
            wallMesh.translateZ(-this.floorHeight/2);
            this.app.scene.add( wallMesh );
        }

        let table = new MyTable(this.app, this.tableWidth, this.tableDepth, this.tableThickness, this.tableColor, this.legHeight, this.legRadius, this.tablePosition);
        table.display();

        let plate = new MyPlate(this.app, this.platePosition, this.plateRadius, this.plateHeight, this.plateColor);
        plate.display();

        let cake = new MyCake(this.app, this.cakePosition, this.cakeRadius, this.cakeHeight, this.cakeColor);
        cake.display();

        let candle = new MyCandle(this.app, this.candlePosition, this.candleRadius, this.candleHeight, this.candleColor);
        candle.display()
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
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
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
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
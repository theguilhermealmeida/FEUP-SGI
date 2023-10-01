import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyTable } from './MyTable.js';

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
        
        let floor = new THREE.PlaneGeometry( 10, 10 );
        this.floorMesh = new THREE.Mesh( floor, this.planeMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = -0;
        this.app.scene.add( this.floorMesh );

        for (let i = 0; i < 4; i++) {
            let wall = new THREE.PlaneGeometry( 10, 10 );
            let wallMesh = new THREE.Mesh( wall, this.planeMaterial );
            wallMesh.position.x = 0;
            wallMesh.position.y = 5;
            wallMesh.position.z = 0;
            wallMesh.rotation.y = Math.PI / 2 * i;
            wallMesh.translateZ(-5);
            this.app.scene.add( wallMesh );
        }

        let table = new MyTable(this.app, this.tableWidth, this.tableDepth, this.tableThickness, this.tableColor, this.legHeight, this.legRadius, this.tablePosition);
        this.app.scene.add(table);

        // let table = new THREE.BoxGeometry( 6, 0.5, 4 );
        // let tableMesh = new THREE.Mesh( table, this.planeMaterial );
        // tableMesh.position.x = 0;
        // tableMesh.position.y = 2;
        // tableMesh.position.z = 0;
        // this.app.scene.add( tableMesh );

        // let cylinder = new THREE.CylinderGeometry( 0.3, 0.3, 2.5, 32 );

        // for (let i = 0; i < 4; i++) {
        //     let cylinderMesh = new THREE.Mesh( cylinder, this.planeMaterial );
        //     cylinderMesh.position.set(i % 2 === 0 ? -2.5 : 2.5, 1, i < 2 ? -1.5 : 1.5);
        //     this.app.scene.add(cylinderMesh);
        //   }


        this.plateMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        let plate = new THREE.CylinderGeometry( 0.9, 0.6, 0.2, 32 );
        let plateMesh = new THREE.Mesh( plate, this.plateMaterial );
        plateMesh.position.x = 0;
        plateMesh.position.y = 2.3;
        plateMesh.position.z = 0;
        this.app.scene.add( plateMesh );

        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: "#964b00",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        const cake = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32, 1, false, 0, Math.PI * 2 * 0.90);
        let cakeMesh = new THREE.Mesh( cake, this.cakeMaterial );
        cakeMesh.position.x = 0;
        cakeMesh.position.y = 2.5;
        cakeMesh.position.z = 0;
        this.app.scene.add( cakeMesh );

        const candle = new THREE.CylinderGeometry(0.035, 0.035, 0.2, 32);
        let candleMesh = new THREE.Mesh( candle, this.plateMaterial );
        candleMesh.position.x = 0.2;
        candleMesh.position.y = 2.8;
        candleMesh.position.z = -0.2;
        this.app.scene.add( candleMesh );

        
        this.flameMaterial = new THREE.MeshPhongMaterial({ color: "#ff0000",
        specular: "#000000", emissive: "#000000", shininess: 90 })

        const flame = new THREE.ConeGeometry(0.035, 0.07, 32);
        let flameMesh = new THREE.Mesh( flame, this.flameMaterial );
        flameMesh.position.x = 0.2;
        flameMesh.position.y = 2.935;
        flameMesh.position.z = -0.2;
        this.app.scene.add( flameMesh );


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
import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

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

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

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

        this.planeMaterial = new THREE.MeshLambertMaterial({

               map : this.planeTexture });

        // end of alternative 2

        let plane = new THREE.PlaneGeometry(10, 10);
    }



    /**
     * builds the box mesh with material assigned
     */
    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            // color: "#ffff77",
            // specular: "#000000", emissive: "#000000", shininess: 90
            map : this.cubeTexture
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
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
        const pointLight = new THREE.PointLight(0xffffff, 500, 0);
        pointLight.position.set(0, 20, 0);
        this.app.scene.add(pointLight);

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()


        // Create a Plane Mesh with basic material

        this.planeTexture.wrapS = this.planeWrappingModeU
        this.planeTexture.wrapT = this.planeWrappingModeV;
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV );
        this.planeTexture.rotation = this.planeRotation
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU,this.planeOffsetV);

        var plane = new THREE.PlaneGeometry( this.planeSizeU, this.planeSizeV );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = 0;
        this.app.scene.add( this.planeMesh );
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
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV );
    }

    updateRepeatV(value) {
        this.planeRepeatV = value
        this.planeTexture.repeat.set(this.planeRepeatU, this.planeRepeatV );
    }

    updateOffsetU(value) {
        this.planeOffsetU = value
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU,this.planeOffsetV);
    }

    updateOffsetV(value) {
        this.planeOffsetV = value
        this.planeTexture.offset = new THREE.Vector2(this.planeOffsetU,this.planeOffsetV);
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
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z

    }

}

export { MyContents };
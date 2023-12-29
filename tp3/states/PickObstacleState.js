import { State } from './State.js';
import * as THREE from 'three';

class PickObstacleState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        
    }

    init() {
        console.log("PickObstacleState");
        document.addEventListener('click', this.clickHandler);
        this.pickableObjNames = ["obstacle1", "obstacle2"];
        this.obstacles = this.app.scene.getObjectByName("obstacles");
        document.addEventListener("pointermove",this.pointerMoveHandler);
        this.app.textContainer.innerHTML = "Pick your obstacle!"
        this.initCamera();
    }

    initCamera() {

        let obstaclesPosition = this.obstacles.position;
        
        const offset = new THREE.Vector3(30, 20, 0); // Offset the camera's position
        const cameraPosition = obstaclesPosition.clone().add(offset);
        
        // Set the camera's position and make it look at the car
        const activeCamera = this.app.getActiveCamera();
        activeCamera.position.copy(cameraPosition);
        this.app.controls.target = obstaclesPosition;
    }

    update() {
        this.app.controls.target = this.obstacles.position;
    }

    handleClick(event) {
        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        var intersects = this.app.raycaster.intersectObjects(this.obstacles.children);

        this.selectObstacle(intersects);
    }

    selectObstacle(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            let parent = obj;
    
            while (parent !== null && parent.type !== 'Scene') {
                const objName = parent.name;
    
                if (this.pickableObjNames.includes(objName)) {
                    let obstacle = this.obstacles.getObjectByName(objName)
                    let obstacleObject = obstacle.getObjectByName("obstacle");

                    let rotation = obstacle.rotation;
                    let scale = obstacle.scale;

                    this.obstacles.remove(obstacle);

                    obstacleObject.rotation.set(rotation.x, rotation.y, rotation.z);
                    obstacleObject.scale.set(scale.x, scale.y, scale.z);

                    this.app.game.addObstacle(obstacleObject);
                    this.app.game.pickedObstacle = obstacleObject;

                    this.removeEventListeners();
                    this.restoreColorOfFirstPickedObj();
                    this.app.cleanTextContainers();
                    this.app.currentState = this.app.moveObstacleState;
                    this.app.currentState.init();
                    return; // Exit the loop if a pickable object is found
                }
    
                parent = parent.parent; // Move up to the next parent
            }
    
            // If no pickable object is found in the hierarchy, restore color
            this.restoreColorOfFirstPickedObj();
        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    onPointerMove(event) {

        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        var intersects = this.app.raycaster.intersectObjects(this.obstacles.children);

        this.changeColor(intersects)
    }

    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material = this.app.pickedMaterial;
            this.lastPickedObj = obj;
            this.lastPickedObjMaterial = obj.material;
            this.lastPickedObj.material = this.app.pickedMaterial;
        }
    }

    /*
        * Restore the original color of the intersected object
        *
        */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material = this.lastPickedObjMaterial;
        this.lastPickedObj = null;
        this.lastPickedObjMaterial = null;
    }

    changeColor(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            let parent = obj;
    
            while (parent !== null && parent.type !== 'Scene') {
                const objName = parent.name;
    
                if (this.pickableObjNames.includes(objName)) {
                    let obstacle = this.obstacles.getObjectByName(objName).getObjectByName("obstacle").children[0].children[0];
                    this.restoreColorOfFirstPickedObj();
                    this.changeColorOfFirstPickedObj(obstacle);
                    return; // Exit the loop if a pickable object is found
                }
    
                parent = parent.parent; // Move up to the next parent
            }
    
            // If no pickable object is found in the hierarchy, restore color
            this.restoreColorOfFirstPickedObj();
        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    removeEventListeners() {
        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener("pointermove",this.pointerMoveHandler);
    }

  }

export { PickObstacleState };
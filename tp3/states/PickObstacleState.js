import { State } from './State.js';
import * as THREE from 'three';

class PickObstacleState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        
    }

    init() {
        document.addEventListener('click', this.clickHandler);
        this.pickableObjNames = ["obstacle1", "obstacle2", "obstacle5", "obstacle6", "obstacle7", "obstacle8"];
        this.obstacles = this.app.scene.getObjectByName("obstaclePark");
        document.addEventListener("pointermove",this.pointerMoveHandler);
        this.app.textContainer.style.display = "block";
        this.app.textContainer.innerHTML = "Pick your obstacle!"
    }

    updateCamera() {
        const camera = this.app.getActiveCamera();
        camera.position.copy(new THREE.Vector3(-60, 30, 10));
        this.app.controls.target = new THREE.Vector3(-90, 0, 10);
    }

    update() {
        this.updateCamera();
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
                    this.app.currentState = this.app.transitionState;
                    this.app.currentState.init(this.app.getActiveCamera().position, this.app.controls.target,
                        new THREE.Vector3(0, 150, 0), new THREE.Vector3(0, 0, 0), this.app.moveObstacleState);
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
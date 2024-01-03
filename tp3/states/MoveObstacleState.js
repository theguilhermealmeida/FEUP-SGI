import { State } from './State.js';
import * as THREE from 'three';

class MoveObstacleState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        this.objectPlaced = false;
        
    }

    init() {
        document.addEventListener('click', this.clickHandler);
        document.addEventListener("pointermove",this.pointerMoveHandler);
        this.obstacle = this.app.game.pickedObstacle;
        this.app.scene.add(this.obstacle);
        this.app.textContainer.style.display = "block";
        this.app.textContainer.innerHTML = "Place your obstacle!"
    }

    updateCamera() {
        const camera = this.app.getActiveCamera();
        camera.position.copy(new THREE.Vector3(0, 150, 0));
        this.app.controls.target = new THREE.Vector3(0, 0, 0);
    }

    update() {
        this.updateCamera();
    }

    handleClick(event) {
        if(this.objectPlaced) {
            this.removeEventListeners();
            this.app.cleanTextContainers();
            this.app.currentState = this.app.transitionState;

            let ownCar = this.app.game.ownCar;
        
            // Set the camera's position behind the car
            const distance = 20; // Adjust this value to change the distance of the camera from the car
            const offset = new THREE.Vector3(0, 10, -distance); // Offset the camera's position
            const carPosition = ownCar.car.position.clone();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(ownCar.orientation); // Assuming orientation is in radians
            
            offset.applyMatrix4(rotationMatrix); // Apply the car's orientation to the offset
            const cameraPosition = carPosition.clone().add(offset);
            this.app.currentState.init(new THREE.Vector3(0, 150, 0), new THREE.Vector3(0, 0, 0),
            cameraPosition, carPosition, this.app.gameState,true);
        }
    }

    onPointerMove(event) {

        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        var intersects = this.app.raycaster.intersectObjects(this.app.scene.children);

        this.placeObstacle(intersects);
    }

    placeObstacle(intersects) {
        for (let intersect of intersects) {
            if(intersect.object.parent.parent.name !== "trackNode") continue;
            else {
                this.obstacle.position.copy(intersect.point);
                this.objectPlaced = true;
                break;
            }
        }
    }

    removeEventListeners() {
        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener("pointermove",this.pointerMoveHandler);
    }

  }

export { MoveObstacleState };
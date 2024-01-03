import { State } from './State.js';
import * as THREE from 'three';

class GameState extends State {
    constructor(app) {
        super(app);
        this.keyPressHandler = this.handleKeyPress.bind(this);
        this.keyReleaseHandler = this.handleKeyRelease.bind(this);
    }

    init() {
        document.addEventListener('keydown', this.keyPressHandler);
        document.addEventListener('keyup', this.keyReleaseHandler);
        this.keys = { W: false, A: false, S: false, D: false };
        this.app.game.init();
    }

    reload() {
        document.addEventListener('keydown', this.keyPressHandler);
        document.addEventListener('keyup', this.keyReleaseHandler);
        this.keys = { W: false, A: false, S: false, D: false };
        this.app.game.resume();
    }
  
    update() {
        this.handleKeys();
        this.app.game.update();
        this.updateCamera();
        this.checkIfGameEnded();
    }

    updateCamera() {

        if (this.app.currentState !== this.app.gameState) return;

        let ownCar = this.app.game.ownCar;
        
        // Set the camera's position behind the car
        const distance = 20; // Adjust this value to change the distance of the camera from the car
        const offset = new THREE.Vector3(0, 10, -distance); // Offset the camera's position
        const carPosition = ownCar.car.position.clone();
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(ownCar.orientation); // Assuming orientation is in radians
        
        offset.applyMatrix4(rotationMatrix); // Apply the car's orientation to the offset
        const cameraPosition = carPosition.clone().add(offset);
        
        // Set the camera's position and make it look at the car
        const activeCamera = this.app.getActiveCamera();
        activeCamera.position.copy(cameraPosition);
        this.app.controls.target = carPosition;
    }
    

    checkIfGameEnded() {
        if(this.app.game.winner !== null) {
            this.app.cleanTextContainers();
            this.app.currentState = this.app.transitionState;
            this.app.currentState.init(this.app.getActiveCamera().position, this.app.controls.target,
                new THREE.Vector3(45, 20, -200), new THREE.Vector3(0, 0, -200), this.app.endGameState);
        }
    }

    handleKeyPress(event) {
        if (event.code === 'Space') {
            this.removeEventListeners();
            this.app.currentState = this.app.pauseState;
            this.app.currentState.init();
        }
        if (event.code === 'KeyW') {
            this.keys.W = true;
        }
        if (event.code === 'KeyA') {
            this.keys.A = true;
        }
        if (event.code === 'KeyS') {
            this.keys.S = true;
        }
        if (event.code === 'KeyD') {
            this.keys.D = true;
        }
    }

    handleKeyRelease(event) {
        // Handle key releases and set corresponding keys state to false
        if (event.code === 'KeyW') {
            this.keys.W = false;
        }
        if (event.code === 'KeyA') {
            this.keys.A = false;
        }
        if (event.code === 'KeyS') {
            this.keys.S = false;
        }
        if (event.code === 'KeyD') {
            this.keys.D = false;
        }
    }

    handleKeys() {
        // Handle key presses and set corresponding keys state to true
        if (this.keys.W) {
            this.app.game.ownCar.accelerate();
        }
        if (this.keys.A) {
            this.app.game.ownCar.turnLeft();
        }
        if (this.keys.S) {
            this.app.game.ownCar.deaccelerate();
        }
        if (this.keys.D) {
            this.app.game.ownCar.turnRight();
        }
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyPressHandler);
        document.removeEventListener('keyup', this.keyReleaseHandler);
    }
  }

export { GameState };
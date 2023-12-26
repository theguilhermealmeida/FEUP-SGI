import { State } from './State.js';
import * as THREE from 'three';

class GameState extends State {
    constructor(app) {
        super(app);
    }

    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.app.setActiveCamera("game");
    }
  
    update() {
        console.log("Game State");
        this.app.oppCar.update();
        this.app.controls.target = new THREE.Vector3(0, 0, 0);
    }

    handleKeyPress(event) {
        // if Esc key is pressed, go back to MenuState
        if (event.code === 'Escape') {
            this.app.currentState = this.app.menuState;
            this.app.currentState.init();
            document.removeEventListener('keydown', this.handleKeyPress.bind(this)); // Remove the listener after changing state
        }
        //if space key is pressed, stop the mixer of the car
        if (event.code === 'Space') {
            this.app.oppCar.pauseCar();
        }
        //if enter key is pressed, play the mixer of the car
        if (event.code === 'Enter') {
            this.app.oppCar.resumeCar();
        }
    }
  }

export { GameState };
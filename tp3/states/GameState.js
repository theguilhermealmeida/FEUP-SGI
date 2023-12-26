import { State } from './State.js';
import * as THREE from 'three';

class GameState extends State {
    constructor(app) {
        super(app);
        this.keyPressHandler = this.handleKeyPress.bind(this);
    }

    init() {
        document.addEventListener('keydown', this.keyPressHandler);
        this.app.setActiveCamera("game");
        this.app.game.init();
    }

    reload() {
        document.addEventListener('keydown', this.keyPressHandler);
        this.app.setActiveCamera("game");
        this.app.game.resume();
    }
  
    update() {
        this.app.game.update();
        this.checkIfGameEnded();
        this.app.controls.target = new THREE.Vector3(0, 0, 0);
    }

    checkIfGameEnded() {
        if(this.app.game.winner !== null) {
            console.log(this.app.game.winner + " won!");
            this.app.cleanTextContainers();
            this.app.currentState = this.app.menuState;
            this.app.currentState.init();
        }
    }

    handleKeyPress(event) {
        if (event.code === 'Escape') {
            this.removeEventListeners();
            this.app.currentState = this.app.menuState;
            this.app.currentState.init();
        }
        if (event.code === 'Space') {
            this.removeEventListeners();
            this.app.currentState = this.app.pauseState;
            this.app.currentState.init();
        }
        if (event.code === 'KeyP') {
            this.removeEventListeners();
            this.app.currentState = this.app.pickObstacleState;
            this.app.currentState.init();
        }

    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyPressHandler);
    }
  }

export { GameState };
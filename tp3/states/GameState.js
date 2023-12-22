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
    }

    handleKeyPress(event) {
        // if Esc key is pressed, go back to MenuState
        if (event.code === 'Escape') {
            this.app.currentState = this.app.menuState;
            this.app.currentState.init();
            document.removeEventListener('keydown', this.handleKeyPress.bind(this)); // Remove the listener after changing state
        }
    }
  }

export { GameState };
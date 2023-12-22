import { State } from './State.js';
import * as THREE from 'three';

class MenuState extends State {
    constructor(app) {
        super(app);
        
    }

    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.app.setActiveCamera("menu");
    }

    update() {
    }

    handleKeyPress(event) {
        if (event.code === 'Space') {
            this.app.currentState = this.app.gameState;
            this.app.currentState.init();
            document.removeEventListener('keydown', this.handleKeyPress.bind(this)); // Remove the listener after changing state
        }
    }
  }

export { MenuState };
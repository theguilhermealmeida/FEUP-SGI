import { State } from './State.js';

class PauseState extends State{
    constructor(app) {
        super(app);
        this.keyPressHandler = this.handleKeyPress.bind(this);
    }

    init() {
        document.addEventListener('keydown', this.keyPressHandler);
        this.app.game.pause();
        this.app.pauseContainer.innerHTML = "Paused!\nPress Space to continue";
    }

    handleKeyPress(event) {
        this.removeEventListeners();
        this.app.cleanTextContainers();
        //if space key is pressed, go back to GameState
        if (event.code === 'Space') {
            this.app.currentState = this.app.gameState;
            this.app.currentState.reload();
        }
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyPressHandler);
    }
}

export { PauseState };

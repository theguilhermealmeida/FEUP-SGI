import { State } from './State.js';

class PauseState extends State{
    constructor(app) {
        super(app);
        this.keyPressHandler = this.handleKeyPress.bind(this);
    }

    init() {
        document.addEventListener('keydown', this.keyPressHandler);
        this.app.game.pause();
        this.app.pauseContainer.style.display = 'block';
    }

    handleKeyPress(event) {
        //if space key is pressed, go back to GameState
        if (event.code === 'Space') {
            this.removeEventListeners();
            this.app.cleanTextContainers();
            this.app.currentState = this.app.gameState;
            this.app.currentState.reload();
        }
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyPressHandler);
    }
}

export { PauseState };

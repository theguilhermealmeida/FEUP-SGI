import { State } from './State.js';

class TransitionState extends State{
    constructor(app) {
        super(app);
        this.startingPosition = null;
        this.startingTarget = null;
        this.finalPosition = null;
        this.finalTarget = null;
        this.nextState = null;
        this.reload = false;
    }

    init(startingPosition, startingTarget, finalPosition, finalTarget, nextState,reload = false) {
        this.startingPosition = startingPosition;
        this.startingTarget = startingTarget;
        this.finalPosition = finalPosition;
        this.finalTarget = finalTarget;
        this.nextState = nextState;
        this.camera = this.app.getActiveCamera();
        this.controls = this.app.controls;
        this.controls.target = this.startingTarget;
        this.reload = reload;
    }

    update() {
        let position = this.camera.position;
        let target = this.controls.target;
    
        let positionDiff = this.finalPosition.clone().sub(position);
        let targetDiff = this.finalTarget.clone().sub(target);
    
        // Calculate the distance remaining
        let remainingDistancePosition = positionDiff.length();
        let remainingDistanceTarget = targetDiff.length();
    
        // Calculate step sizes based on remaining distance
        let positionStep = positionDiff.normalize().multiplyScalar(Math.min(remainingDistancePosition, 4));
        let targetStep = targetDiff.normalize().multiplyScalar(Math.min(remainingDistanceTarget, 4));
    
        position.add(positionStep);
        target.add(targetStep);
    
        if (remainingDistancePosition < 0.1 && remainingDistanceTarget < 0.1) {
            this.app.currentState = this.nextState;
            if(this.reload) {
                this.app.currentState.reload();
            }
            else{
                this.app.currentState.init();
            }
        }
    }
    
    

}

export { TransitionState };

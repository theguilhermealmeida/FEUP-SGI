import { State } from './State.js';
import * as THREE from 'three';

class GameState extends State {
    constructor(app) {
        super(app);

    }

    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.app.setActiveCamera("game");
        this.setupOppCar();
    }
  
    update() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
        this.app.controls.target = this.oppCar.position;
    }

    handleKeyPress(event) {
        // if Esc key is pressed, go back to MenuState
        if (event.code === 'Escape') {
            this.app.currentState = this.app.menuState;
            this.app.currentState.init();
            document.removeEventListener('keydown', this.handleKeyPress.bind(this)); // Remove the listener after changing state
        }
    }

    setupOppCar() {
        this.oppCar = this.app.scene.getObjectByName("redCar");

        this.oppCarRoute = this.oppCar.getObjectByName("route");

        const oppCarRouteControlPoints = this.oppCarRoute.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));

        //get the rotation at each control point
        const oppCarRouteQuarterions = this.oppCarRoute.data.representations[0].controlpoints.map(point => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(point.ry)));

        this.clock = new THREE.Clock();

        //add the first point to the end to close the loop
        oppCarRouteControlPoints.push(oppCarRouteControlPoints[0]);

        //add the first point to the end to close the loop
        oppCarRouteQuarterions.push(oppCarRouteQuarterions[0]);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            [...Array(oppCarRouteControlPoints.length).keys()],
            [].concat(...oppCarRouteControlPoints.map(point => [...point.toArray()])),
            THREE.InterpolateSmooth
        );

        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            [...Array(oppCarRouteQuarterions.length).keys()],
            [].concat(...oppCarRouteQuarterions.map(point => [...point.toArray()]))
        );

        const positionClip = new THREE.AnimationClip('OpponentCar', -1, [positionKF]);
        const rotationClip = new THREE.AnimationClip('OpponentCar', -1, [quaternionKF]);

        this.mixer = new THREE.AnimationMixer(this.oppCar);

        this.positionAction = this.mixer.clipAction(positionClip);
        this.rotationAction = this.mixer.clipAction(rotationClip);

        //change the speed of the animation
        this.positionAction.timeScale = 0.5;
        this.rotationAction.timeScale = 0.5;


        this.positionAction.play();
        this.rotationAction.play();
    }
  }

export { GameState };
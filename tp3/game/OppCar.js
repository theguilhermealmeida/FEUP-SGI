import * as THREE from 'three';

class OppCar {
    constructor(app, car, route) {
        this.app = app;
        this.car = car;
        this.route = route.children[0];

        this.clock = new THREE.Clock();

        this.mixer = new THREE.AnimationMixer(this.car);

        this.laps = 0;
        this.crossedFinishLine = false;

        this.init();
    }

    init() {
        
        this.routeControlPoints = this.route.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        this.routeQuarterions = this.route.data.representations[0].controlpoints.map(point => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(point.ry)));

        //add the first point to the end to close the loop
        this.routeControlPoints.push(this.routeControlPoints[0]);
        this.routeQuarterions.push(this.routeQuarterions[0]);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            [...Array(this.routeControlPoints.length).keys()],
            [].concat(...this.routeControlPoints.map(point => [...point.toArray()])),
            THREE.InterpolateSmooth
        );
    
        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            [...Array(this.routeQuarterions.length).keys()],
            [].concat(...this.routeQuarterions.map(point => [...point.toArray()]))
        );
    
        const positionClip = new THREE.AnimationClip('OpponentCar', -1, [positionKF]);
        const rotationClip = new THREE.AnimationClip('OpponentCar', -1, [quaternionKF]);

        this.positionAction = this.mixer.clipAction(positionClip);
        this.rotationAction = this.mixer.clipAction(rotationClip);

        this.positionAction.timeScale = 5;
        this.rotationAction.timeScale = 5;

        this.positionAction.play();
        //this.rotationAction.play();
    }

    pauseCar() {
        this.positionAction.paused = true;
        this.clock.stop();
    }

    resumeCar() {
        // Resume the position and rotation actions
        this.positionAction.paused = false;
        this.clock.start();
    }

    update() { 
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
        this.checkLap();
    }

    checkLap() {
        const carPosition = this.car.position;
        const finishLine = new THREE.Vector3(10, 0, 85);
        const distanceToFinish = carPosition.distanceTo(finishLine);

        if (distanceToFinish < 5 && !this.crossedFinishLine) {
            this.laps++;
            this.crossedFinishLine = true; // Set the flag to true when the car crosses the finish line
            console.log(`Lap completed. Total laps: ${this.laps}`);
        } else if (distanceToFinish > 5) {
            // Reset the crossedFinishLine flag if the car moves away from the finish line
            this.crossedFinishLine = false;
        }
    }
}

export { OppCar };

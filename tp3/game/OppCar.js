import * as THREE from 'three';

class OppCar {
    constructor(app, car, route) {
        this.app = app;
        this.car = car;
        this.route = route.children[0];

        this.clock = new THREE.Clock();

        this.mixer = new THREE.AnimationMixer(this.car);

        this.init();
    }

    init() {
        
        const routeControlPoints = this.route.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        const routeQuarterions = this.route.data.representations[0].controlpoints.map(point => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(point.ry)));

        //add the first point to the end to close the loop
        routeControlPoints.push(routeControlPoints[0]);
        routeQuarterions.push(routeQuarterions[0]);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            [...Array(routeControlPoints.length).keys()],
            [].concat(...routeControlPoints.map(point => [...point.toArray()])),
            THREE.InterpolateSmooth
        );
    
        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            [...Array(routeQuarterions.length).keys()],
            [].concat(...routeQuarterions.map(point => [...point.toArray()]))
        );
    
        const positionClip = new THREE.AnimationClip('OpponentCar', -1, [positionKF]);
        const rotationClip = new THREE.AnimationClip('OpponentCar', -1, [quaternionKF]);

        this.positionAction = this.mixer.clipAction(positionClip);
        this.rotationAction = this.mixer.clipAction(rotationClip);

        this.positionAction.timeScale = 1;
        this.rotationAction.timeScale = 1;

        this.positionAction.play();
        this.rotationAction.play();
    }

    pauseCar() {
        this.positionAction.paused = true;
        this.rotationAction.paused = true;
    }

    resumeCar() {
        this.positionAction.paused = false;
        this.rotationAction.paused = false;
    }

    update() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }
}

export { OppCar };

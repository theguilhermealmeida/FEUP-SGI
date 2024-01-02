import * as THREE from 'three';

class OppCar {
    constructor(app, car, route) {
        this.app = app;
        this.car = car;
        this.route = route;

        this.clock = new THREE.Clock();

        this.mixer = new THREE.AnimationMixer(this.car);

        this.laps = 0;
        this.crossedFinishLine = false;

        this.boundingSpheres = [];
    }

    init() {
        this.app.scene.getObjectByName("oppCarPlatform").remove(this.car);
        this.app.scene.add(this.car);
        this.computeBoundingSpheres(this.car.getObjectByName("carComplex"));
        this.startMoving();
    }

    startMoving() {
        
        this.routeControlPoints = this.route.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        this.routeQuarterions = this.route.data.representations[0].controlpoints.map(point => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(point.ry)));

        //add the first point to the end to close the loop
        this.routeControlPoints.push(this.routeControlPoints[0]);
        this.routeQuarterions.push(this.routeQuarterions[0]);

        //add box to the route control points
        this.routeControlPoints.forEach(point => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.copy(point);
            this.app.scene.add(cube);
        }
        );

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
    
        const clip = new THREE.AnimationClip('OppCar', -1, [positionKF, quaternionKF]);

        this.positionAction = this.mixer.clipAction(clip);

        if(this.app.game.difficulty === "easY") {
            this.positionAction.timeScale = 1;
        }
        else if(this.app.game.difficulty === "medium") {
            this.positionAction.timeScale = 1.5;
        }
        else if(this.app.game.difficulty === "hard") {
            this.positionAction.timeScale = 2;
        }

        this.positionAction.play();

        this.pauseCar();
    }

    computeBoundingSpheres(node) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            
            if (child instanceof THREE.Mesh && child.geometry !== undefined && child.geometry.boundingSphere) {
                const sphere = new THREE.SphereGeometry(child.geometry.boundingSphere.radius, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false});
                const sphereMesh = new THREE.Mesh(sphere, material);
                sphereMesh.name = "BoundingSphere";
                child.parent.add(sphereMesh);

                // get the bounding sphere's center position in world space
                const center = new THREE.Vector3();
                sphereMesh.getWorldPosition(center);
                this.boundingSpheres.push(new THREE.Sphere(center, child.geometry.boundingSphere.radius));
            }
    
            if (child.children.length > 0) {
                this.computeBoundingSpheres(child); // Recursively call the function for each child
            }
        }
    }

    updateBoundingSpheres(node) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            
            if (child instanceof THREE.Mesh && child.name === "BoundingSphere") {
                // get the bounding sphere's center position in world space
                const center = new THREE.Vector3();
                child.getWorldPosition(center);
                this.boundingSpheres.push(new THREE.Sphere(center, child.geometry.parameters.radius));
            }
    
            if (child.children.length > 0) {
                this.updateBoundingSpheres(child); // Recursively call the function for each child
            }
        }
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
        this.boundingSpheres = [];
        this.updateBoundingSpheres(this.car.getObjectByName("carComplex"));
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

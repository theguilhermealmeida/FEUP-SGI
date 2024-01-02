import * as THREE from 'three';

class OwnCar {
    constructor(app, car) {
        this.app = app;
        this.car = car;
        this.laps = 0;
        this.velocity = 0;
        this.steeringAngle = 0;
        this.maxSteeringAngle = 0.35;
        this.turnSpeed = 0.05;
        this.steeringSpeed = this.turnSpeed * 1.5;
        this.acceleration = 0.015;
        this.maxVelocity = 1;
        this.orientation = - Math.PI/2;
        this.frontWheels = this.car.getObjectByName("frontWheels");
        this.rearWheels = this.car.getObjectByName("rearWheels");
        this.effect = null;
        this.endOfEffect = -10000;
        this.offTrack = false;
        this.boundingSpheres = [];
        this.crossedFinishLine = false;
        this.invertedControls = false;
        this.invencible = false;
    }

    init() {
        this.app.scene.getObjectByName("ownCarPlatform").remove(this.car);
        this.car.position.set(22, 0, 89);
        this.car.rotation.y = Math.PI;
        this.app.scene.add(this.car);
        this.computeBoundingSpheres(this.car.getObjectByName("carComplex"));
    }

    computeBoundingSpheres(node) {
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            
            if (child instanceof THREE.Mesh && child.geometry !== undefined && child.geometry.boundingSphere) {
                const sphere = new THREE.SphereGeometry(child.geometry.boundingSphere.radius, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true,visible: false });
                const sphereMesh = new THREE.Mesh(sphere, material);
                sphereMesh.name = "BoundingSphere";
                // get the bounding sphere's center position in world space
                const center = new THREE.Vector3();
                child.getWorldPosition(center);
                this.boundingSpheres.push(new THREE.Sphere(center, child.geometry.boundingSphere.radius));
                child.parent.add(sphereMesh);
            }
    
            if (child.children.length > 0) {
                this.computeBoundingSpheres(child); // Recursively call the function for each child
            }
        }
    }



    accelerate() {
        if(this.invertedControls) {
            this.velocity -= this.acceleration;
        }
        else {
            this.velocity += this.acceleration;
        }
        this.velocity = Math.min(this.velocity, this.maxVelocity);
        this.velocity = Math.max(this.velocity, -this.maxVelocity);
    }

    deaccelerate() {
        if(this.invertedControls) {
            this.velocity += this.acceleration;
        }
        else {
            this.velocity -= this.acceleration;
        }
        this.velocity = Math.min(this.velocity, this.maxVelocity);
        this.velocity = Math.max(this.velocity, -this.maxVelocity);
    }

    turnLeft() {
        if(this.invertedControls){
            if(this.velocity !== 0){
                this.orientation -= this.turnSpeed;
            }
            this.steeringAngle = Math.max(this.steeringAngle - this.steeringSpeed, -this.maxSteeringAngle);
        }
        else {
            if(this.velocity !== 0){
                this.orientation += this.turnSpeed;
            }
            this.steeringAngle = Math.min(this.steeringAngle + this.steeringSpeed, this.maxSteeringAngle);
        }

    }

    turnRight() {
        if(this.invertedControls){
            if(this.velocity !== 0){
                this.orientation += this.turnSpeed;
            }
            this.steeringAngle = Math.min(this.steeringAngle + this.steeringSpeed, this.maxSteeringAngle);
        }
        else {
            if(this.velocity !== 0){
                this.orientation -= this.turnSpeed;
            }
            this.steeringAngle = Math.max(this.steeringAngle - this.steeringSpeed, -this.maxSteeringAngle);
        }
    }


    applyEffect(effect) {
        this.removeCurrentEffect();
        switch(effect.type) {
            case "speed":
                this.effect = effect;
                this.maxVelocity = this.maxVelocity * effect.value;
                this.endOfEffect = this.app.game.elapsedTime + effect.duration;
                this.app.effectContainer.innerHTML = "Effect: " + effect.value * 100 + "% " + effect.type + " for " + effect.duration + "s";
                this.app.effectTimeContainer.innerHTML = "Effect time left: " + effect.duration + "s";
                break;
            case "invert":
                this.effect = effect;
                this.endOfEffect = this.app.game.elapsedTime + effect.duration;
                this.invertedControls = true;
                this.app.effectContainer.innerHTML = "Effect: " + effect.type + " for " + effect.duration + "s";
                this.app.effectTimeContainer.innerHTML = "Effect time left: " + effect.duration + "s";
                break;
            case "invencible":
                this.effect = effect;
                this.endOfEffect = this.app.game.elapsedTime + effect.duration;
                this.invencible = true;
                this.app.effectContainer.innerHTML = "Effect: " + effect.type + " for " + effect.duration + "s";
                this.app.effectTimeContainer.innerHTML = "Effect time left: " + effect.duration + "s";
                break;
        }
    }

    removeCurrentEffect() {
        if(this.effect === null) return;

        this.app.effectContainer.innerHTML = "";
        this.app.effectTimeContainer.innerHTML = "";

        switch(this.effect.type) {
            case "speed":
                this.maxVelocity = this.maxVelocity / this.effect.value;
                break;
            case "invert":
                this.invertedControls = false;
                break;
            case "invencible":
                this.invencible = false;
                break;
        }
    }

    updateEffect() {
        if(this.effect === null) return;

        switch(this.effect.type) {
            case "speed":
                if(this.app.game.elapsedTime > this.endOfEffect) {
                    this.maxVelocity = this.maxVelocity / this.effect.value;
                    this.app.effectContainer.innerHTML = "";
                    this.app.effectTimeContainer.innerHTML = "";
                    this.effect = null;
                } else {
                    this.app.effectContainer.innerHTML = "Effect: " + this.effect.value * 100 + "% " + this.effect.type + " for " + this.effect.duration + "s";
                    this.app.effectTimeContainer.innerHTML = "Effect time left: " + Math.round(this.endOfEffect - this.app.game.elapsedTime) + "s";
                }
                break;
            case "invert":
                if(this.app.game.elapsedTime > this.endOfEffect) {
                    this.invertedControls = false;
                    this.app.effectContainer.innerHTML = "";
                    this.app.effectTimeContainer.innerHTML = "";
                    this.effect = null;
                } else {
                    this.app.effectContainer.innerHTML = "Effect: " + this.effect.type + " for " + this.effect.duration + "s";
                    this.app.effectTimeContainer.innerHTML = "Effect time left: " + Math.round(this.endOfEffect - this.app.game.elapsedTime) + "s";
                }
                break;
            case "invencible":
                if(this.app.game.elapsedTime > this.endOfEffect) {
                    this.invencible = false;
                    this.app.effectContainer.innerHTML = "";
                    this.app.effectTimeContainer.innerHTML = "";
                    this.effect = null;
                } else {
                    this.app.effectContainer.innerHTML = "Effect: " + this.effect.type + " for " + this.effect.duration + "s";
                    this.app.effectTimeContainer.innerHTML = "Effect time left: " + Math.round(this.endOfEffect - this.app.game.elapsedTime) + "s";
                }
                break;
        }
    }

    outOfTrack() {
        if(this.offTrack) return;

        this.offTrack = true;
        this.maxVelocity = this.maxVelocity * 0.5;
        this.app.outOfTrackContainer.innerHTML = "Out of track!";
    }

    inTrack() {
        if(!this.offTrack) return;

        this.offTrack = false;
        this.maxVelocity = this.maxVelocity * 2;
        this.app.outOfTrackContainer.innerHTML = "";
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

    checkLap() {
        const carPosition = this.car.position;
        const finishLine = new THREE.Vector3(10, 0, 85);
        const distanceToFinish = carPosition.distanceTo(finishLine);

        if (distanceToFinish < 5 && !this.crossedFinishLine) {
            this.laps++;
            this.crossedFinishLine = true;
        } else if (distanceToFinish > 5) {
            this.crossedFinishLine = false;
        }
    }


    update() {

        this.checkLap();

        this.boundingSpheres = [];

        this.updateBoundingSpheres(this.car.getObjectByName("carComplex"));

        this.updateEffect();

        // Update velocity
        this.velocity -= Math.sign(this.velocity) * 0.005;

        if (this.velocity > -0.001 && this.velocity < 0.001) {
            this.velocity = 0;
        }
    
        // Update steering angle
        this.steeringAngle -= Math.sign(this.steeringAngle) * 0.04;

        if (this.steeringAngle > -0.03 && this.steeringAngle < 0.03) {
            this.steeringAngle = 0;
        }


    
        // Update front wheels rotation
        this.frontWheels.rotation.y = this.steeringAngle;

        // Update rear wheels rotation
        this.rearWheels.rotation.y = this.steeringAngle * 0.5;
    
        // Update car's position and rotation
        this.car.position.x += this.velocity * Math.sin(this.orientation);
        this.car.position.z += this.velocity * Math.cos(this.orientation);

        this.car.rotation.y = this.orientation - Math.PI/2;

    }
}

export { OwnCar };

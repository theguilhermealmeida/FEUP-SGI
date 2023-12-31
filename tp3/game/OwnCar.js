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

    }

    accelerate() {
        this.velocity += this.acceleration;
        this.velocity = Math.min(this.velocity, this.maxVelocity);
        this.velocity = Math.max(this.velocity, -this.maxVelocity);
    }

    deaccelerate() {
        this.velocity -= this.acceleration;
        this.velocity = Math.min(this.velocity, this.maxVelocity);
        this.velocity = Math.max(this.velocity, -this.maxVelocity);
    }

    turnRight() {
        if(this.velocity !== 0){
            this.orientation -= this.turnSpeed;
        }
        this.steeringAngle = Math.max(this.steeringAngle - this.steeringSpeed, -this.maxSteeringAngle);
    }

    turnLeft() {
        if(this.velocity !== 0){
            this.orientation += this.turnSpeed;
        }
        this.steeringAngle = Math.min(this.steeringAngle + this.steeringSpeed, this.maxSteeringAngle);
    }

    applyEffect(effect) {
        switch(effect.type) {
            case "speed":
                if(this.effect !== null){
                    this.maxVelocity = this.maxVelocity / this.effect.value;
                    this.app.effectContainer.innerHTML = "";
                    this.app.effectTimeContainer.innerHTML = "";
                }
                this.effect = effect;
                this.maxVelocity = this.maxVelocity * effect.value;
                this.endOfEffect = this.app.game.elapsedTime + effect.duration;
                this.app.effectContainer.innerHTML = "Effect: " + effect.value * 100 + "% " + effect.type + " for " + effect.duration + "s";
                this.app.effectTimeContainer.innerHTML = "Effect time left: " + effect.duration + "s";
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

    update() {

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

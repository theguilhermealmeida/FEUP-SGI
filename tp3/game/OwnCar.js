import * as THREE from 'three';

class OwnCar {
    constructor(app, car) {
        this.app = app;
        this.car = car;
        this.laps = 0;
        this.velocity = 0;
        this.steeringAngle = 0;
        this.maxSteeringAngle = 0.4;
        this.turnSpeed = 0.05;
        this.acceleration = 0.025;
        this.maxVelocity = 1.5;
        this.orientation = - Math.PI/2;
        this.frontWheels = this.car.getObjectByName("frontWheels");
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
        this.orientation -= this.turnSpeed;

    }

    turnLeft() {
        this.orientation += this.turnSpeed;
    }

    update() {
        // Update velocity
        this.velocity -= Math.sign(this.velocity) * 0.01;
    
        // Update steering angle
        //this.steeringAngle -= Math.sign(this.steeringAngle) * 0.02;
    
        // Update front wheels rotation
        //this.frontWheels.rotation.y = this.steeringAngle;
    
        // Update car's position and rotation
        this.car.position.x += this.velocity * Math.sin(this.orientation);
        this.car.position.z += this.velocity * Math.cos(this.orientation);

        this.car.rotation.y = this.orientation - Math.PI/2;

    }
}

export { OwnCar };

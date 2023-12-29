import * as THREE from 'three';

class OwnCar {
    constructor(app, car) {
        this.app = app;
        this.car = car;
        this.laps = 0;
        this.velocity = 0;
        this.steeringAngle = 0;
        this.maxSteeringAngle = 0.35;
        this.turnSpeed = 0.03;
        this.steeringSpeed = this.turnSpeed * 2;
        this.acceleration = 0.015;
        this.maxVelocity = 1;
        this.orientation = - Math.PI/2;
        this.frontWheels = this.car.getObjectByName("frontWheels");
        this.rearWheels = this.car.getObjectByName("rearWheels");
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

    update() {
        // Update velocity
        this.velocity -= Math.sign(this.velocity) * 0.005;

        if (this.velocity > -0.001 && this.velocity < 0.001) {
            this.velocity = 0;
        }
    
        // Update steering angle
        this.steeringAngle -= Math.sign(this.steeringAngle) * 0.03;

        if (this.steeringAngle > -0.01 && this.steeringAngle < 0.01) {
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

import * as THREE from 'three';

class Game {
    constructor(app) {
        this.app = app;
        this.ownCar = null;
        this.ownCarName = null;
        this.oppCar = null;
        this.elapsedTime = 0;
        this.laps = 0;
        this.targetLaps = 3;
        this.winner = null;
        this.activePowerups = [];
        this.activeObstacles = [];
        this.pickedObstacle = null;
        this.clock = new THREE.Clock();
    }

    init() {
        this.app.lapContainer.innerHTML = "Lap: " + this.laps + "/" + this.targetLaps;
        this.app.timeContainer.innerHTML = "Time: " + this.time;
        this.app.speedContainer.innerHTML = "Speed: " + this.ownCar.velocity + "km/h";
        this.initPowerups();
        this.clock.start();
    }

    initPowerups() {
        let powerups = this.app.scene.getObjectByName("powerUps");
        for (let powerup of powerups.children) {
            this.addPowerup(powerup);
        }
    }


    update() {
        this.updateTime();
        this.ownCar.update();
        //this.oppCar.update();
        this.updateLaps();
        this.updateSpeed();
        this.checkPowerups();
        //this.checkObstacles();
        this.checkWinner();
    }

    updateTime() {
        this.elapsedTime = this.clock.getElapsedTime();
        this.app.timeContainer.innerHTML = "Time: " + this.elapsedTime.toFixed(3);
    }


    updateLaps() {
        this.laps = Math.max(this.ownCar.laps, this.oppCar.laps);
        this.app.lapContainer.innerHTML = "Lap: " + this.laps + "/" + this.targetLaps;
    }

    updateSpeed() {
        //multiply by 120 to simulate max speed of 120km/h and then round to integer
        let velocity = this.ownCar.velocity * 120;
        this.app.speedContainer.innerHTML = "Speed: " + Math.round(velocity) + "km/h";
    }

    checkWinner() {
        if (this.laps === this.targetLaps + 1) {
            if (this.ownCar.laps > this.oppCar.laps) {
                this.winner = "You";
            }
            else {
                this.winner = "Opponent";
            }
        }
    }

    pause() {
        console.log("Game paused");
        this.clock.stop();
        this.oppCar.pauseCar();
    }

    resume() {
        console.log("Game resumed");
        this.clock.start();
        this.clock.elapsedTime = this.elapsedTime;
        this.oppCar.resumeCar();
    }

    addPowerup(powerup) {
        this.activePowerups.push(powerup);
    }

    addObstacle(obstacle) {
        this.activeObstacles.push(obstacle);
    }

    checkPowerups() {
        for (let powerup of this.activePowerups) {
            if (this.ownCar.car.position.distanceTo(powerup.position) < 4) {
                console.log("Powerup" + powerup.name + " picked");
                let effect = this.getEffect(powerup);
                console.log(effect);
            }
        }
    }

    getEffect(powerup) {
        // loop until children[0] has data not undefined
        let data = powerup.data;
        while (data === undefined) {
            powerup = powerup.children[0];
            data = powerup.data;
        }
        return data;
    }
}

export { Game };

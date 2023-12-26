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
        this.clock = new THREE.Clock();
    }

    init() {
        this.app.lapContainer.innerHTML = "Lap: " + this.laps + "/" + this.targetLaps;
        this.app.timeContainer.innerHTML = "Time: " + this.time;
        this.clock.start();
    }


    update() {
        this.updateTime();
        //this.ownCar.update();
        this.oppCar.update();
        this.updateLaps();
        //this.checkPowerups();
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
}

export { Game };

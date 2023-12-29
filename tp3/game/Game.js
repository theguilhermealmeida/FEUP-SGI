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
        this.track = this.app.scene.getObjectByName("track");
        const trackControlPoints = this.track.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        const trackSpline = new THREE.CatmullRomCurve3(trackControlPoints);
        this.trackPoints = trackSpline.getPoints(100);
    }

    initPowerups() {
        let powerups = this.app.scene.getObjectByName("powerUps");
        for (let powerup of powerups.children) {
            this.addPowerup(powerup);
            powerup.lastTimePicked = -100;
        }
    }


    update() {
        this.updateTime();
        this.ownCar.update();
        //this.oppCar.update();
        this.updateLaps();
        this.updateSpeed();
        this.checkWinner();
        this.checkColisions();
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

    checkColisions() {
        this.checkOutOfTrack();
        //this.checkObstacles();
        this.checkPowerups();
    }

    checkOutOfTrack() {
        const carPosition = this.ownCar.car.position;
        const distanceThreshold = 10; // Adjust this threshold as needed
    
        for (let i = 0; i < this.trackPoints.length; i++) {
            const trackPoint = this.trackPoints[i];
            const distanceToTrackPoint = carPosition.distanceTo(trackPoint);
            
            if (distanceToTrackPoint < distanceThreshold) {
                // Car is close to a track point, considered on the track
                console.log("On the track");
                return; // Exit the function, car is on the track
            }
        }
    
        // If the loop finishes without finding a nearby track point, car is off the track
        console.log("Out of track");
    }

    checkPowerups() {
        for (let powerup of this.activePowerups) {
            if (this.ownCar.car.position.distanceTo(powerup.position) < 4) {
                if(this.clock.elapsedTime - powerup.lastTimePicked < 2) {
                    //if powerup was picked in the last 2 seconds, ignore it
                    continue;
                }
                console.log(powerup.name + " picked");
                this.ownCar.applyEffect(this.getEffect(powerup));
                powerup.lastTimePicked = this.elapsedTime;
                this.app.currentState.removeEventListeners();
                this.app.currentState = this.app.pickObstacleState;
                this.app.currentState.init();
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
        let powerUpData = data.representations[0];
        let effect = {};
        effect.type = powerUpData.subtype;
        effect.duration = powerUpData.duration;
        effect.value = powerUpData.value;
        return effect;
    }
}

export { Game };

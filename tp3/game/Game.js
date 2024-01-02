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
        this.clock.stop();
        this.lastCarColision = -100;
        this.countdownEnded = false;
        this.difficulty = 1;
    }

    init() {
        this.ownCar.init();
        this.oppCar.init();
        this.initPowerups();
        this.initObstacles();
        this.track = this.app.scene.getObjectByName("track");
        const trackControlPoints = this.track.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        const trackSpline = new THREE.CatmullRomCurve3(trackControlPoints,true);
        this.trackPoints = trackSpline.getPoints(200);

        this.raceCountdown(); // Await the countdown

        this.app.lapContainer.innerHTML = "Lap: " + this.laps + "/" + this.targetLaps;
        this.app.timeContainer.innerHTML = "Time: " + this.time;
        this.app.speedContainer.innerHTML = "Speed: " + this.ownCar.velocity + "km/h";
    }

    raceCountdown() {
        this.app.textContainer.innerHTML = "3";
        setTimeout(() => {
            this.app.textContainer.innerHTML = "2";
            setTimeout(() => {
                this.app.textContainer.innerHTML = "1";
                setTimeout(() => {
                    this.app.textContainer.innerHTML = "GO!";
                    this.clock.start();
                    this.countdownEnded = true;
                    this.oppCar.resumeCar();
                    setTimeout(() => {
                        this.app.textContainer.innerHTML = "";
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
    

    initPowerups() {
        let powerups = this.app.scene.getObjectByName("powerUps");
        for (let powerup of powerups.children) {
            this.addPowerup(powerup);
            powerup.lastTimePicked = -100;
        }
    }

    initObstacles() {
        let obstacles = this.app.scene.getObjectByName("obstacles");
        for (let obstacle of obstacles.children) {
            if(obstacle.children[0].data.representations[0].active) {
                this.addObstacle(obstacle);
                obstacle.lastTimePicked = -100;
            }
        }
        let obstaclePark = this.app.scene.getObjectByName("obstaclePark");
        for (let obstacle of obstaclePark.children) {
            if(obstacle.children[0].data.representations[0].active) {
                console.log(obstacle);
                this.addObstacle(obstacle);
                obstacle.lastTimePicked = -100;
            }
        }
    }


    update() {
        this.oppCar.update();
        if(!this.countdownEnded) return;
        this.ownCar.update();
        this.updateTime();
        this.updateLaps();
        this.updateSpeed();
        this.checkWinner();
        this.checkColisions();
    }

    updateTime() {
        this.elapsedTime = this.clock.getElapsedTime().toFixed(3);
        this.app.timeContainer.innerHTML = "Time: " + this.elapsedTime;
    }


    updateLaps() {
        this.laps = this.ownCar.laps;
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
        this.clock.stop();
        this.oppCar.pauseCar();
    }

    resume() {
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
        this.checkCars();
        this.checkOutOfTrack();
        this.checkObstacles();
        this.checkPowerups();
    }

    checkCars() {
        if(this.clock.elapsedTime - this.lastCarColision < 2) {
            //if car was colided in the last 2 seconds, ignore it
            return;
        }
        let ownCarSpheres = this.ownCar.boundingSpheres;
        let oppCarSpheres = this.oppCar.boundingSpheres;
        for (let i = 0; i < ownCarSpheres.length; i++) {
            for (let j = 0; j < oppCarSpheres.length; j++) {
                const sphere1 = ownCarSpheres[i];
                const sphere2 = oppCarSpheres[j];
    
                let distance = sphere1.center.distanceTo(sphere2.center);
                let radiusSum = sphere1.radius + sphere2.radius;

                if (distance < radiusSum - 4) {
                    console.log("colision");
                    this.lastCarColision = this.clock.elapsedTime;
                    this.ownCar.applyEffect({type: "speed", duration: 2, value: 0.5});
                    return;
                }
            }
        }
    }


    checkOutOfTrack() {
        const carPosition = this.ownCar.car.position;
        const distanceThreshold = 11; // Adjust this threshold as needed
    
        for (let i = 0; i < this.trackPoints.length; i++) {
            const trackPoint = this.trackPoints[i];
            const distanceToTrackPoint = carPosition.distanceTo(trackPoint);
            
            if (distanceToTrackPoint < distanceThreshold) {
                // Car is close to a track point, considered on the track
                this.ownCar.inTrack();
                return; // Exit the function, car is on the track
            }
        }
    
        // If the loop finishes without finding a nearby track point, car is off the track
        this.ownCar.outOfTrack();
    }

    checkObstacles() {
        for (let obstacle of this.activeObstacles) {
            if (this.ownCar.car.position.distanceTo(obstacle.position) < 4) {
                if(this.clock.elapsedTime - obstacle.lastTimePicked < 2) {
                    //if obstacle was picked in the last 2 seconds, ignore it
                    continue;
                }
                console.log(obstacle.name + " picked");
                obstacle.lastTimePicked = this.elapsedTime;
                this.ownCar.applyEffect(this.getEffect(obstacle));
            }
        }
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

    getEffect(object) {
        // loop until children[0] has data not undefined
        let data = object.data;
        while (data === undefined) {
            object = object.children[0];
            data = object.data;
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

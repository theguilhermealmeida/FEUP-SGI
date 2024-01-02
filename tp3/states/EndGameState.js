import { State } from './State.js';
import { MyTextRenderer } from '../MyTextRenderer.js';
import { MyFirework } from '../MyFirework.js';
import * as THREE from 'three';

class EndGameState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        this.fireworks = []
        
    }

    init() {
        this.textRenderer = new MyTextRenderer(this.app);
        this.updateGameResults();
        document.addEventListener('click', this.clickHandler);
        let cameraPosition = new THREE.Vector3(45,20,-200);
        const activeCamera = this.app.getActiveCamera();
        activeCamera.position.copy(cameraPosition);
        this.getCars();
        this.endGameMenu = this.app.scene.getObjectByName("endGameMenu");
        this.app.controls.target = this.endGameMenu.position;
        this.pickableObjNames = ["menuButton"];
        document.addEventListener("pointermove",this.pointerMoveHandler);
    }

    getCars() {
        let winner = this.app.game.winner === "You" ? this.app.game.ownCar : this.app.game.oppCar;
        let looser = this.app.game.winner === "You" ? this.app.game.oppCar : this.app.game.ownCar;
        let winnerCar = winner.car;
        let looserCar = looser.car;

        let winnerCarObject = winnerCar.getObjectByName("car");
        winnerCarObject.position.set(0,0,0);
        winnerCarObject.rotation.set(0,-1.57,0);

        let looserCarObject = looserCar.getObjectByName("car");
        looserCarObject.position.set(0,0,0);
        looserCarObject.rotation.set(0,-1.57,0);

        let winnerCarPlatform = this.app.scene.getObjectByName("winnerCarPlatform");
        winnerCarPlatform.add(winnerCarObject);

        let looserCarPlatform = this.app.scene.getObjectByName("looserCarPlatform");
        looserCarPlatform.add(looserCarObject);

    }


    updateGameResults() {
        let winner = this.app.game.winner
        let time = this.app.game.elapsedTime.toFixed(3).toString();
        let difficulty = this.app.game.difficulty.toString();
        
        let endGameMenu = this.app.scene.getObjectByName("endGameMenu");

        let winnerText = this.textRenderer.createText(winner ,2,2);
        winnerText.position.set(0,23,0.6)
        endGameMenu.add(winnerText);

        let timeText = this.textRenderer.createText(time,2,2);
        timeText.position.set(0,19,0.6)
        endGameMenu.add(timeText);

        let difficultyText = this.textRenderer.createText(difficulty,2,2);
        difficultyText.position.set(0,15,0.6)
        endGameMenu.add(difficultyText);

    }

    update() {
        this.app.controls.target = this.endGameMenu.position;

        // add new fireworks every 5% of the calls
        if(Math.random()  < 0.05 ) {
            this.fireworks.push(new MyFirework(this.app, this))
            //console.log("firework added")
        }

        // for each fireworks 
        for( let i = 0; i < this.fireworks.length; i++ ) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i,1) 
                //console.log("firework removed")
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }

    handleClick(event) {
        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        let endGameMenu = this.app.scene.getObjectByName("endGameMenu");
        var intersects = this.app.raycaster.intersectObjects(endGameMenu.children);

        this.selectButton(intersects);
    }

    selectButton(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const objName = obj.parent.parent.name;
            if (this.pickableObjNames.includes(objName)) {
                this.buttonClicked(objName);
            } else {
                //console.log("Object cannot be picked!");
            }
        }
    }

    buttonClicked(objName) {
        if(objName === "menuButton") {
            //refresh page
            window.location.reload();
        }

    }

    onPointerMove(event) {

        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        let endGameMenu = this.app.scene.getObjectByName("endGameMenu");
        var intersects = this.app.raycaster.intersectObjects(endGameMenu.children);

        this.changeColor(intersects)
    }

    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material = this.app.pickedMaterial;
            this.lastPickedObj = obj;
            this.lastPickedObjMaterial = obj.material;
            this.lastPickedObj.material = this.app.pickedMaterial;
        }
    }

    /*
        * Restore the original color of the intersected object
        *
        */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material = this.lastPickedObjMaterial;
        this.lastPickedObj = null;
        this.lastPickedObjMaterial = null;
    }

    changeColor(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const objName = obj.parent.parent.name;
            if (this.pickableObjNames.includes(objName)) {
                this.changeColorOfFirstPickedObj(obj);
            } else {
                //console.log("Object cannot be picked!");
                this.restoreColorOfFirstPickedObj();
            }
        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    removeEventListeners() {
        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener("pointermove",this.pointerMoveHandler);
    }

  }

export { EndGameState };
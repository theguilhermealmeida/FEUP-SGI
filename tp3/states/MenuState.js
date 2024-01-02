import { State } from './State.js';
import * as THREE from 'three';

class MenuState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        this.difficultyButton = null;
        
    }

    init() {
        document.addEventListener('click', this.clickHandler);
        this.app.setActiveCamera("menu")
        this.pickableObjNames = ["startButton","selectCarButton","easyButton","mediumButton","hardButton"];
        document.addEventListener("pointermove",this.pointerMoveHandler);
    }

    update() {
        let menu = this.app.scene.getObjectByName("menu");
        this.app.controls.target = menu.position;
        console.log(this.app.game.difficulty);
    }

    handleClick(event) {
        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        let menu = this.app.scene.getObjectByName("menu");
        var intersects = this.app.raycaster.intersectObjects(menu.children);

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
        if(objName === "startButton") {
            if(this.app.game.ownCar !== null && this.app.game.difficulty !== null) {
                this.app.cleanTextContainers();
                this.removeEventListeners();
                this.restoreColorOfFirstPickedObj();
                this.app.currentState = this.app.gameState;
                this.app.currentState.init();
            }
            else{
                this.restoreColorOfFirstPickedObj();             
                this.app.textContainer.innerHTML = "Please select a car and a difficulty";
            }
        } else if(objName === "selectCarButton") {
            this.app.cleanTextContainers();
            this.removeEventListeners();
            this.restoreColorOfFirstPickedObj();
            this.app.currentState = this.app.pickOwnCarState;
            this.app.currentState.init();
        }
        else if(objName === "easyButton") {
            this.app.game.difficulty = "easY";
            this.changeDifficultyButtonColor(objName);
        }
        else if(objName === "mediumButton") {
            this.app.game.difficulty = "medium";
            this.changeDifficultyButtonColor(objName);
        }
        else if(objName === "hardButton") {
            this.app.game.difficulty = "hard";
            this.changeDifficultyButtonColor(objName);
        }
    }

    changeDifficultyButtonColor(objName) {
        let menu = this.app.scene.getObjectByName("menu");

        let clickedButton = menu.getObjectByName(objName);

        let easyButton = menu.getObjectByName("easyButton");

        let mediumButton = menu.getObjectByName("mediumButton");

        let hardButton = menu.getObjectByName("hardButton");

        if(this.difficultyButton === clickedButton) {
            return;
        }

        if(objName === "easyButton") {
            this.restoreDifficultyButtonColor(this.difficultyButton);
            this.difficultyButton = easyButton;
            easyButton.children[0].children[0].material = this.app.selectedMaterial;
            this.lastPickedObjMaterial = easyButton.children[0].children[0].material;
            easyButton.position.z -=1.5
        }
        else if(objName === "mediumButton") {
            this.restoreDifficultyButtonColor(this.difficultyButton);
            this.difficultyButton = mediumButton;
            mediumButton.children[0].children[0].material = this.app.selectedMaterial;
            this.lastPickedObjMaterial = mediumButton.children[0].children[0].material;
            mediumButton.position.z -=1.5
        }
        else if(objName === "hardButton") {
            this.restoreDifficultyButtonColor(this.difficultyButton);
            this.difficultyButton = hardButton;
            hardButton.children[0].children[0].material = this.app.selectedMaterial;
            this.lastPickedObjMaterial = hardButton.children[0].children[0].material;
            hardButton.position.z -=1.5
        }

    }

    restoreDifficultyButtonColor(button) {
        if(button === null) {
            return;
        }
        button.children[0].children[0].material = this.app.buttonMaterial;
        button.position.z +=1.5
    }

    onPointerMove(event) {

        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        let menu = this.app.scene.getObjectByName("menu");

        var intersects = this.app.raycaster.intersectObjects(menu.children);

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

export { MenuState };
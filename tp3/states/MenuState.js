import { State } from './State.js';
import * as THREE from 'three';

class MenuState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        
    }

    init() {
        document.addEventListener('click', this.clickHandler);
        this.app.setActiveCamera("menu");
        this.pickableObjNames = ["startButton"];
        document.addEventListener("pointermove",this.pointerMoveHandler);
    }

    update() {
        let menu = this.app.scene.getObjectByName("menu");
        this.app.controls.target = menu.position;
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
                this.removeEventListeners();
                this.restoreColorOfFirstPickedObj();
                this.app.currentState = this.app.pickOwnCarState;
                this.app.currentState.init();
            } else {
                //console.log("Object cannot be picked!");
            }
        }
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
                this.lastPickedObj.material = this.app.materials.get("greenApp");
            this.lastPickedObj = obj;
            this.lastPickedObjMaterial = obj.material;
            this.lastPickedObj.material = this.app.materials.get("greenApp");
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

export { MenuState };
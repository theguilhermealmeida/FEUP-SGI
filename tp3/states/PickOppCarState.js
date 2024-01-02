import { State } from './State.js';
import { OppCar } from '../game/OppCar.js';
import * as THREE from 'three';

class PickOppCarState extends State {
    constructor(app) {
        super(app);
        this.clickHandler = this.handleClick.bind(this);
        this.pointerMoveHandler = this.onPointerMove.bind(this);
        
    }

    init() {
        document.addEventListener('click', this.clickHandler);
        this.app.setActiveCamera("carPark");
        this.pickableObjNames = ["redCar", "blueCar", "greenCar", "yellowCar"];
        this.pickableObjNames.splice(this.pickableObjNames.indexOf(this.app.game.ownCarName), 1);
        this.cars = this.app.scene.getObjectByName("cars");
        document.addEventListener("pointermove",this.pointerMoveHandler);

        this.app.textContainer.innerHTML = "Pick your opponent car!"
    }

    update() {
        this.app.controls.target = this.cars.position;
    }

    handleClick(event) {
        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        var intersects = this.app.raycaster.intersectObjects(this.cars.children);

        this.selectCar(intersects);
    }

    selectCar(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            let parent = obj;
    
            while (parent !== null && parent.type !== 'Scene') {
                const objName = parent.name;
    
                if (this.pickableObjNames.includes(objName)) {
                    let car = this.cars.getObjectByName(objName)
                    let carObject = car.getObjectByName("car");
                    let carRoute = car.getObjectByName("route");
                    console.log(carRoute);
                    
                    this.cars.remove(car);
                    carObject.rotation.y = -1.57;
                    let oppCarPlatform = this.app.scene.getObjectByName("oppCarPlatform");
                    oppCarPlatform.add(carObject);

                    this.app.game.oppCar = new OppCar(this.app, carObject, carRoute);
                    
                    this.removeEventListeners();
                    this.restoreColorOfFirstPickedObj();
                    this.app.cleanTextContainers();
                    this.app.currentState = this.app.menuState;
                    this.app.currentState.init();

                    return; // Exit the loop if a pickable object is found
                }
    
                parent = parent.parent; // Move up to the next parent
            }
    
            // If no pickable object is found in the hierarchy, restore color
            this.restoreColorOfFirstPickedObj();
        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    onPointerMove(event) {

        this.app.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.app.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.app.raycaster.setFromCamera(this.app.pointer, this.app.getActiveCamera());

        var intersects = this.app.raycaster.intersectObjects(this.cars.children);

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
            let parent = obj;
    
            while (parent !== null && parent.type !== 'Scene') {
                const objName = parent.name;
    
                if (this.pickableObjNames.includes(objName)) {
                    let platform = this.cars.getObjectByName(objName).getObjectByName("platform").children[0].children[0];
                    this.restoreColorOfFirstPickedObj();
                    this.changeColorOfFirstPickedObj(platform);
                    return; // Exit the loop if a pickable object is found
                }
    
                parent = parent.parent; // Move up to the next parent
            }
    
            // If no pickable object is found in the hierarchy, restore color
            this.restoreColorOfFirstPickedObj();
        } else {
            this.restoreColorOfFirstPickedObj();
        }
    }

    removeEventListeners() {
        document.removeEventListener('click', this.clickHandler);
        document.removeEventListener("pointermove",this.pointerMoveHandler);
    }

  }

export { PickOppCarState };
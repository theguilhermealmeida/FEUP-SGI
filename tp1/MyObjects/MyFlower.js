import * as THREE from 'three'
import { MyNurbsBuilder } from './MyNurbsBuilder.js'
import { MyCatmullRoll } from './MyCatmullRom.js'

export class MyFlower {
    constructor(app,position) {
        this.app = app
        this.position = position
        this.flower = null
    }

    display() {
            
            if (this.flower != null) {
                this.app.scene.remove(this.flower);
            }
            // define geometry
            this.flower = this.createFlower();
    
            // set initial position
            this.flower.position.set(this.position.x,this.position.y,this.position.z)
    
            // add the line to the scene
            this.app.scene.add( this.flower )

    }

    createFlower() {
        let stem = this.createFlowerStem();
        let head = this.createFlowerHead();
        let petals = this.createFlowerPetals();

        let top = new THREE.Group();
        top.add(head);
        top.add(petals);
        top.position.set(0,3.1,0);
        top.rotation.x = -Math.PI/6;

        let flower = new THREE.Group();
        flower.add(stem);
        flower.add(top);

        return flower;
    }

    createFlowerStem(){
        const points = [];

        // put points that raise the stem
        points.push(new THREE.Vector3(0,0,0));
        points.push(new THREE.Vector3(0.1,0.2,0));
        points.push(new THREE.Vector3(0,0.4,0.1));
        points.push(new THREE.Vector3(0.1,0.6,0.1));
        points.push(new THREE.Vector3(0,0.8,0));
        points.push(new THREE.Vector3(0.1,1,0));
        points.push(new THREE.Vector3(0,1.2,0.1));
        points.push(new THREE.Vector3(0.1,1.4,0));
        points.push(new THREE.Vector3(0.1,1.6,0));
        points.push(new THREE.Vector3(0,1.8,0));
        points.push(new THREE.Vector3(0,2,0));
        points.push(new THREE.Vector3(0.1,2.2,0.1));
        points.push(new THREE.Vector3(0,2.4,0.1));
        points.push(new THREE.Vector3(0,2.6,0.1));
        points.push(new THREE.Vector3(0.1,2.8,0.1));
        points.push(new THREE.Vector3(0,3,0));

        let catmull = new MyCatmullRoll(this.app,points,new THREE.Vector3(0,0,0),500)
        return catmull.compute();
    }

    createFlowerHead(){
        //circle for the head
        let circle = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32); 
        let material = new THREE.MeshStandardMaterial( {color: 0xffff00, emissive: "#000000"} );
        let head = new THREE.Mesh( circle, material );
        head.rotation.x = Math.PI/2;
    
        head.castShadow = true;
        head.receiveShadow = true;
        return head;
    }

    createFlowerPetals(){

        // Elongated petal
        const petalGeometry = new THREE.CylinderGeometry(0.12,0.12,0.05,32);
        let material = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: "#000000"} );
        let petal1 = new THREE.Mesh( petalGeometry, material );
        petal1.position.set(0,0.25,-0.01);
        petal1.rotation.x = Math.PI/2;

        let petal2 = new THREE.Mesh( petalGeometry, material );
        petal2.position.set(0.15,0.2,-0.01);
        petal2.rotation.x = Math.PI/2;

        let petal3 = new THREE.Mesh( petalGeometry, material );
        petal3.position.set(0.25,0,-0.01);
        petal3.rotation.x = Math.PI/2;

        let petal4 = new THREE.Mesh( petalGeometry, material );
        petal4.position.set(0.15,-0.2,-0.01);
        petal4.rotation.x = Math.PI/2;

        let petal5 = new THREE.Mesh( petalGeometry, material );
        petal5.position.set(0,-0.25,-0.01);
        petal5.rotation.x = Math.PI/2;

        let petal6 = new THREE.Mesh( petalGeometry, material );
        petal6.position.set(-0.15,-0.2,-0.01);
        petal6.rotation.x = Math.PI/2;

        let petal7 = new THREE.Mesh( petalGeometry, material );
        petal7.position.set(-0.25,0,-0.01);
        petal7.rotation.x = Math.PI/2;

        let petal8 = new THREE.Mesh( petalGeometry, material );
        petal8.position.set(-0.15,0.2,-0.01);
        petal8.rotation.x = Math.PI/2;

        //set shadows for all petals
        petal1.castShadow = true;
        petal1.receiveShadow = true;
        petal2.castShadow = true;
        petal2.receiveShadow = true;
        petal3.castShadow = true;
        petal3.receiveShadow = true;
        petal4.castShadow = true;
        petal4.receiveShadow = true;
        petal5.castShadow = true;
        petal5.receiveShadow = true;
        petal6.castShadow = true;
        petal6.receiveShadow = true;
        petal7.castShadow = true;
        petal7.receiveShadow = true;
        petal8.castShadow = true;
        petal8.receiveShadow = true;


        let petals = new THREE.Group();
        petals.add(petal1);
        petals.add(petal2);
        petals.add(petal3);
        petals.add(petal4);
        petals.add(petal5);
        petals.add(petal6);
        petals.add(petal7);
        petals.add(petal8);
        return petals;
        

    }


}
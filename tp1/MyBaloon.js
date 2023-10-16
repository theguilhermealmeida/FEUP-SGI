import * as THREE from 'three'
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

export class MyBalloon {
    constructor(app,position,color) {
        this.app = app
        this.position = position
        this.color = color
        this.ballon = null
    }

    display() {
                
        if (this.ballon != null) {
            this.app.scene.remove(this.ballon);
        }
        // define geometry
        this.ballon = this.createBalloon();

        // set initial position
        this.ballon.position.set(this.position.x,this.position.y,this.position.z)

        // add the line to the scene
        this.app.scene.add( this.ballon )
    
    }


    createBalloon() {
        const balloonGroup = new THREE.Group();
    
        // Balloon body (sphere)
        const balloonGeometry = new THREE.CapsuleGeometry(0.7,0.15,25,25)
        const balloonMaterial = new THREE.MeshPhongMaterial({
            color: this.color,  // Red color
            specular: 0x888888, // Specular color
            shininess: 30,      // Shininess value
        });
        const balloonMesh = new THREE.Mesh(balloonGeometry, balloonMaterial);
        balloonMesh.position.set(0, 5, 0); // Adjust the position to avoid the balloon intersecting the ground plane
    
        // Balloon string (cylinder)
        const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 16);
        const stringMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Black color
        const stringMesh = new THREE.Mesh(stringGeometry, stringMaterial);
        stringMesh.position.set(0, 2.5, 0); // Adjust the position to connect the balloon to the ground
    
        balloonGroup.add(balloonMesh);
        balloonGroup.add(stringMesh);
    
        return balloonGroup;
    }
    
}
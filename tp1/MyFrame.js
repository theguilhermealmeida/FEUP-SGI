import * as THREE from 'three';
import { MyPolyline } from './MyPolyline.js';
import { MyQuadraticBezier } from './MyQuadraticBezier.js';

export class MyFrame{
    constructor(app,width,height,depth,position) { 
        this.app = app;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.position = position;
        this.frameMesh = null;
        this.curve = null;
    }

    display() {

        if (this.frameMesh != null) {
            this.app.scene.remove(this.frameMesh);
        }
        if (this.canvasMesh != null) {
            this.app.scene.remove(this.canvasMesh);
        }
        if (this.polyline != null) {
            this.app.scene.remove(this.polyline);
        }

        // Create the frame
        let frame = new THREE.BoxGeometry(this.width, this.height, this.depth);
        let frameMaterial = new THREE.MeshBasicMaterial({ color: 0x65350f });
        this.frameMesh = new THREE.Mesh(frame, frameMaterial);
        this.frameMesh.position.set(this.position[0], this.position[1], this.position[2])
        this.app.scene.add(this.frameMesh);

        // Create the canvas
        let canvas = new THREE.BoxGeometry(this.width*0.9, this.height * 0.9, 0.05);
        let canvasMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.canvasMesh = new THREE.Mesh(canvas, canvasMaterial);
        this.canvasMesh.position.set(this.position[0], this.position[1], this.position[2]+this.depth/2)
        this.app.scene.add(this.canvasMesh);

        // Create the first wheel
        let points = [
            new THREE.Vector3( -1 * 0.15 * this.width, 0, 0),
            new THREE.Vector3( 0,3*0.15*this.height,0 ),
            new THREE.Vector3( 1*0.15*this.width,0,0)
        ]

        let pos = [this.position[0]- this.width*0.2, this.position[1]-this.height*0.3, this.position[2]+this.depth/1.3]
        this.curve = new MyQuadraticBezier(this.app, points, pos, 16);
        this.curve.display();

        // Create the second wheel
        pos = [this.position[0]+this.width*0.2, this.position[1]-this.height*0.3, this.position[2]+this.depth/1.3]
        this.curve = new MyQuadraticBezier(this.app, points, pos, 16);
        this.curve.display();

        // Create back of the car
        points = [
            new THREE.Vector3( -1 * 0.15 * this.width, 0, 0),
            new THREE.Vector3( -1 * 0.15 * this.width,2.5*0.25*this.height,0 ),
            new THREE.Vector3( 1.35*0.15*this.width,2.5*0.25*this.height,0)
        ]

        pos = [this.position[0]- this.width*0.2, this.position[1]-this.height*0.3, this.position[2]+this.depth/1.3]
        this.curve = new MyQuadraticBezier(this.app, points, pos, 16);
        this.curve.display();

        // Create window of the car
        points = [
            new THREE.Vector3( 1.35*0.15*this.width,2.5*0.25*this.height,0),
            new THREE.Vector3( 2.5*0.15*this.width,2.5*0.25*this.height,0 ),
            new THREE.Vector3( 2.5*0.15*this.width,1.15*0.25*this.height,0)
        ]

        pos = [this.position[0]- this.width*0.2, this.position[1]-this.height*0.3, this.position[2]+this.depth/1.3]
        this.curve = new MyQuadraticBezier(this.app, points, pos, 16);
        this.curve.display();

        // Create the front of the car
        points = [
            new THREE.Vector3( 2.5*0.15*this.width,1.15*0.25*this.height,0),
            new THREE.Vector3( 3.67*0.15*this.width,1.15*0.25*this.height,0),
            new THREE.Vector3( 3.67*0.15*this.width,0*0.25*this.height,0)
        ]

        pos = [this.position[0]- this.width*0.2, this.position[1]-this.height*0.3, this.position[2]+this.depth/1.3]
        this.curve = new MyQuadraticBezier(this.app, points, pos, 16);
        this.curve.display();



    }
}

import * as THREE from 'three';
import { MyPolyline } from './MyPolyline.js';
import { MyCubicBezier } from './MyCubicBezier.js';

export class MyCarocha{
    constructor(app,position, xScale, yScale, zScale) { 
        this.app = app;
        this.position = position;
        this.carocha = null;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }

    display() {
            
        if (this.carocha != null) {
            this.app.scene.remove(this.carocha);
        }
        // define geometry
        this.carocha = this.createCarocha();

        // set initial position
        this.carocha.position.set(this.position.x,this.position.y,this.position.z)

        this.carocha.scale.set(this.xScale,this.yScale,this.zScale)

        this.carocha.rotation.y = -Math.PI/2;

        // add the line to the scene
        this.app.scene.add( this.carocha )

    }

    createCarocha() {

        // Create the frame
        let frame = new THREE.BoxGeometry(10, 6, 0.15);
        let frameMaterial = new THREE.MeshBasicMaterial({ color: 0x65350f });
        this.frameMesh = new THREE.Mesh(frame, frameMaterial);
        this.frameMesh.position.set(0, 0, 0)

        // Create the canvas
        let canvas = new THREE.BoxGeometry(9, 5.4, 0.03);
        let canvasMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.canvasMesh = new THREE.Mesh(canvas, canvasMaterial);
        this.canvasMesh.position.set(0, 0, 0.07)

        // Create the first wheel
        let x_left = -4;
        let y = -2;
        let x_right = -0.5;

        let points = [
            new THREE.Vector3( x_left, y, 0),
            new THREE.Vector3( x_left ,y + 1.33 * ((x_right-x_left)/2),0 ),
            new THREE.Vector3( x_right,y + 1.33 * ((x_right-x_left)/2),0),
            new THREE.Vector3( x_right,y,0)
        ]

        let wheel = new MyCubicBezier(this.app, points,new THREE.Vector3(0,0,0.2) ,32).compute();

        // Create the second wheel
        x_left = 0.5;
        y = -2;
        x_right = 4;

        points = [
            new THREE.Vector3( x_left, y, 0),
            new THREE.Vector3( x_left ,y + 1.33 * ((x_right-x_left)/2),0 ),
            new THREE.Vector3( x_right,y + 1.33 * ((x_right-x_left)/2),0),
            new THREE.Vector3( x_right,y,0)
        ]

        let wheel2 = new MyCubicBezier(this.app, points,new THREE.Vector3(0,0,0.2) ,32).compute();

        // create back of the car

        x_left = -4;
        y = -2;
        x_right = 0;

        points = [
            new THREE.Vector3( x_left, y, 0),
            new THREE.Vector3( x_left,y + 0.5528 * (x_right-x_left),0 ),
            new THREE.Vector3( x_left + 0.5528 * (x_right-x_left) ,y + (x_right-x_left) ,0 ),
            new THREE.Vector3( x_right,y + (x_right-x_left),0)
        ]

        let back = new MyCubicBezier(this.app, points,new THREE.Vector3(0,0,0.2) ,32).compute();

        // create window of the car

        x_left = 0;
        y = 2;
        x_right = 2;

        points = [
            new THREE.Vector3( x_left, y, 0),
            new THREE.Vector3( x_left + 0.5528 * (x_right-x_left),y,0 ),
            new THREE.Vector3( x_right ,y - 0.5528 * (x_right-x_left) ,0 ),
            new THREE.Vector3( x_right,y - (x_right-x_left),0)
        ]

        let window = new MyCubicBezier(this.app, points,new THREE.Vector3(0,0,0.2) ,32).compute();

        // create front of the car

        x_left = 2;
        y = 0;
        x_right = 4;

        points = [
            new THREE.Vector3( x_left, y, 0),
            new THREE.Vector3( x_left + (x_right-x_left),y,0 ),
            new THREE.Vector3( x_right ,y - (x_right-x_left) ,0 ),
            new THREE.Vector3( x_right,y - (x_right-x_left),0)
        ]

        let front = new MyCubicBezier(this.app, points,new THREE.Vector3(0,0,0.2) ,32).compute();

        // Group
        let group = new THREE.Group();
        group.add(this.frameMesh);
        group.add(this.canvasMesh);
        group.add(wheel);
        group.add(wheel2);
        group.add(back);
        group.add(window);
        group.add(front);
        return group;

    }
}

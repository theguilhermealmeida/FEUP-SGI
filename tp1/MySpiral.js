import * as THREE from 'three'
import { MyCatmullRoll } from './MyCatmullRom.js';

export class MySpiral {
    constructor(app,position, xScale, yScale, zScale) {
        this.app = app
        this.position = position
        this.spiral = null
        this.xScale = xScale
        this.yScale = yScale
        this.zScale = zScale

    }

    display() {
            
            if (this.spiral != null) {
                this.app.scene.remove(this.spiral);
            }
    
            // define geometry
            this.spiral = this.createSpiral();
            
            this.spiral.position.set(this.position.x,this.position.y,this.position.z)

            this.spiral.scale.set(this.xScale,this.yScale,this.zScale)
    
            // add the line to the scene
            this.app.scene.add( this.spiral )
    }

    createSpiral() {

        // Number of points in the spiral
        const numPoints = 1000;
        
        // Radius of the spiral
        const radius = 1;

        // Number of turns in the spiral
        const turns = 5;

        // Create an array to store the points along the spiral
        const points = [];

        // Create a loop which will generate the points along the spiral
        for (let i = 0; i < numPoints; i++) {
            // Calculate the angle for each point along the spiral
            const angle = (i / numPoints) * turns * Math.PI * 2;

            // Calculate the x and y coordinates for the point along the spiral
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = i * 0.005;

            // Add the point to the array
            points.push(new THREE.Vector3(x, y, z));
        }


        let catmull = new MyCatmullRoll(this.app,points,new THREE.Vector3(0,0,0),500)
        return catmull.compute();

    }


}
import * as THREE from 'three';

export class MyQuadraticBezier {
    constructor(app,points,position,nrOfSamples) {
        this.app = app
        this.points = points
        this.position = position
        this.nrOfSamples = nrOfSamples
        this.curve = null
    }

    display() {

        if (this.curve != null) {
            this.app.scene.remove(this.curve);
        }

        let quadratic = new THREE.QuadraticBezierCurve3(
            this.points[0], this.points[1], this.points[2])

        let sampledPoints = quadratic.getPoints( this.nrOfSamples );

        let geometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        let material = new THREE.LineBasicMaterial( { color: 0x000000 } )
        this.curve = new THREE.Line( geometry, material )
        this.curve.position.set(this.position[0],this.position[1],this.position[2])
        this.app.scene.add( this.curve );
        
        
    }
}
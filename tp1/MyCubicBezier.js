import * as THREE from 'three';

export class MyCubicBezier {
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

        let cubic = new THREE.CubicBezierCurve3(
            this.points[0], this.points[1], this.points[2], this.points[3])

        let sampledPoints = cubic.getPoints( this.nrOfSamples );

        let geometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        let material = new THREE.LineBasicMaterial( { color: 0x000000 } )
        this.curve = new THREE.Line( geometry, material )
        this.curve.position.set(this.position.x,this.position.y,this.position.z)
        this.app.scene.add( this.curve );
        
    }

    compute() {

        let cubic = new THREE.CubicBezierCurve3(
            this.points[0], this.points[1], this.points[2], this.points[3])

        let sampledPoints = cubic.getPoints( this.nrOfSamples );

        let geometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        let material = new THREE.LineBasicMaterial( { color: 0x000000 } )
        this.curve = new THREE.Line( geometry, material )
        this.curve.position.set(this.position.x,this.position.y,this.position.z)
        return this.curve;
        
    }
}
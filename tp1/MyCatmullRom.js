import * as THREE from 'three';

export class MyCatmullRoll {
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

        let curve = new THREE.CatmullRomCurve3(this.points);
        let sampledPoints = curve.getPoints( this.nrOfSamples );

        let geometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        let material = new THREE.LineBasicMaterial( { color: 0xff0000 } )
        this.curve = new THREE.Line( geometry, material )
        this.curve.position.set(this.position.x,this.position.y,this.position.z)
        this.app.scene.add( this.curve );
        
        
    }   

    compute() {

        let curve = new THREE.CatmullRomCurve3(this.points);
        let sampledPoints = curve.getPoints( this.nrOfSamples );

        let geometry = new THREE.BufferGeometry().setFromPoints( sampledPoints )

        let material = new THREE.LineBasicMaterial( { color: 0x006400 } )
        this.curve = new THREE.Line( geometry, material )
        return this.curve;
        
    }  
}
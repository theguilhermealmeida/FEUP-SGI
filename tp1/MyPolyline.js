import * as THREE from 'three'

export class MyPolyline {
    constructor(app,points,position) {
        this.app = app
        this.points = points
        this.position = position
        this.polyline = null
    }

    display() {

        if (this.polyline != null) {
            this.app.scene.remove(this.polyline);
        }

        // define geometry
        const geometry = new THREE.BufferGeometry().setFromPoints( this.points );

        // create the line from material and geometry
        this.polyline = new THREE.Line( geometry,
            new THREE.LineBasicMaterial( { color: 0x0000ff } ) );

        // set initial position
        this.polyline.position.set(this.position.x,this.position.y,this.position.z)

        // add the line to the scene
        this.app.scene.add( this.polyline )
    }
}
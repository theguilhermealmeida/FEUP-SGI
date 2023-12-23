import * as THREE from 'three';

class MyTrack {
    constructor(controlPoints, numSegments) {
        this.controlPoints = controlPoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));
        this.numSegments = numSegments;
        this.path = this.createPath();
    }

    createPath() {
        return new THREE.CatmullRomCurve3(this.controlPoints, true);
    }

    build() {
        const tubeGeometry = new THREE.TubeGeometry(
        this.path,
        this.numSegments,
        8, // Width of the tube, adjust as needed
        20, // Radius segments, adjust as needed
        false // Closed tube or not
        );

        return tubeGeometry;
    }
}
export { MyTrack };
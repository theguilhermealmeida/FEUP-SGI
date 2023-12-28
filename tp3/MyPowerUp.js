import * as THREE from 'three'

class MyPowerUp {
    constructor(powerUpData) {
        this.id = powerUpData.representations[0].id;
        this.x = powerUpData.representations[0].xyz[0];
        this.y = powerUpData.representations[0].xyz[1];
        this.z = powerUpData.representations[0].xyz[2];
        this.subtype = powerUpData.representations[0].subtype;
        console.log(this.id, this.x, this.y, this.z, this.subtype)

        this.buildObject();
    }

    buildObject() {
        let geometry = new THREE.SphereGeometry(5, 32, 32);
        return geometry;
    }
}
export { MyPowerUp }
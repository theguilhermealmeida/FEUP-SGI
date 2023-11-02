import * as THREE from 'three';


class MyTransformationsHandler {
    constructor(childData, nodeData) {
        this.childData = childData;
        this.nodeData = nodeData;
        this.localTransformations = childData.transformations;
        this.inheritedTransformations = nodeData.transformations;
        this.finalTransformations = [];

        const Ma = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
          
        const Mp = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];

    }

    handleTransformations() {
        for (let transformation in this.localTransformations) {
            switch (transformation.type) {
                case 'T': {
                    const [tx, ty, tz] = transformation.translate
                    Mp[0][2] += tx;
                    Mp[1][2] += ty;
                    Mp[2][2] += tz;
                    break;
                }
                case 'R': {
                    const [rx, ry, rz] = transformation.rotation
                    // calculate rotation matrix
                    const Rx = new M3(
                        1, 0, 0,
                        0, Math.cos(rx), -Math.sin(rx),
                        0, Math.sin(rx), Math.cos(rx))
                    const Ry = new M3(
                        Math.cos(ry), 0, Math.sin(ry),
                        0, 1, 0,
                        -Math.sin(ry), 0, Math.cos(ry))
                    const Rz = new M3( 
                        Math.cos(rz), -Math.sin(rz), 0,
                        Math.sin(rz), Math.cos(rz), 0,
                        0, 0, 1)
                    const R = 
                    
                }
            }
        }
        
    }

}

export { MyTransformationsHandler }
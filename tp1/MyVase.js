import * as THREE from 'three'
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

export class MyVase {
    constructor(app,position, xScale, yScale, zScale) {
        this.app = app
        this.position = position
        this.vase = null
        this.xScale = xScale
        this.yScale = yScale
        this.zScale = zScale

    }

    display() {

        if (this.vase != null) {
            this.app.scene.remove(this.vase);
        }

        // define geometry
        this.vase = this.createVase();

        // set initial position
        this.vase.position.set(this.position.x,this.position.y,this.position.z)

        this.vase.scale.set(this.xScale,this.yScale,this.zScale)
        // add the line to the scene
        this.app.scene.add( this.vase )
    }


createVase() {
    // declare local variables
    let controlPoints;
    let surfaceData;
    let mesh;
    let orderU = 3; // Increased the order for smoother curves
    let orderV = 3; // Increased the order for smoother curves
    let samplesU = 16;
    let samplesV = 16;

    let map = new THREE.TextureLoader().load('textures/vase.jpg');

    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.colorSpace = THREE.SRGBColorSpace;

    let material = new THREE.MeshLambertMaterial({
        map: map,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1,
    });

    let builder = new MyNurbsBuilder();

    // create cilinder
    controlPoints = [
        // U = 0
        [ // V = 0..2
            [-1.0, 0.0, 0.0, 1],
            [-2.5, 2.0, 0.0, 1],
            [0, 4.0, 0.0, 1],
            [-1.0, 5.0, 0.0, 1]
        ],
        // U = 1
        [ // V = 0..2
            [-1.0, 0.0, 1.3, 1],
            [-1.5, 2.0, 3, 1],
            [0, 4.0, 0, 1],
            [-1.0, 5.0, 1.3, 1]
        ],
        // U = 2
        [ // V = 0..2
            [1.0, 0.0, 1.3, 1],
            [1.5, 2.0, 3, 1],
            [0, 4.0, 0, 1],
            [1.0, 5.0, 1.3, 1]
        ],           
        // U = 3
        [ // V = 0..2
            [1.0, 0.0, 0.0, 1],
            [2.5, 2.0, 0.0, 1],
            [0, 4.0, 0.0, 1],
            [1.0, 5.0, 0.0, 1]
        ],

    ];

    surfaceData = builder.build(controlPoints,
        orderU, orderV, samplesU,
        samplesV, material);

    mesh = new THREE.Mesh(surfaceData, material);
    mesh.position.set(0, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    let mesh2 = mesh.clone();
    mesh2.rotation.y = -Math.PI;
    mesh2.position.set(0, 0, 0);
    mesh2.castShadow = true;
    mesh2.receiveShadow = true;
    // create circle plane for bottom of vase
    let mesh3 = new THREE.Mesh(new THREE.CircleGeometry(1, 32), material);
    mesh3.rotation.x = Math.PI / 2;
    mesh3.position.set(0, 0, 0);
    // group the two meshes together
    let group = new THREE.Group();
    group.add(mesh);
    group.add(mesh2);
    group.add(mesh3);
    return group;
}
}
import * as THREE from 'three'
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

export class MyNewspaper {
    constructor(app,position) {
        this.app = app
        this.position = position
        this.newspaper = null
    }

    display() {

        if (this.newspaper != null) {
            this.app.scene.remove(this.newspaper);
        }

        // define geometry
        this.newspaper = this.createNewspaper();

        // set initial position
        this.newspaper.position.set(this.position.x,this.position.y,this.position.z)

        // add the line to the scene
        this.app.scene.add( this.newspaper )
    }

    createNewspaper(){

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 3; // Increased the order for smoother curves
        let orderV = 1; // Increased the order for smoother curves
        let samplesU = 16;      
        let samplesV = 16;
    
        let map =
            new THREE.TextureLoader().load('textures/newspaper.jpg');
    
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        
        let material = new THREE.MeshLambertMaterial({ 
            map: map,
            side: THREE.DoubleSide,
            transparent: true, 
            opacity: 1 
        });
        
        let builder = new MyNurbsBuilder();
    
        // create left part of newspaper
        controlPoints = [
            // U = 0
            [ // V = 0..1
                [-5.0, 0.0, -2.0, 1],
                [-5.0,  0.0, 2.0, 1]
            ],
            // U = 1
            [ // V = 0..1
                [-4.0, -0.3, -2.0, 1],
                [-4.0, -0.3, 2.0, 1]
            ],
            // U = 2
            [ // V = 0..1
                [-1.5, 3, -2.0, 1],
                [-1.5, 3, 2.0, 1]
            ],
            // U = 3
            [ // V = 0..1
                [0, 0.0, -2.0, 1],
                [0,  0.0, 2.0, 1]
            ],
        ];
    
        surfaceData = builder.build(controlPoints,
                        orderU, orderV, samplesU,
                        samplesV, material);
    
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.position.set(0, 0, 0);
        let mesh2 = mesh.clone();
        mesh2.rotation.y = -Math.PI;
        mesh2.position.set(0, 0, 0);
        // group the two meshes together
        let newspaper = new THREE.Group();
        newspaper.add(mesh);
        newspaper.add(mesh2);
        return newspaper;

    }

}
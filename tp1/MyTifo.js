import * as THREE from 'three'
import { MyNurbsBuilder } from './MyNurbsBuilder.js'
import { MyCatmullRoll } from './MyCatmullRom.js'

export class MyTifo {
    constructor(app,position) {
        this.app = app
        this.position = position
        this.tifo = null
    }

    display() {

        if (this.tifo != null) {
            this.app.scene.remove(this.tifo);
        }

        // define geometry
        this.tifo = this.createTifo();
        // rotate the tifo to be perpendicular to the field
        this.tifo.rotation.z = -Math.PI/2;
        this.tifo.rotation.x = Math.PI/2;


        // set initial position
        this.tifo.position.set(this.position.x,this.position.y,this.position.z)

        

        // add the line to the scene
        this.app.scene.add( this.tifo )
    }

    createTifo(){

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 3; // Increased the order for smoother curves
        let orderV = 1; // Increased the order for smoother curves
        let samplesU = 16;      
        let samplesV = 16;
    
        let map =
            new THREE.TextureLoader().load('textures/party.jpg');
    
        //no repeat
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        
            
        // Create materials with different UV offsets
        let material = new THREE.MeshLambertMaterial({
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1,
        });
   
        let builder = new MyNurbsBuilder();
    
        // create left part of newspaper
        controlPoints = [
            // U = 0
            [ // V = 0..1
                [-1.5, 0.0, -2.0, 1],
                [-1.5,  0.0, 2.0, 1]
            ],
            // U = 1
            [ // V = 0..1
                [-0.5, -1, -2.0, 1],
                [-0.5, -1, 2.0, 1]
            ],
            // U = 2
            [ // V = 0..1
                [0.5, 1, -2.0, 1],
                [0.5, 1, 2.0, 1]
            ],
            // U = 3
            [ // V = 0..1
                [1.5, 0, -2.0, 1],
                [1.5, 0, 2.0, 1]
            ],
        ];
    
        surfaceData = builder.build(controlPoints,
                        orderU, orderV, samplesU,
                        samplesV, material);
    
        mesh = new THREE.Mesh(surfaceData, material);
        mesh.position.set(0, 0, 0);
        let mesh2 = mesh.clone();
        mesh2.position.set(3, 0, 0);
        let mesh3 = mesh.clone();
        mesh3.position.set(6, 0, 0);
        let mesh4 = mesh.clone();
        mesh4.position.set(9, 0, 0);


        let group = new THREE.Group();
        group.add(mesh);
        group.add(mesh2);
        group.add(mesh3);
        group.add(mesh4);

        return group;

    }

}
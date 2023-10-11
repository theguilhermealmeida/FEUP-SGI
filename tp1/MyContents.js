import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyFrame} from './MyFrame.js';
import { MyCatmullRoll } from './MyCatmullRom.js';


/**
 *  This class contains the contents of out application
 */

class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */

    constructor(app) {
        this.app = app
        this.axis = null

        const map =
            new THREE.TextureLoader().load( 'textures/uv_grid_opengl.jpg' );

        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;
        this.material = new THREE.MeshLambertMaterial( { map: map,
                        side: THREE.DoubleSide,
                        transparent: true, opacity: 0.90 } );
        this.builder = new MyNurbsBuilder()

        this.meshes = []

        this.samplesU = 16         // maximum defined in MyGuiInterface
        this.samplesV = 16        // maximum defined in MyGuiInterface

        this.init()

        //this.createNurbsSurfaces()  

        //this.createFrameWithCar()

        //this.createSpiral()

        //this.createNewspaper()

        this.createJar()

    }

    /**
     * initializes the contents
     */
    init() {

        // create once
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 1000, 0 );
        pointLight.position.set( 0, 20, 20 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper =
                   new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );
    }

    createFrameWithCar() {
        
        let frame = new MyFrame(this.app, 10, 6, 0.3,[-1,4,0])
        frame.display()

    }

    createSpiral() {
        // Number of points in the spiral
        const numPoints = 1000;
        
        // Radius of the spiral
        const radius = 1;

        // Number of turns in the spiral
        const turns = 5;

        // Create an array to store the points along the spiral
        const points = [];

        // Create a loop which will generate the points along the spiral
        for (let i = 0; i < numPoints; i++) {
            // Calculate the angle for each point along the spiral
            const angle = (i / numPoints) * turns * Math.PI * 2;

            // Calculate the x and y coordinates for the point along the spiral
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = i * 0.005;

            // Add the point to the array
            points.push(new THREE.Vector3(x, y, z));
        }


        let catmull = new MyCatmullRoll(this.app,points,[0,0,0],500)
        catmull.display()

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
                opacity: 0.90 
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
            this.app.scene.add(newspaper);

        }

        createJar() {
            // declare local variables
            let controlPoints;
            let surfaceData;
            let mesh;
            let orderU = 3; // Increased the order for smoother curves
            let orderV = 3; // Increased the order for smoother curves
            let samplesU = 16;
            let samplesV = 16;
        
            let map = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');
        
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 16;
            map.colorSpace = THREE.SRGBColorSpace;
        
            let material = new THREE.MeshLambertMaterial({
                map: map,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.90
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
            let mesh2 = mesh.clone();
            mesh2.rotation.y = -Math.PI;
            mesh2.position.set(0, 0, 0);
            // group the two meshes together
            let jar = new THREE.Group();
            jar.add(mesh);
            jar.add(mesh2);
            this.app.scene.add(jar);
        }
        

        



    /**
     * removes (if existing) and recreates the nurbs surfaces
     */
    createNurbsSurfaces() {  

        // are there any meshes to remove?
        if (this.meshes !== null) {
            // traverse mesh array
            for (let i=0; i<this.meshes.length; i++) {
                // remove all meshes from the scene
                this.app.scene.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }

        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 1
        let orderV = 1

        // build nurb #1
        controlPoints =
            [   // U = 0
                [ // V = 0..1;
                    [-2.0, -2.0, 0.0, 1 ],
                    [-2.0,  2.0, 0.0, 1 ]
                ],
                // U = 1
                [ // V = 0..1
                    [ 2.0, -2.0, 0.0, 1 ],
                    [ 2.0,  2.0, 0.0, 1 ]                                                
                ]
            ]

        surfaceData = this.builder.build(controlPoints,
                      orderU, orderV, this.samplesU,
                      this.samplesV, this.material)  
        mesh = new THREE.Mesh( surfaceData, this.material );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set( -4,3,0 )
        this.app.scene.add( mesh )
        this.meshes.push (mesh)


        // build nurb #2
        controlPoints =
        [   // U = 0
            [ // V = 0..1;
                [ -1.5, -1.5, 0.0, 1 ],
                [ -1.5,  1.5, 0.0, 1 ]
            ],

            // U = 1
                [ // V = 0..1
                    [ 0, -1.5, 3.0, 1 ],
                    [ 0,  1.5, 3.0, 1 ]
                ],

            // U = 2
                [ // V = 0..1
                    [ 1.5, -1.5, 0.0, 1 ],
                    [ 1.5,  1.5, 0.0, 1 ]
                ]
        ]

        surfaceData = this.builder.build(controlPoints,
                        2, 1, this.samplesU,
                        this.samplesV, this.material)  
        mesh = new THREE.Mesh( surfaceData, this.material );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set( 4,3,0 )
        this.app.scene.add( mesh )
        this.meshes.push (mesh)

        // build nurb #3
        controlPoints =
        [   // U = 0
                [ // V = 0..3;
                    [ -1.5, -1.5, 0.0, 1 ],
                    [ -2.0, -2.0, 2.0, 1 ],
                    [ -2.0,  2.0, 2.0, 1 ],
                    [ -1.5,  1.5, 0.0, 1 ]
                ],
            // U = 1
                [ // V = 0..3
                    [ 0.0,  0.0, 3.0, 1 ],
                    [ 0.0, -2.0, 3.0, 1 ],
                    [ 0.0,  2.0, 3.0, 1 ],
                    [ 0.0,  0.0, 3.0, 1 ]        
                ],
            // U = 2
                [ // V = 0..3
                    [ 1.5, -1.5, 0.0, 1 ],
                    [ 2.0, -2.0, 2.0, 1 ],
                    [ 2.0,  2.0, 2.0, 1 ],
                    [ 1.5,  1.5, 0.0, 1 ]
                ]
         ]

        surfaceData = this.builder.build(controlPoints,
                        2, 3, this.samplesU,
                        this.samplesV, this.material)  
        mesh = new THREE.Mesh( surfaceData, this.material );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set(-4,-3,0)
        this.app.scene.add( mesh )
        this.meshes.push (mesh)

        // build nurb #4
        controlPoints =
        [   // U = 0
            [ // V = 0..2;
                [ -2.0, -2.0, 1.0, 1 ],
                [  0, -2.0, 0, 1 ],
                [ 2.0, -2.0, -1.0, 1 ]
            ],
            // U = 1
            [ // V = 0..2
                [  -2.0, -1.0, -2.0, 1 ],
                [ 0, -1.0, -1.0, 1  ],
                [ 2.0, -1.0, 2.0, 1 ]
            ],
            // U = 2
            [ // V = 0..2
                [ -2.0, 1.0, 5.0, 1 ],
                [  0, 1.0, 1.5, 1 ],
                [ 2.0, 1.0, -5.0, 1 ]
            ],
            // U = 3
            [ // V = 0..2
                [ -2.0, 2.0, -1.0, 1 ],
                [ 0, 2.0, 0, 1  ],
                [  2.0, 2.0, 1.0, 1 ]
            ]    
        ]

        surfaceData = this.builder.build(controlPoints,
                        3, 2, this.samplesU,
                        this.samplesV, this.material)  
        mesh = new THREE.Mesh( surfaceData, this.material );
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set( 1,1,1 )
        mesh.position.set(4,-3,0)
        this.app.scene.add( mesh )
        this.meshes.push (mesh)
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     *
     */
    update() {

       
    }
}

export { MyContents };
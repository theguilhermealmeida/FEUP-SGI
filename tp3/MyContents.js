import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyGraphBuilder } from './MyGraphBuilder.js';
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

        this.reader = new MyFileReader(app, this, this.onSceneLoaded);	
		this.reader.open("scenes/t04g10/SGI_TP3_XML_T04_G10.xml");		

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
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {

        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")

        // default material
        let defaultMaterial = {id: "default", color: 0x00ff00, specular: 0x000000, emissive: 0x00000, shininess: 0.0} 
        data.addMaterial(defaultMaterial)
        data.getNode("scene").materialIds[0] = defaultMaterial.id
        console.log(data.getNode("scene").cameras)

        // ambient light
        let red = data.options.ambient.r
        let green = data.options.ambient.g
        let blue = data.options.ambient.b
        let alpha = data.options.ambient.a
        let ambientLight = new THREE.AmbientLight( new THREE.Color(red, green, blue), alpha);
        this.app.scene.add( ambientLight );

        // fog
        let fog = new THREE.Fog( data.fog.color, data.fog.near, data.fog.far );
        this.app.scene.fog = fog;

        // skybox
        let data_skybox = data.skyboxes.default
        let skybox = new THREE.BoxGeometry(...data_skybox.size)
        skybox.translate(...data_skybox.center)
        const skyboxTexturesArray = [
            new THREE.TextureLoader().load(data_skybox.right),
            new THREE.TextureLoader().load(data_skybox.left),
            new THREE.TextureLoader().load(data_skybox.up),
            new THREE.TextureLoader().load(data_skybox.back),
            new THREE.TextureLoader().load(data_skybox.front),
            new THREE.TextureLoader().load(data_skybox.down),
        ]
        let emissive = new THREE.Color(data_skybox.emissive.r, data_skybox.emissive.g, data_skybox.emissive.b)
        const skyBoxMaterialsArray = [
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[0]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[1]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[2]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[3]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[4]}),
            new THREE.MeshPhongMaterial({emissive: emissive, emissiveIntensity: data_skybox.intensity, side: THREE.BackSide, map: skyboxTexturesArray[5]}),
        ];

        // Change texture wrapping and repeat for all textures in the skybox
        for (let i = 0; i < skyboxTexturesArray.length; i++) {
            // Set texture wrapping to RepeatWrapping
            skyboxTexturesArray[i].wrapS = THREE.RepeatWrapping;
            skyboxTexturesArray[i].wrapT = THREE.RepeatWrapping;

            // Set texture repeat - change these values as needed
            skyboxTexturesArray[i].repeat.set(1, 2); // This will repeat the texture twice along S and T axes
            // You can adjust the repeat values for different lengths on the skybox
        }

        let skyboxMesh = new THREE.Mesh(skybox, skyBoxMaterialsArray)
        this.app.scene.add(skyboxMesh)


        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        
        // loop through data camaras and add them to the scene
        this.graphBuilder = new MyGraphBuilder(data)


        const group = this.graphBuilder.buildGraph(data);
        // add group to the scene
        this.app.scene.add(group);

        this.oppCar = group.getObjectByName("redCar");

        this.oppCarRoute = this.oppCar.getObjectByName("route");

        const oppCarRouteControlPoints = this.oppCarRoute.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));

        //get the rotation at each control point
        const oppCarRouteQuarterions = this.oppCarRoute.data.representations[0].controlpoints.map(point => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(point.ry)));

        this.clock = new THREE.Clock();

        this.track = group.getObjectByName("track");

        const trackControlPoints = this.track.data.representations[0].controlpoints.map(point => new THREE.Vector3(point.xx, point.yy, point.zz));

        // at each track control point add a little box to the scene
        // trackControlPoints.forEach(point => {
        //     const geometry = new THREE.BoxGeometry(1, 1, 1);
        //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //     const cube = new THREE.Mesh(geometry, material);
        //     cube.position.set(point.x, point.y, point.z);
        //     this.app.scene.add(cube);
        // }
        // );

        //at each oppCarRoute control point add a little box to the scene
        oppCarRouteControlPoints.forEach(point => {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(point.x, point.y, point.z);
            this.app.scene.add(cube);
        }
        );

        //add the first point to the end to close the loop
        oppCarRouteControlPoints.push(oppCarRouteControlPoints[0]);

        //add the first point to the end to close the loop
        oppCarRouteQuarterions.push(oppCarRouteQuarterions[0]);

        const positionKF = new THREE.VectorKeyframeTrack(
            '.position',
            [...Array(oppCarRouteControlPoints.length).keys()],
            [].concat(...oppCarRouteControlPoints.map(point => [...point.toArray()])),
            THREE.InterpolateSmooth
          );

        const quaternionKF = new THREE.QuaternionKeyframeTrack(
            '.quaternion',
            [...Array(oppCarRouteQuarterions.length).keys()],
            [].concat(...oppCarRouteQuarterions.map(point => [...point.toArray()]))
          );

        const positionClip = new THREE.AnimationClip('OpponentCar', -1, [positionKF]);
        const rotationClip = new THREE.AnimationClip('OpponentCar', -1, [quaternionKF]);

        this.mixer = new THREE.AnimationMixer(this.oppCar);

        const positionAction = this.mixer.clipAction(positionClip);
        const rotationAction = this.mixer.clipAction(rotationClip);

        //change the speed of the animation
        positionAction.timeScale = 0.5;
        rotationAction.timeScale = 0.5;


        positionAction.play();
        rotationAction.play();
    
        // create target pointing to the origin
        const targetObject = new THREE.Object3D();
        targetObject.position.set(0, 0, 0);
        this.app.scene.add(targetObject);
    }

    printGroupInfo(group, ident = 0) {
        for (let child of group.children) {
            if (child.type === "Group") {
                this.printGroupInfo(child, ident +1)
            }
            else {
                console.log("" + new Array((ident + 1) * 4).join(' ') + " - " + child.type + " " + (child.id !== undefined ? "'" + child.id + "'" : ""))
            }
        }
    }

    update() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }
}

export { MyContents };
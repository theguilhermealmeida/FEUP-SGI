import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
import * as THREE from 'three';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective','Perspective2', 'Left', 'Top', 'Front','Right','Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', -30, 30).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', -30, 30).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', -30, 30).name("z coord")
        cameraFolder.open()

         

         // create a folder for the light to turn on and off a light
        const lightFolder = this.datgui.addFolder('Light')
        lightFolder.add(this.contents, 'lightOn').name("light on/off")
        lightFolder.open()


    }
}

export { MyGuiInterface };
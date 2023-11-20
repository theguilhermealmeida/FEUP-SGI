import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

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
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Front','Right','Back', 'Perspective2', 'Orthogonal' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', -30, 30).name("x coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', -30, 30).name("y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', -30, 30).name("z coord")
        cameraFolder.open()


        // add folder to control lights from the the content lights list
        console.log(this.contents.graphBuilder)
        const lights = this.contents.graphBuilder.lights
        const lightsFolder = this.datgui.addFolder('Lights');
        lights.forEach((light, index) => {
            const lightFolder = lightsFolder.addFolder(`${lights[index].type} ${index}`);
            lightFolder.addColor(light, 'color').name('Color');
            lightFolder.add(light, 'intensity', 0, lights[index].intensity).name('Intensity');
            // Add more light parameters
            lightFolder.open(); 
        });


        // add a folder to play and pause the content videos
        const videos = this.contents.graphBuilder.videos
        const videosFolder = this.datgui.addFolder('Videos');
        videos.forEach((video, index) => {
            console.log(this.contents.graphBuilder.videos)
            const videoFolder = videosFolder.addFolder(`video  ${index}`);
            videoFolder.add(video, 'play').name('Play');
            videoFolder.add(video, 'pause').name('Pause');
            // add parameter to change video speed
            videoFolder.add(video, 'playbackRate', 0, 2).name('Speed');
            videoFolder.open(); 
        });




    }
}

export { MyGuiInterface };
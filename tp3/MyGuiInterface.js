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

        console.log("GUI")

        const cameraFolder = this.datgui.addFolder('Cameras')
        const cameras = this.contents.graphBuilder.cameras
        let cameraDropDown = cameraFolder.add(this.app, 'activeCameraName', Object.values(cameras).map(camera => camera["name"])).name("active camera");
        this.app.setActiveCamera(cameras[cameras.length - 1].name)

        cameraDropDown.setValue(cameras[cameras.length - 1].name)

        cameras.forEach((camera, index) => {
            this.app.cameras[camera.name] = camera
        });



        const lights = this.contents.graphBuilder.lights
        const lightsFolder = this.datgui.addFolder('Lights');
        lightsFolder.close();
        lights.forEach((light, index) => {
            const lightFolder = lightsFolder.addFolder(`${lights[index].type} ${index}`);
            lightFolder.addColor(light, 'color').name('Color');
            lightFolder.add(light, 'intensity', 0, lights[index].intensity*2).name('Intensity');
        });


        const videos = this.contents.graphBuilder.videos
        const videosFolder = this.datgui.addFolder('Videos');
        videosFolder.close();
        videos.forEach((video, index) => {
            const videoFolder = videosFolder.addFolder(`video  ${index}`);
            videoFolder.add(video, 'play').name('Play');
            videoFolder.add(video, 'pause').name('Pause');
            videoFolder.add(video, 'playbackRate', 0, 2).name('Speed');
        });

        const shadersFolder = this.datgui.addFolder('Shaders');
        shadersFolder.add(this.contents, 'obstacleShaderSpeed', 0, 10, 0.10).name('Obstacle Speed').onChange(this.contents.updateObstacleShaderSpeed.bind(this.contents));
        shadersFolder.add(this.contents.shaders[2].uniformValues.normScale, 'value', 0, 5, 0.01).name('Norm Scale').onChange((value) => {this.contents.shaders[2].updateUniformsValue("normScale", value)});


        this.datgui.close();


    }
}

export { MyGuiInterface };
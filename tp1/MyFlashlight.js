import * as THREE from 'three';

export class MyFlashlight {
  constructor(app, position, color, direction, tableWidth) {
    this.app = app;
    this.position = position || new THREE.Vector3(0, 0, 0);
    this.color =  0x808080; // Default to white light color
    this.intensity = 1; // Light intensity
    this.direction = direction || false;
    this.tableWidth = tableWidth || 6;

  }

  display() {
    this.cone = new THREE.CylinderGeometry(0.15, 0.08, 0.2,32);
    this.coneMaterial = new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: 1 });
    this.coneMaterial.color.setHex(0xffffff);
    this.coneMaterial.color.offsetHSL(0, 0, -0.5);
    this.coneMesh = new THREE.Mesh(this.cone, this.coneMaterial);
    
    this.cilinder = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 32);
    this.cilinderMaterial = new THREE.MeshBasicMaterial({ color: this.color });
    this.cilinderMesh = new THREE.Mesh(this.cilinder, this.cilinderMaterial);
    
    // create a spotlight light
    

    const flashlightGroup = new THREE.Group();
    flashlightGroup.add(this.coneMesh);
    flashlightGroup.add(this.cilinderMesh);

    // rotate the flashlight
    this.cilinderMesh.position.set(0,0,0);
    this.coneMesh.position.set(0,this.cilinderMesh.geometry.parameters.height/2,0);
    flashlightGroup.position.copy(this.position);   

    if (!this.direction){
        flashlightGroup.rotation.z = -Math.PI/2.2;
        const spotLight = new THREE.SpotLight( this.color, this.intensity );
        spotLight.position.set(flashlightGroup.position.x+0.15, flashlightGroup.position.y+0.1, flashlightGroup.position.z);
    spotLight.target.position.copy(this.position);
    spotLight.target.position.x += this.tableWidth;
    spotLight.intensity = 10
    spotLight.angle = Math.PI/4;
    spotLight.penumbra = 0.15;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.app.scene.add( spotLight.target );
    this.app.scene.add( spotLight );
    }
    else {
        flashlightGroup.rotation.z = Math.PI/2.2;
        const spotLight = new THREE.SpotLight( this.color, this.intensity );
        spotLight.position.set(flashlightGroup.position.x-0.15, flashlightGroup.position.y+0.1, flashlightGroup.position.z);
    spotLight.target.position.copy(this.position);
    spotLight.target.position.x -= this.tableWidth;
    spotLight.intensity = 10
    spotLight.angle = Math.PI/4;
    spotLight.penumbra = 0.15;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.app.scene.add( spotLight.target );
    this.app.scene.add( spotLight );
    }
    // this.cilinderMesh.position.copy(this.position);
    // this.coneMesh.position.set(this.position.x, this.position.y+this.cilinderMesh.geometry.parameters.height/2, this.position.z);

    // this.light = new THREE.SpotLight( this.color, this.intensity );
    // this.light.position.copy(flashlightGroup.position);
    // add a spotlight light to the point of the flashlight


    // const spotLight = new THREE.SpotLight( 0xffffff);
    // spotLight.castShadow = true;
    
    // // spotLight.shadow.mapSize.width = 1024;
    // // spotLight.shadow.mapSize.height = 1024;
    
    // // spotLight.shadow.camera.near = 500;
    // // spotLight.shadow.camera.far = 4000;
    // // spotLight.shadow.camera.fov = 30;
    // spotLight.position.set(flashlightGroup.position.x+0.3, flashlightGroup.position.y, flashlightGroup.position.z);    
    
    // // spotlight lookat middle of table
    // // spotLight.target.position.set(10,flashlightGroup.position.y,0);
    // // spotLight.lookAt(spotLight.target.position);

    // // spotLight.target.position.copy(-10,flashlightGroup.position.y,0);
    // // spotLight.lookAt(spotLight.target.position);
    


    this.app.scene.add(flashlightGroup);
  }
}

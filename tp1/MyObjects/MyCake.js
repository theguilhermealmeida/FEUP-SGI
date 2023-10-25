import * as THREE from 'three';

export class MyCake {
  constructor(app, position, radius, height, color) {
    this.app = app;
    this.color = color || '#8B4513'
    this.radius = radius || 1; 
    this.position = position || new THREE.Vector3(0, 0, 0); 
    this.height = height || 1; 

  }

  display() {
        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: this.color, side: THREE.DoubleSide})

        const cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, Math.PI * 2 * 0.90);
        let cakeMesh = new THREE.Mesh( cake, this.cakeMaterial );
        // cakeMesh.castShadow = true
        // cakeMesh.receiveShadow = true;
        cakeMesh.position.copy(this.position); 

        // plane to cover the cut of the cylinder
        let plane = new THREE.PlaneGeometry(this.height,this.radius);
        let planeMesh = new THREE.Mesh(plane, this.cakeMaterial);
        planeMesh.position.set(this.position.x, this.position.y , this.position.z + this.radius/2);
        planeMesh.rotation.z = (Math.PI / 2);
        planeMesh.rotation.y = (Math.PI / 2);

        // plane to cover the cut of the cylinder
        let plane2 = new THREE.PlaneGeometry(this.height,this.radius);
        let planeMesh2 = new THREE.Mesh(plane, this.cakeMaterial);
        planeMesh2.position.set(this.position.x, this.position.y , this.position.z);
        planeMesh2.rotation.z = (Math.PI / 2);
        planeMesh2.rotation.y = (Math.PI / 2);
        // rotation in relation to the center
        planeMesh2.rotateX(-Math.PI * 2 *0.10);
        // adjust the position
        planeMesh2.position.set(this.position.x - 0.185, this.position.y, this.position.z + this.radius/2 -0.06);


        // group

        let group = new THREE.Group();
        group.add(cakeMesh);
        group.add(planeMesh);
        group.add(planeMesh2);

        this.app.scene.add(group);
  }

}

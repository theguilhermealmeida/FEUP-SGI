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
        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: this.color})

        const cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, Math.PI * 2 * 0.90);
        let cakeMesh = new THREE.Mesh( cake, this.cakeMaterial );
        cakeMesh.position.copy(this.position); 
        this.app.scene.add(cakeMesh);
  }

}

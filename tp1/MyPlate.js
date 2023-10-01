import * as THREE from 'three';

export class MyPlate {
  constructor(app, position, radius, height, color) {
    this.app = app;
    this.color = color || '#8B4513'
    this.radius = radius || 1; 
    this.position = position || new THREE.Vector3(0, 0, 0); 
    this.height = height || 1; 

  }

  display() {
    this.plateMaterial = new THREE.MeshPhongMaterial({ color: this.color})

    let plate = new THREE.CylinderGeometry(this.radius, 0.6*this.radius, this.height, 32 );
    let plateMesh = new THREE.Mesh(plate, this.plateMaterial);
    plateMesh.position.copy(this.position)
    this.app.scene.add( plateMesh );
  }

}

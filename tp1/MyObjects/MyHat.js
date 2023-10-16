import * as THREE from 'three';

export class MyHat {
  constructor(app, position, radius, height, color) {
    this.app = app;
    this.color = color || '#8B4513'
    this.radius = radius || 1; 
    this.position = position || new THREE.Vector3(0, 0, 0); 
    this.height = height || 1; 

  }

  display() {
    this.hatMaterial = new THREE.MeshPhongMaterial({ color: this.color})
    const hat = new THREE.CylinderGeometry(0, this.radius, this.height, 32);
    let hatMesh = new THREE.Mesh(hat, this.hatMaterial);
    hatMesh.position.copy(this.position)
    this.app.scene.add( hatMesh );
  }

}

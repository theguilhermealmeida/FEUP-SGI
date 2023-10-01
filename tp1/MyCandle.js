import * as THREE from 'three';

export class MyCandle {
  constructor(app, position, radius, height, color) {
    this.app = app;
    this.color = color || '#8B4513'
    this.radius = radius || 1; 
    this.position = position || new THREE.Vector3(0, 0, 0); 
    this.height = height || 1; 

  }

  display() {
        this.candleMaterial = new THREE.MeshPhongMaterial({ color: this.color})
        this.flameMaterial = new THREE.MeshPhongMaterial({ color: '#FFA500'})

        const candle = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32);
        let candleMesh = new THREE.Mesh( candle, this.candleMaterial );
        candleMesh.position.copy(this.position); 

        let flameHeight = this.height/5;
        const flame = new THREE.CylinderGeometry(0, this.radius, flameHeight, 32);
        let flameMesh = new THREE.Mesh( flame, this.flameMaterial);
        flameMesh.position.x = this.position.x;
        flameMesh.position.y = this.position.y + this.height/2 + flameHeight/2;
        flameMesh.position.z = this.position.z;

        this.app.scene.add(candleMesh);
        this.app.scene.add(flameMesh);
  }

}

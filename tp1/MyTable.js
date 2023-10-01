import * as THREE from 'three';

export class MyTable{
  constructor(app, tableWidth, tableDepth, tableThickness, tableColor, legHeight, legRadius, position) {
    this.app = app;
    this.tableColor = tableColor || '#8B4513'
    this.legHeight = legHeight || 2.5; // Default leg height is 2.5
    this.legRadius = legRadius || 0.3; // Default leg radius is 0.3
    this.position = position || new THREE.Vector3(0, 0, 0); // Default position is the origin
    this.tableWidth = tableWidth || 6; // Default table width is 6
    this.tableDepth = tableDepth || 4; // Default table width is 4
    this.tableThickness = tableThickness || 0.5; // Default table thickness is 0.5

  }

  display() {
    // Create the table top
    let table = new THREE.BoxGeometry(this.tableWidth, this.tableThickness, this.tableDepth);
    let tableMaterial = new THREE.MeshBasicMaterial({ color: this.tableColor });
    let tableMesh = new THREE.Mesh(table, tableMaterial);
    tableMesh.position.copy(this.position);
    this.app.scene.add(tableMesh);

    // Create the cylindrical legs
    let cylinder = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight, 32);
    for (let i = 0; i < 4; i++) {
      let cylinderMaterial = new THREE.MeshBasicMaterial({ color: this.tableColor });
      let cylinderMesh = new THREE.Mesh(cylinder, cylinderMaterial);
      let legPosition = new THREE.Vector3(
        i % 2 === 0 ? this.position.x - (this.tableWidth/2 - this.legRadius) : this.position.x + (this.tableWidth/2 - this.legRadius),
        this.position.y - this.legHeight / 2,
        i < 2 ? this.position.z - (this.tableDepth/2 - this.legRadius) : this.position.z + (this.tableDepth/2 - this.legRadius)
      );
      cylinderMesh.position.copy(legPosition);
      this.app.scene.add(cylinderMesh);
    }
  }
}

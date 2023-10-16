import * as THREE from 'three';

export class MyChair {
  constructor(app, position, seatSize, backSize, legHeight, legRadius, color) {
    this.app = app;
    this.position = position || new THREE.Vector3(0, 0, 0);
    this.seatSize = seatSize || { width: 1, depth: 1 };
    this.backSize = backSize || { width: 1, height: 1 };
    this.legHeight = legHeight || 1;
    this.legRadius = legRadius || 0.1;
    this.color = color || 0x808080; // Default gray color

  }

  display() {
    // Create the seat geometry (a square)
    const seatGeometry = new THREE.BoxGeometry(this.seatSize.width, 0.1, this.seatSize.depth);
    const seatMaterial = new THREE.MeshPhongMaterial({ color: this.color });
    const seatMesh = new THREE.Mesh(seatGeometry, seatMaterial);
    seatMesh.position.copy(this.position);
    seatMesh.castShadow = true;
    seatMesh.receiveShadow = true;

    // Create the back geometry (a square)
    const backGeometry = new THREE.BoxGeometry(this.backSize.width, this.backSize.height, 0.1);
    const backMaterial = new THREE.MeshPhongMaterial({ color: this.color });
    const backMesh = new THREE.Mesh(backGeometry, backMaterial);
    backMesh.position.set(this.position.x, this.position.y + this.backSize.height / 2, this.position.z - this.seatSize.depth / 2);
    backMesh.castShadow = true;
    backMesh.receiveShadow = true;

    // Create the four chair legs (cylinders)
    const legPositions = [
      new THREE.Vector3(this.position.x - (this.seatSize.width / 2 - this.legRadius), this.position.y - this.legHeight / 2, this.position.z - (this.seatSize.depth / 2 - this.legRadius)),
      new THREE.Vector3(this.position.x + (this.seatSize.width / 2 - this.legRadius), this.position.y - this.legHeight / 2, this.position.z - (this.seatSize.depth / 2 - this.legRadius)),
      new THREE.Vector3(this.position.x - (this.seatSize.width / 2 - this.legRadius), this.position.y - this.legHeight / 2, this.position.z + (this.seatSize.depth / 2 - this.legRadius)),
      new THREE.Vector3(this.position.x + (this.seatSize.width / 2 - this.legRadius), this.position.y - this.legHeight / 2, this.position.z + (this.seatSize.depth / 2 - this.legRadius)),
    ];

    const legGeometry = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight, 32);
    const legMaterial = new THREE.MeshPhongMaterial({ color: this.color });

    const legs = new THREE.Group();

    legPositions.forEach((position) => {
      const legMesh = new THREE.Mesh(legGeometry, legMaterial);
      legMesh.position.copy(position);
      legMesh.castShadow = true;
      legMesh.receiveShadow = true;
      legs.add(legMesh);
    });

    // Add all chair components to a group
    const chairGroup = new THREE.Group();
    chairGroup.add(seatMesh);
    chairGroup.add(backMesh);
    chairGroup.add(legs);

    this.app.scene.add(chairGroup);
  }
}

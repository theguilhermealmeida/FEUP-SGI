import * as THREE from 'three';

class MyPolygon {
    constructor(geometryData) {
        this.geometryData = geometryData;
        this.representations = geometryData.representations[0];
        this.radius = this.representations.radius;
        this.stacks = this.representations.stacks;
        this.slices = this.representations.slices;
        this.color_c = new THREE.Color(this.representations.color_c.r, this.representations.color_c.g, this.representations.color_c.b);
        this.color_p = new THREE.Color(this.representations.color_p.r, this.representations.color_p.g, this.representations.color_p.b);

        this.buffer = new THREE.BufferGeometry();
        this.init();
        return this.buffer
    }

    init() {
        const vertices = this.calculateVertices();

        const positions = []
        const normals = []
        const colors = []

        const pA = new THREE.Vector3();
        const pB = new THREE.Vector3();
        const pC = new THREE.Vector3();

        const cb = new THREE.Vector3();
        const ab = new THREE.Vector3();

        for (let stack = 0; stack < this.stacks; stack++) {
            let alpha = stack / (this.stacks - 1)
            let color = new THREE.Color().lerpColors(this.color_c, this.color_p, alpha)
            for (let slice = 0; slice < this.slices; slice++) {
                let ax = 0, ay = 0, az = 0, bx = 0, by = 0, bz = 0, cx = 0, cy = 0, cz = 0
                let nx = 0, ny = 0, nz = 0

                ax = vertices[stack][slice][0]
                ay = vertices[stack][slice][1]
                az = vertices[stack][slice][2]

                bx = vertices[(stack + 1) % this.stacks][slice][0]
                by = vertices[(stack + 1) % this.stacks][slice][1]
                bz = vertices[(stack + 1) % this.stacks][slice][2]

                cx = vertices[(stack + 1) % this.stacks][(slice + 1) % this.slices][0]
                cy = vertices[(stack + 1) % this.stacks][(slice + 1) % this.slices][1]
                cz = vertices[(stack + 1) % this.stacks][(slice + 1) % this.slices][2]

                positions.push(ax, ay, az)
                positions.push(bx, by, bz)
                positions.push(cx, cy, cz)

                // flat face normals
                pA.set(ax, ay, az);
                pB.set(bx, by, bz);
                pC.set(cx, cy, cz);

                cb.subVectors(pC, pB);
                ab.subVectors(pA, pB);
                cb.cross(ab);

                cb.normalize();

                nx = cb.x;
                ny = cb.y;
                nz = cb.z;

                normals.push(nx, ny, nz);
                normals.push(nx, ny, nz);
                normals.push(nx, ny, nz);

                // colors
                colors.push(color.r, color.g, color.b);
                colors.push(color.r, color.g, color.b);
                colors.push(color.r, color.g, color.b);

                if (stack !== 0) {
                    ax = vertices[stack][slice][0]
                    ay = vertices[stack][slice][1]
                    az = vertices[stack][slice][2]

                    bx = vertices[stack][(slice - 1 + this.slices) % this.slices][0]
                    by = vertices[stack][(slice - 1 + this.slices) % this.slices][1]
                    bz = vertices[stack][(slice - 1 + this.slices) % this.slices][2]

                    cx = vertices[(stack + 1) % this.stacks][slice][0]
                    cy = vertices[(stack + 1) % this.stacks][slice][1]
                    cz = vertices[(stack + 1) % this.stacks][slice][2]

                    positions.push(ax, ay, az)
                    positions.push(bx, by, bz)
                    positions.push(cx, cy, cz)

                    // flat face normals
                    pA.set(ax, ay, az);
                    pB.set(bx, by, bz);
                    pC.set(cx, cy, cz);

                    cb.subVectors(pC, pB);
                    ab.subVectors(pA, pB);
                    cb.cross(ab);

                    cb.normalize();

                    nx = cb.x;
                    ny = cb.y;
                    nz = cb.z;

                    normals.push(nx, ny, nz);
                    normals.push(nx, ny, nz);
                    normals.push(nx, ny, nz);

                    // colors
                    colors.push(color.r, color.g, color.b);
                    colors.push(color.r, color.g, color.b);
                    colors.push(color.r, color.g, color.b);
                }
            }

        }

        function disposeArray() {
            this.array = null;
        }

        this.buffer.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
        this.buffer.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray));
        this.buffer.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3).onUpload(disposeArray));

    }

    calculateVertices() {
        const vertices = [];
        const angle = (Math.PI * 2) / this.slices;
        const stack_radius = this.radius / this.stacks;

        let temp = []
        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                temp.push([Math.cos(angle*j) * (i*stack_radius), Math.sin(angle*j) * (i*stack_radius), 0])
            }
            vertices.push(temp)
            temp = []
        }

        return vertices;
    }
    
}

export { MyPolygon };

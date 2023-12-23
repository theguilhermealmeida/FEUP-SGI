import * as THREE from 'three';

class MyTextRenderer {
    constructor(app) {
        this.app = app;
        this.spriteSheet = 'scenes/t04g10/sprites/x05mo.png';
        this.spriteSheetWidth = 300;
        this.spriteSheetHeight = 160;
        this.charWidth = 20;
        this.charHeight = 20;
    }

    createText(text, position) {
        let currentX = position.x;

        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const charCode = character.charCodeAt(0);
            if (charCode >= 32 && charCode <= 126) { // considering ASCII printable characters
                const texture = new THREE.TextureLoader().load(this.spriteSheet);
                const material = new THREE.MeshBasicMaterial({ map: texture });

                const geometry = new THREE.PlaneGeometry(this.charWidth, this.charHeight);
                const letterPlane = new THREE.Mesh(geometry, material);

                const columns = Math.floor(this.spriteSheetWidth / this.charWidth);
                const rows = Math.floor(this.spriteSheetHeight / this.charHeight);
                
                const column = (charCode - 32) % columns;
                const row = Math.floor((charCode - 32) / columns);

                const offsetX = column / columns;
                const offsetY = 1 - ((row + 1) / rows);

                texture.repeat.set(1 / columns, 1 / rows);
                texture.offset.set(offsetX, offsetY);

                letterPlane.position.set(currentX, position.y, position.z);

                currentX += this.charWidth; // Increment for next character's position

                this.app.scene.add(letterPlane);
            }
        }
    }
}

export { MyTextRenderer };

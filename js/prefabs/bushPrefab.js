import { gamePrefs } from '../globals.js';

export default class bushPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _bush) {
        super(_scene, _bush.posX, _bush.posY, _bush.spriteTag);

        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 

        this.scene = _scene;
        this.playerOverlapping = false; 

        this.setColliders();
        this.setupKeyInput();
    }

    setColliders() {
        this.scene.physics.add.collider(
            this.scene.link,
            this,           
            () => {
                this.playerOverlapping = true; 
            },
            null,
            this
        );

        this.scene.physics.add.overlap(
            this.scene.link,
            this,
            () => {
                this.playerOverlapping = false; 
            },
            null,
            this
        );
    }

    setupKeyInput() {
        // Detectar la tecla "E"
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerOverlapping) {
                this.destroy(); 
            }
        });
    }
}


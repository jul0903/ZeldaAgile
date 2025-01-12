import { gamePrefs } from '../globals.js';

export default class bushPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _bush) {
        super(_scene, _bush.posX, _bush.posY, _bush.spriteTag);

        // Añadir el sprite al juego
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        // Configurar el cuerpo físico del arbusto
        this.body.setAllowGravity(false); // Sin gravedad para el arbusto
        this.body.setImmovable(true);    // No se moverá al colisionar

        this.scene = _scene;
        this.playerOverlapping = false; // Indicador de colisión física con el jugador

        this.setColliders();
        this.setupKeyInput();
    }

    setColliders() {
        // Detectar colisión física (no puede atravesarlo)
        this.scene.physics.add.collider(
            this.scene.link, // El jugador
            this,            // Este arbusto
            () => {
                this.playerOverlapping = true; // Marcar que está colisionando
            },
            null,
            this
        );

        // Detectar cuando el jugador deja de colisionar
        this.scene.physics.add.overlap(
            this.scene.link,
            this,
            () => {
                this.playerOverlapping = false; // Ya no hay contacto
            },
            null,
            this
        );
    }

    setupKeyInput() {
        // Detectar la tecla "E"
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerOverlapping) {
                this.destroy(); // Destruir el arbusto
            }
        });
    }
}


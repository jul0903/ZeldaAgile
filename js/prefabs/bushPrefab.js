import { gamePrefs } from '../globals.js';

export default class bushPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _bush) {
        super(_scene, _bush.posX, _bush.posY, _bush.spriteTag);

        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 

        this.scene = _scene;
        // Registramos el _listener_ de teclado y guardamos su referencia
        this.setupKeyInput();

        // (Opcional) Si tienes otros colisionadores, los configuras aquí
        this.setColliders();
    }

    setColliders() {
        // Puedes mantener o modificar esta configuración si la usas para otras lógicas.
        this.scene.physics.add.collider(
            this.scene.link,
            this,           
            () => {
                // Lógica de colisión (si la necesitas)
            },
            null,
            this
        );
    }

    /**
     * Comprueba si dos objetos se están solapando comprobando sus bounds.
     * @param {Phaser.GameObjects.GameObject} obj1 
     * @param {Phaser.GameObjects.GameObject} obj2 
     * @returns {boolean} True si se solapan, false en caso contrario.
     */
    isOverlapping(obj1, obj2) {
        const bounds1 = obj1.getBounds();
        const bounds2 = obj2.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
    }

    setupKeyInput() {
        // Registramos la tecla "E" y guardamos la referencia del _listener_
        this.keyEListener = (event) => {
            // Comprueba en el momento de la pulsación si el jugador y el arbusto se solapan
            // Antes de acceder, se puede verificar que this.scene y this.scene.link existan.
            if (this.scene && this.scene.link && this.isOverlapping(this.scene.link, this)) {
                this.destroy();
            }
        };

        this.scene.input.keyboard.on('keydown-E', this.keyEListener);
    }

    destroy() {
        // Remover el _listener_ de teclado asociado a este bush
        this.scene.input.keyboard.off('keydown-E', this.keyEListener);
        // Llamar al método destroy original
        super.destroy();
    }
}


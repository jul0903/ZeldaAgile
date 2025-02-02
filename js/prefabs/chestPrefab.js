import { gamePrefs } from '../globals.js';
import linkPrefab from './linkPrefab.js';

export default class chestPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _chest) {
        super(_scene, _chest.posX, _chest.posY, _chest.spriteTag);

        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 

        this.scene = _scene;

        this.setupKeyInput();
        this.setColliders();
    }

    setColliders() {
        // Si deseas tener alguna lógica en la colisión, puedes agregarla aquí.
        // En este caso se podría mantener para otras comprobaciones.
        this.scene.physics.add.collider(
            this.scene.link,
            this,
            () => {
                // Aquí podrías incluir lógica de colisión si es necesaria.
            },
            null,
            this
        );
    }

    isOverlapping(obj1, obj2) {
        const bounds1 = obj1.getBounds();
        const bounds2 = obj2.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
    }

    setupKeyInput() {
        // Registramos la tecla "E" y guardamos la referencia del listener.
        this.keyEListener = (event) => {
            // Comprobamos que exista la escena y el jugador, y que estén en solapamiento.
            if (this.scene && this.scene.link && this.isOverlapping(this.scene.link, this)) {
                // Si el jugador tiene la llave...
                if (this.scene.link.hasKey === true) {
                    this.dialogue = "¡Has ganado!";
                    this.showDialogue();
                    // Destruye el chest después de mostrar el diálogo (puedes ajustar el retraso si lo deseas)
                    this.scene.time.delayedCall(1000, () => {
                        this.destroy();
                    });
                } else {
                    // Si el jugador no tiene la llave
                    this.dialogue = "Necesitas una llave";
                    this.showDialogue();
                }
            }
        };

        this.scene.input.keyboard.on('keydown-E', this.keyEListener);
    }

    showDialogue() {
        // Se crea el diálogo en la parte inferior de la pantalla, fijado en la UI
        const dialogueBox = this.scene.add.image(
            this.scene.game.config.width / 2,
            this.scene.game.config.height - 20,
            'dialogueBox'
        );
        dialogueBox.setScrollFactor(0);

        // Se crea el texto con la fuente bitmap 'textFont'
        const dialogueText = this.scene.add.bitmapText(
            this.scene.game.config.width / 2,
            this.scene.game.config.height - 20,
            'textFont',
            this.dialogue,
            10 // Tamaño de fuente
        );
        dialogueText.setOrigin(0.5);
        dialogueText.setScrollFactor(0);

        // Se elimina el diálogo después de 3 segundos
        this.scene.time.delayedCall(3000, () => {
            dialogueBox.destroy();
            dialogueText.destroy();
        });
    }

    destroy() {
        // Removemos el listener de teclado antes de destruir el objeto
        this.scene.input.keyboard.off('keydown-E', this.keyEListener);
        super.destroy();
    }
}

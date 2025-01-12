export default class npcPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _npc) {
        console.log('NPC creado en:', _npc.posX, _npc.posY);
        super(_scene, _npc.posX, _npc.posY, _npc.spriteTag);

        // Añadir el sprite al juego
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        // Configurar el cuerpo físico del NPC
        this.body.setAllowGravity(false); // Sin gravedad para el NPC
        this.body.setImmovable(true);    // No se moverá al colisionar

        this.scene = _scene;
        this.dialogue = _npc.dialogue;  // Guardar el diálogo del NPC
        this.playerOverlapping = false; // Indicador de contacto con el jugador

        this.setColliders();
        this.setupKeyInput();
        this.loadAnimations();
        this.play('npc1Idle');
    }

    loadAnimations(){
        this.anims.create({
            key: 'npc1Idle',
            frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

    }
    setColliders() {
        // Detectar colisión física con el jugador
        this.scene.physics.add.collider(
            this.scene.link, // El jugador
            this,            // Este NPC
            () => {
                this.playerOverlapping = true; // Marcar que está en contacto
                console.log('Jugador en contacto con NPC');
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
                console.log('Jugador fuera del contacto con NPC');
            },
            null,
            this
        );
    }

    setupKeyInput() {
        // Detectar la tecla "E"
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerOverlapping) {
                console.log(`NPC dice: "${this.dialogue}"`);
                this.showDialogue(); // Mostrar el diálogo
            }
        });
    }

    showDialogue() {
        // Aquí puedes personalizar cómo mostrar el diálogo
        const style = { font: '16px Arial', fill: '#ffffff', backgroundColor: '#000000' };
        const dialogueText = this.scene.add.text(this.x, this.y - 20, this.dialogue, style);
        dialogueText.setOrigin(0.5);

        // Ocultar el diálogo después de 3 segundos
        this.scene.time.delayedCall(3000, () => {
            dialogueText.destroy();
        });
    }
}

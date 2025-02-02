export default class npcPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _npc) {
        console.log('NPC creado en:', _npc.posX, _npc.posY);
        super(_scene, _npc.posX, _npc.posY, _npc.spriteTag);

        // Añadir el sprite al juego y habilitar la física
        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        // Configuración del cuerpo físico
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setSize(16, 24).setOffset(0, 0);

        this.scene = _scene;
        this.dialogue = _npc.dialogue; // Guardamos el diálogo del NPC
        this.playerOverlapping = false; // Indica si el jugador está en contacto
        this.dialogueDisplayed = false; // Evita mostrar el diálogo repetidamente

        // Guardamos el tipo del NPC (en este caso, se usará para distinguir al npc2)
        this.npcType = _npc.spriteTag;

        this.setColliders();
        this.setupKeyInput();
        this.loadAnimations();

        const idleAnimation = `${_npc.spriteTag}Idle`;
        if (this.anims.exists(idleAnimation)) {
            this.play(idleAnimation);
        }
    }

    loadAnimations() {
        this.anims.create({
            key: 'npc1Idle',
            frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'npc2Idle',
            frames: this.anims.generateFrameNumbers('npc', { start: 2, end: 3 }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'npc3Idle',
            frames: this.anims.generateFrameNumbers('npc', { start: 4, end: 5 }),
            frameRate: 2,
            repeat: -1
        });
    }

    setColliders() {
        // Detectar colisión con el jugador para actualizar el flag
        this.scene.physics.add.collider(
            this.scene.link,
            this,
            () => {
                this.playerOverlapping = true;
                this.dialogueDisplayed = false; // Reinicia el flag al entrar en contacto
                console.log('Jugador en contacto con NPC');
            },
            null,
            this
        );

        // Detectar cuando el jugador deja de solaparse
        this.scene.physics.add.overlap(
            this.scene.link,
            this,
            () => {
                this.playerOverlapping = false;
                console.log('Jugador fuera del contacto con NPC');
                this.dialogueDisplayed = false; // Reinicia el flag al salir
            },
            null,
            this
        );
    }

    setupKeyInput() {
        // Detectar la tecla "E" solo cuando el jugador está en contacto con el NPC
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerOverlapping && !this.dialogueDisplayed) {
                if (this.npcType === 'npc2') {
                    // Si es el npc2, se evalúa si el jugador ya tiene la espada
                    if (this.scene.link.hasSword) {
                        // Si ya tiene la espada, muestra el mensaje alternativo
                        this.showDialogue("Suerte, Link");
                    } else {
                        // Si no la tiene, da la espada y muestra el diálogo original
                        this.scene.link.hasSword = true;
                        this.scene.link.addSwordUI();
                        this.showDialogue(this.dialogue); // Por ejemplo: "toma tu espadita"
                    }
                } else {
                    // Para otros NPCs, se muestra el diálogo configurado
                    this.showDialogue();
                }
                this.dialogueDisplayed = true; // Evita que se vuelva a mostrar inmediatamente
            }
        });
    }

    // Permite pasar un mensaje opcional; si no se pasa, usa this.dialogue
    showDialogue(message) {
        const dialogueMessage = message || this.dialogue;
        // Crear el diálogo box en la parte inferior, fijado en la UI
        const dialogueBox = this.scene.add.image(
            this.scene.game.config.width / 2,
            this.scene.game.config.height - 20,
            'dialogueBox'
        );
        dialogueBox.setScrollFactor(0);

        // Crear el texto utilizando la fuente bitmap 'textFont'
        const dialogueText = this.scene.add.bitmapText(
            this.scene.game.config.width / 2,
            this.scene.game.config.height - 20,
            'textFont',
            dialogueMessage,
            10 // tamaño de la fuente
        );
        dialogueText.setOrigin(0.5);
        dialogueText.setScrollFactor(0);

        // Mostrar el diálogo y eliminarlo después de 3 segundos
        this.scene.time.delayedCall(3000, () => {
            dialogueBox.destroy();
            dialogueText.destroy();
        });
    }
}

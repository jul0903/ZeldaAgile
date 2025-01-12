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
        this.dialogueDisplayed = false; // Para evitar repetir el diálogo

        this.setColliders();
        this.setupKeyInput();
        this.loadAnimations();
        this.play('npc1Idle');
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
        // Detectar colisión con el jugador
        this.scene.physics.add.collider(
            this.scene.link, // El jugador
            this,            // Este NPC
            () => {
                this.playerOverlapping = true; // El jugador está en contacto con el NPC
                this.dialogueDisplayed = false; // Reiniciar el flag cuando el jugador vuelve a estar en contacto
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
                this.playerOverlapping = false; // El jugador ya no está en contacto
                console.log('Jugador fuera del contacto con NPC');
                this.dialogueDisplayed = false; // Reiniciar el flag del diálogo cuando el jugador deje de estar en contacto
            },
            null,
            this
        );
    }

    setupKeyInput() {
        // Detectar la tecla "E" solo cuando está colisionando
        this.scene.input.keyboard.on('keydown-E', () => {
            if (this.playerOverlapping && !this.dialogueDisplayed) {
                console.log(`NPC dice: "${this.dialogue}"`);
                this.showDialogue(); // Mostrar el diálogo solo si está en contacto
            }
        });
    }

    showDialogue() {
        // Crear el diálogo box en la parte inferior, fijado en la UI
        const dialogueBox = this.scene.add.image(this.scene.game.config.width / 2, this.scene.game.config.height - 30, 'dialogueBox');
        dialogueBox.setOrigin(0.5);  // Centrar la imagen
        dialogueBox.setScale(0.8);   // No cambiar la escala, ya que ya la has reducido
        dialogueBox.setScrollFactor(0);  // Fijar en UI
    
        // Estilo para el texto sin fondo negro y con borde azul
        const style = {
            font: '12px Arial', 
            fill: '#ffffff', // Color del texto
            stroke: '#0000ff', // Borde azul
            strokeThickness: 3, // Grosor del borde
            wordWrap: { width: 800, useAdvancedWrap: true }
        };
    
        // Crear el texto dentro del box, alineado en el centro
        const dialogueText = this.scene.add.text(this.scene.game.config.width / 2, this.scene.game.config.height - 30, this.dialogue, style);
        dialogueText.setOrigin(0.5);  // Alinear el texto en el centro
        dialogueText.setScrollFactor(0);  // Fijar el texto en UI
    
        // Mostrar el diálogo y eliminarlo después de 3 segundos
        this.scene.time.delayedCall(3000, () => {
            dialogueBox.destroy();   // Eliminar el dialogueBox
            dialogueText.destroy();  // Eliminar el texto
        });

        this.dialogueDisplayed = true; // Marcar que el diálogo ya ha sido mostrado
    }    
}

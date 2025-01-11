import {gamePrefs} from '../globals.js';

export default class linkPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='link')
    { //instanciar el objeto
        super(_scene,_posX,_posY,_spriteTag);

        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.link = this;
        this.scene = _scene;

        this.body.setSize(16, 26, true).setOffset(0, 0);
        this.setColliders();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.createInputKeys(); 

        this.loadAnimations();
        this.anims.play('idleDown',true);

        this.hp = gamePrefs.LINK_MAXHEALTH;   
        this.maxHealh = gamePrefs.LINK_MAXHEALTH;   
    }

   loadAnimations()
   {
        this.anims.create({
            key: 'idleRight',
            frames: [{ key: 'linkWalk', frame: 9 }], 
            frameRate: 1, // Aunque solo es un frame, no se usa 0
            repeat: -1    
        });
        
        this.anims.create({
            key: 'idleUp',
            frames: [{ key: 'linkWalk', frame: 18 }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'idleDown',
            frames: [{ key: 'linkWalk', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });    

        this.anims.create(
        {
            key: 'walkDown',
            frames:this.anims.generateFrameNumbers('linkWalk', {start:0, end:8}),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'walkRight',
            frames:this.anims.generateFrameNumbers('linkWalk', {start:9, end:16}),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'walkUp',
            frames:this.anims.generateFrameNumbers('linkWalk', {start:18, end:26}),
            frameRate: 30,
            repeat: -1
        });    

        this.anims.create(
        {
            key: 'attackLeft',
            frames:this.anims.generateFrameNumbers('linkSword', {start:0, end:6}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'attackUp',
            frames:this.anims.generateFrameNumbers('linkSword', {start:7, end:12}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'attackDown',
            frames:this.anims.generateFrameNumbers('linkSword', {start:14, end:20}),
            frameRate: 10,
            repeat: 0
        });    
   }

    createInputKeys() {
    this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    setColliders()
    {
        this.scene.physics.add.collider
        (
            this,
            this.scene.walls
        );        
    }

    updateHealthBar() {
        if (this.healthBar) {  // Asegúrate de que healthBar está definido
            if (this.hp === 3) {
                this.healthBar.setFrame(3);  // Con 3 corazones llenos
            } else if (this.hp === 2) {
                this.healthBar.setFrame(2);  // Con 2 corazones
            } else if (this.hp === 1) {
                this.healthBar.setFrame(1);  // Con 1 corazón
            } else if (this.hp === 0) {
                this.healthBar.setFrame(0);  // Sin corazones (muerte)
            }
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;  // Limitar la salud a 0
        this.updateHealthBar();  // Actualizar la barra de vida
    }

    // Método para curar al jugador
    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHealth) this.hp = this.maxHealth;  // Limitar la salud máxima
        this.updateHealthBar();  // Actualizar la barra de vida
    }

    handleAttack() {
        if (this.attackKey.isDown) {
            console.log("E");

            // Detener cualquier animación previa
            this.anims.stop();
            
            // Detener movimiento mientras atacas
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);

            switch (this.lastDirection) {
                case 'left':
                    this.anims.play('attackLeft', true);
                    console.log("left");
                    break;
                case 'right':
                    this.setFlipX(true); 
                    this.anims.play('attackLeft', true);
                    console.log("right");
                    break;
                case 'up':
                    this.anims.play('attackUp', true);
                    console.log("up");
                    break;
                case 'down':
                    this.anims.play('attackDown', true);
                    console.log("down");
                    break;
            }
        }
    }

    attack() {
        console.log('Link ha atacado!');
        // Puedes añadir aquí una animación, proyectil, o cualquier acción
        this.anims.play('attack', true);  // Si tienes una animación de ataque
    }

    preUpdate(time, delta) {

        this.handleAttack();

        if (!this.lastDirection) this.lastDirection = 'down'; 
    
        if (this.cursors.left.isDown) { 
            //izquierda
            this.body.setVelocityX(-gamePrefs.LINK_SPEED);
            this.body.setVelocityY(0); // Para evitar movimientos diagonales
            this.setFlipX(true); 
            this.anims.play('walkRight', true); 
            this.lastDirection = 'left'; 
        } else if (this.cursors.right.isDown) {
            //derecha
            this.body.setVelocityX(gamePrefs.LINK_SPEED);
            this.body.setVelocityY(0);
            this.setFlipX(false);
            this.anims.play('walkRight', true);
            this.lastDirection = 'right';
        } else if (this.cursors.up.isDown) {
            //arriba
            this.body.setVelocityY(-gamePrefs.LINK_SPEED);
            this.body.setVelocityX(0);
            this.setFlipX(false);
            this.anims.play('walkUp', true);
            this.lastDirection = 'up';
        } else if (this.cursors.down.isDown) {
            //abajo
            this.body.setVelocityY(gamePrefs.LINK_SPEED);
            this.body.setVelocityX(0);
            this.setFlipX(false);
            this.anims.play('walkDown', true);
            this.lastDirection = 'down';
        } else {
            //idle
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            switch (this.lastDirection) {
                case 'left':
                    this.setFlipX(true);
                    this.anims.play('idleRight', true); 
                    break;
                case 'right':
                    this.setFlipX(false);
                    this.anims.play('idleRight', true);
                    break;
                case 'up':
                    this.anims.play('idleUp', true);
                    break;
                case 'down':
                    this.anims.play('idleDown', true);
                    break;
            }
        }

        super.preUpdate(time, delta);
    }
}
import { gamePrefs } from '../globals.js';

export default class enemiesPrefab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'enemies');
        this.scene = scene;
        this.type = type; // 'mele' o 'ranger'
        this.player = player; // Referencia al jugador
        this.range = 40; // Rango de detección
        this.speed = type === 'mele' ? 50 : 30; // Velocidad según tipo
        this.attacking = false;

        // Configuración inicial
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setSize(27, 38).setOffset(0, 0);

        // Variables de movimiento
        this.initialX = x; // Posición inicial
        this.patrolDistance = 40; // Distancia de patrullaje en píxeles
        this.speed = 50; // Velocidad en píxeles por segundo
        this.movingRight = true; // Dirección inicial

        // Animaciones
        this.loadAnimations();
        this.anims.play('meleIdleRight', true); // Animación inicial

        this.setColliders();
    }

   loadAnimations()
   {
    //IDLE
        //MELE
        this.anims.create({
            key: 'meleIdleRight',
            frames: [{ key: 'enemies', frame: 4 }], 
            frameRate: 1, // Aunque solo es un frame, no se usa 0
            repeat: -1    
        });

        //MELE
        this.anims.create({
            key: 'meleIdleLeft',
            frames: [{ key: 'enemies', frame: 4 }], 
            frameRate: 1, 
            repeat: -1    
        });
        
        this.anims.create({
            key: 'meleIdleUp',
            frames: [{ key: 'enemies', frame: 8 }],
            frameRate: 1,
            repeat: -1
        });
        
        this.anims.create({
            key: 'meleIdleDown',
            frames: [{ key: 'enemies', frame: 0 }],
            frameRate: 1,
            repeat: -1
        });    

        //RANGER
        this.anims.create({
            key: 'rangerIdleRight',
            frames: [{ key: 'enemies', frame: 16 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'rangerIdleLeft',
            frames: [{ key: 'enemies', frame: 16 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'rangerIdleUp',
            frames: [{ key: 'enemies', frame: 20 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'rangerIdleDown',
            frames: [{ key: 'enemies', frame: 12 }], 
            frameRate: 1, 
            repeat: -1    
        });

    //WALKING
        //MELE
        this.anims.create(
        {
            key: 'meleWalkDown',
            frames:this.anims.generateFrameNumbers('enemies', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'meleWalkRight',
            frames:this.anims.generateFrameNumbers('enemies', {start:4, end:6}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'meleWalkLeft',
            frames:this.anims.generateFrameNumbers('enemies', {start:4, end:6}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'meleWalkUp',
            frames:this.anims.generateFrameNumbers('enemies', {start:8, end:11}),
            frameRate: 10,
            repeat: -1
        });    

        //RANGER
        this.anims.create(
        {
            key: 'rangerWalkDown',
            frames:this.anims.generateFrameNumbers('enemies', {start:12, end:15}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerWalkRight',
            frames:this.anims.generateFrameNumbers('enemies', {start:16, end:18}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerWalkLeft',
            frames:this.anims.generateFrameNumbers('enemies', {start:16, end:18}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerWalkUp',
            frames:this.anims.generateFrameNumbers('enemies', {start:20, end:23}),
            frameRate: 10,
            repeat: -1
        });    
   
   //ATACK
        //RANGER
        this.anims.create(
        {
            key: 'rangerAtackDown',
            frames:this.anims.generateFrameNumbers('enemies', {start:24, end:26}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerAtackRight',
            frames:this.anims.generateFrameNumbers('enemies', {start:28, end:30}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerAtackLeft',
            frames:this.anims.generateFrameNumbers('enemies', {start:28, end:30}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'rangerAtackUp',
            frames:this.anims.generateFrameNumbers('enemies', {start:32, end:34}),
            frameRate: 10,
            repeat: -1
        });   
    } 

    move(delta) {
        if (this.isChasing) return;
    
        const velocity = this.speed * delta / 1000;
    
        if (this.movingRight) {
            this.x += velocity;
            if (this.x >= this.initialX + this.patrolDistance) {
                this.movingRight = false;
                this.anims.play('meleWalkRight', true);
                this.setFlipX(true);
            }
        } else {
            this.x -= velocity;
            if (this.x <= this.initialX) {
                this.movingRight = true;
                this.anims.play('meleWalkRight', true);
                this.setFlipX(false);
            }
        }
    }
    

    update(time, delta) {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
    
        if (distanceToPlayer <= this.range) {
            // Si el jugador está en rango, perseguir
            this.isChasing = true;
            this.scene.physics.moveToObject(this, this.player, this.speed + 40);
    
            // Cambiar animación según la dirección
            if (this.body.velocity.x > 0) {
                if (this.anims.currentAnim.key !== 'meleWalkRight') {
                    this.anims.play('meleWalkRight', true);
                }
                this.setFlipX(false);
            } else if (this.body.velocity.x < 0) {
                if (this.anims.currentAnim.key !== 'meleWalkLeft') {
                    this.anims.play('meleWalkLeft', true);
                }
                this.setFlipX(true);
            } else if (this.body.velocity.y < 0) {
                if (this.anims.currentAnim.key !== 'meleWalkUp') {
                    this.anims.play('meleWalkUp', true);
                }
            } else if (this.body.velocity.y > 0) {
                if (this.anims.currentAnim.key !== 'meleWalkDown') {
                    this.anims.play('meleWalkDown', true);
                }
            }
        } else {
            // Si el jugador está fuera de rango, patrullar
            if (this.isChasing) {
                this.isChasing = false;
                this.body.setVelocity(0); // Detener movimiento
            }
            this.move(delta);
        }
    }
    
    /*
    shootArrow() {
        const arrow = new Arrow(this.scene, this.x, this.y, this.player);
        arrow.fire();
    }
    */

    setColliders() {
        // Colisión con paredes
        if (this.scene.walls) {
            console.log("Colisión con paredes configurada");
            this.scene.physics.add.collider(this, this.scene.walls);
        }

        // Colisión con el jugador (Link)
        if (this.scene.link) {
            console.log("Colisión con Link configurada");
            this.scene.physics.add.collider(this, this.scene.link, () => {
                if (this.type === 'mele') {
                    console.log("Link recibe daño");
                    // Daño al jugador por colisión
                    if (this.scene.link.takeDamage) {
                        this.scene.link.takeDamage(1); // Método para restar corazones
                    }
                }
            });
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.body.velocity.x > 0) {
            this.anims.play('meleWalkRight', true);
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.anims.play('meleWalkRight', true);
            this.setFlipX(true);
        }
    }
}
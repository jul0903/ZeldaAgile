import { gamePrefs } from '../globals.js';

export default class enemiesPrefab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'enemies');
        this.scene = scene;
        this.type = type; // 'mele' o 'ranger'
        this.player = player; // Referencia al jugador
        this.area = 40; // Rango de detección
        this.attacking = false;
        // Configuración inicial
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setSize(27, 38).setOffset(0, 0);

        // Variables de movimiento
        this.initialX = x; // Posición inicial
        this.patrolDistance = 40; // Distancia de patrullaje en píxeles
        this.speed = type === 'mele' ? 30 : 10; // Velocidad según tipo
        this.movingRight = true; // Dirección inicial

        // Animaciones
        this.loadAnimations();
        if(type=='mele')
            this.anims.play('meleIdleRight', true); // Animación inicial
        else if (type=='ranger')
            this.anims.play('rangerIdleDown', true); // Animación inicial
        else
            console.log("no type detected")

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
        
        //ARROW
        this.anims.create({
            key: 'enemiesArrowDown',
            frames: [{ key: 'enemiesArrow', frame: 0 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'enemiesArrowRight',
            frames: [{ key: 'enemiesArrow', frame: 1 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'enemiesArrowLeft',
            frames: [{ key: 'enemiesArrow', frame: 1 }], 
            frameRate: 1, 
            repeat: -1    
        });

        this.anims.create({
            key: 'enemiesArrowUp',
            frames: [{ key: 'enemiesArrow', frame: 2 }], 
            frameRate: 1, 
            repeat: -1    
        });

        
    } 

    move(delta) {
        if (this.isChasing) return;
    
        const velocity = this.speed * delta / 1000;
    
        // Movimiento horizontal (derecha e izquierda)
        if (this.movingRight) {
            this.x += velocity;
            this.body.velocity.x = velocity;  // Aseguramos que haya movimiento en X
            if (this.x >= this.initialX + this.patrolDistance) {
                this.movingRight = false;
            }
        } else {
            this.x -= velocity;
            this.body.velocity.x = -velocity;  // Movimiento hacia la izquierda
            if (this.x <= this.initialX) {
                this.movingRight = true;
            }
        }
    
        // Movimiento hacia abajo (Y positivo)
        if (this.movingDown) {
            this.y += velocity;
            this.body.velocity.y = velocity;
            if (this.y >= this.initialY + this.patrolDistance) {
                this.movingDown = false;
            }
        }
        // Movimiento hacia arriba (Y negativo)
        else if (this.movingUp) {
            this.y -= velocity;
            this.body.velocity.y = -velocity;
            if (this.y <= this.initialY) {
                this.movingUp = true;
            }
        }
    }
    
    handleMeleBehavior(delta) {
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );
    
        if (distanceToPlayer <= this.area) {
            // Si el jugador está en rango, perseguir
            this.isChasing = true;
            this.scene.physics.moveToObject(this, this.player, this.speed + 40);
    
            // Calcular el ángulo hacia el jugador
            const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
    
            // Elegir animación dependiendo del ángulo
            if (angleToPlayer >= -Math.PI / 4 && angleToPlayer < Math.PI / 4) { // Derecha
                this.anims.play('meleWalkRight', true);
                this.setFlipX(false);  // No invertir sprite
            } else if (angleToPlayer >= Math.PI / 4 && angleToPlayer < 3 * Math.PI / 4) { // Abajo derecha
                this.anims.play('meleWalkDown', true);
            } else if (angleToPlayer >= -3 * Math.PI / 4 && angleToPlayer < -Math.PI / 4) { // Arriba derecha
                this.anims.play('meleWalkUp', true);
            } else if (angleToPlayer >= -Math.PI && angleToPlayer < -3 * Math.PI / 4) { // Izquierda
                this.anims.play('meleWalkLeft', true);
                this.setFlipX(true);  // Invertir sprite
            } else if (angleToPlayer >= 3 * Math.PI / 4 && angleToPlayer < Math.PI) { // Abajo izquierda
                this.anims.play('meleWalkDown', true);
                this.setFlipX(true);  // Invertir sprite
            } else { // Arriba izquierda
                this.anims.play('meleWalkUp', true);
                this.setFlipX(true);  // Invertir sprite
            }
        } else {
            // Si el jugador está fuera de rango, patrullar
            if (this.isChasing) {
                this.isChasing = false;
                this.body.setVelocity(0);  // Detener movimiento
            }
            this.move(delta);
        }
    }

    update(time, delta) {
        if (this.type === 'mele') {
            this.handleMeleBehavior(delta);
        } else if (this.type === 'ranger') {
            //this.handleRangerBehavior(delta);
        }  
    }
    
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

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;  // Limitar la salud a 0
        this.updateHealthBar();  // Actualizar la barra de vida
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
import { gamePrefs } from '../globals.js';

export default class enemiesPrefab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, player) {
        super(scene, x, y, 'enemies');
        this.scene = scene;
        this.type = type; // 'mele' o 'ranger'
        this.player = player; 
        this.area = 40; 
        this.attacking = false;

        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.body.setSize(23, 20).setOffset(10, 10);

        this.initialX = x; 
        this.patrolDistance = 40; 
        this.speed = type === 'mele' ? 20 : 10; 
        this.movingRight = true; 

        // Animaciones
        this.loadAnimations();
        this.anims.play('meleIdleRight', true); 

        this.setColliders();

        this.hp = gamePrefs.ENEMY_MAXHEALTH;
        this.lastHitTime = 0;
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
    
        if (this.movingRight) {
            this.x += velocity;
            this.body.velocity.x = velocity;  
            if (this.x >= this.initialX + this.patrolDistance) {
                this.movingRight = false;
            }
        } else {
            this.x -= velocity;
            this.body.velocity.x = -velocity; 
            if (this.x <= this.initialX) {
                this.movingRight = true;
            }
        }
    
        if (this.movingDown) {
            this.y += velocity;
            this.body.velocity.y = velocity;
            if (this.y >= this.initialY + this.patrolDistance) {
                this.movingDown = false;
            }
        }

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

            this.isChasing = true;
            this.scene.physics.moveToObject(this, this.player, this.speed + 40);
    
            const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
    
            if (angleToPlayer >= -Math.PI / 4 && angleToPlayer < Math.PI / 4) { // Derecha
                this.anims.play('meleWalkRight', true);
                this.setFlipX(false); 
            } else if (angleToPlayer >= Math.PI / 4 && angleToPlayer < 3 * Math.PI / 4) { // Abajo derecha
                this.anims.play('meleWalkDown', true);
            } else if (angleToPlayer >= -3 * Math.PI / 4 && angleToPlayer < -Math.PI / 4) { // Arriba derecha
                this.anims.play('meleWalkUp', true);
            } else if (angleToPlayer >= -Math.PI && angleToPlayer < -3 * Math.PI / 4) { // Izquierda
                this.anims.play('meleWalkLeft', true);
                this.setFlipX(true);  
            } else if (angleToPlayer >= 3 * Math.PI / 4 && angleToPlayer < Math.PI) { // Abajo izquierda
                this.anims.play('meleWalkDown', true);
                this.setFlipX(true);  
            } else { // Arriba izquierda
                this.anims.play('meleWalkUp', true);
                this.setFlipX(true); 
            }
        } else {
            if (this.isChasing) {
                this.isChasing = false;
                this.body.setVelocity(0);  
            }
            this.move(delta);
        }
    }

    /*
    handleRangerBehavior(delta) {
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
                this.anims.play('rangerWalkRight', true);
                this.setFlipX(false);  // No invertir sprite
            } else if (angleToPlayer >= Math.PI / 4 && angleToPlayer < 3 * Math.PI / 4) { // Abajo derecha
                this.anims.play('rangerWalkDown', true);
            } else if (angleToPlayer >= -3 * Math.PI / 4 && angleToPlayer < -Math.PI / 4) { // Arriba derecha
                this.anims.play('rangerWalkUp', true);
            } else if (angleToPlayer >= -Math.PI && angleToPlayer < -3 * Math.PI / 4) { // Izquierda
                this.anims.play('rangerWalkLeft', true);
                this.setFlipX(true);  // Invertir sprite
            } else if (angleToPlayer >= 3 * Math.PI / 4 && angleToPlayer < Math.PI) { // Abajo izquierda
                this.anims.play('rangerWalkDown', true);
                this.setFlipX(true);  // Invertir sprite
            } else { // Arriba izquierda
                this.anims.play('rangerWalkUp', true);
                this.setFlipX(true);  // Invertir sprite
            }
    
            // Disparar flecha
            this.shootArrow();
        } else {
            // Si el jugador está fuera de rango, patrullar
            if (this.isChasing) {
                this.isChasing = false;
                this.body.setVelocity(0);  // Detener movimiento
            }
            this.move(delta);
        }
    }
    
    shootArrow() {
        // Crear o reciclar la flecha
        let arrow = this.scene.arrowPool.getFirst(false);
        if (!arrow) {
            console.log('Crea flecha');
            arrow = new ArrowPrefab(this.scene, this.x, this.y); // Posición inicial de la flecha
            this.scene.arrowPool.add(arrow);
        } else {
            console.log('Recicla flecha');
            arrow.setPosition(this.x, this.y); // Resetear posición de la flecha
            arrow.setActive(true);
        }
    
        // Configurar la flecha (ejemplo usando animación de "flecha hacia abajo")
        arrow.anims.play('enemiesArrowDown', true);
        
        // Aplicar velocidad a la flecha (ejemplo, la velocidad la puedes ajustar)
        arrow.body.setVelocityY(gamePrefs.ENEMY_ARROW_SPEED); // Asegúrate de tener la constante de velocidad definida
    
        // Agregar sonido de disparo (si lo tienes)
        this.scene.enemyShoot.play();
    }    
    */

    update(time, delta) {
        if (this.type === 'mele') {
            this.handleMeleBehavior(delta);
        
        } 
        /*
        else if (this.type === 'ranger') {
            this.handleRangerBehavior(delta);
        }  
        */
    }
    
    setColliders() {
        // Colisión con paredes (si existen)
        if (this.scene.walls) {
            this.scene.physics.add.collider(this, this.scene.walls);
        }
    
        // Colisión con el jugador (Link): cuando el enemigo choca directamente, Link recibe daño
        if (this.scene.link) {
            this.scene.physics.add.collider(this, this.scene.link, () => {
                if (this.type === 'mele') {
                    if (this.scene.link.takeDamage) {
                        // Aquí, 'this' (el enemigo) es la fuente del daño
                        this.scene.link.takeDamage(1, this);
                    }
                }
            });
        }
    
        // Overlap entre el hitbox de la espada de Link y este enemigo
        if (this.scene.link && this.scene.link.swordHitbox) {
            this.scene.physics.add.overlap(this.scene.link.swordHitbox, this, (hitbox, enemy) => {
                if (this.scene.link.state === 'attack' && enemy.active) {
                    // 'this.scene.link' es la fuente del daño para el enemigo
                    enemy.takeDamage(1, this.scene.link);
                }
            });
        }
    }
    
    takeDamage(damage, source) {
        this.hp -= damage;
    
        // Aplicar knock-back al enemigo si se proporciona la fuente
        if (source) {
            let dx = this.x - source.x;
            let dy = this.y - source.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const knockBackForce = 50; // Ajusta este valor según convenga para el enemigo
            this.body.setVelocity((dx / dist) * knockBackForce, (dy / dist) * knockBackForce);
        }
    
        if (this.hp <= 0) {
            this.destroy();
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
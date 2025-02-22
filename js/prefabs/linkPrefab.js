import { gamePrefs } from '../globals.js';

export default class linkPrefab extends Phaser.GameObjects.Sprite {
    constructor(_scene, _posX, _posY, _spriteTag = 'link') { 
        super(_scene, _posX, _posY, _spriteTag);

        _scene.add.existing(this);
        _scene.physics.world.enable(this);

        this.link = this;
        this.scene = _scene;

        this.body.setSize(11, 12, true).setOffset(3, 12);
        this.setColliders();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.createInputKeys();

        this.loadAnimations();

        this.hp = gamePrefs.LINK_MAXHEALTH;
        this.maxHealh = gamePrefs.LINK_MAXHEALTH;

        //TODO esta es la variable:
        this.hasSword = false;
        this.hasKey = false;
        this.state = 'walk'; // estados: 'walk', 'attack', 'dead', 'fall', etc.
        this.lastDirection = 'down'; // dirección por defecto
        this.isDying = false; // bandera para evitar reprocesar la muerte
        this.attackCooldown = false;

        // Configuración del hitbox de la espada
        this.swordHitbox = this.scene.add.zone(this.x, this.y, 14, 14);
        this.scene.physics.world.enable(this.swordHitbox);
        this.swordHitbox.body.setAllowGravity(false);
        this.swordHitbox.body.setImmovable(true);
        this.swordHitbox.active = false;
        this.swordHitbox.visible = false;
        this.swordUI = null;
    }

    loadAnimations() {
        this.anims.create({
            key: 'idleRight',
            frames: [{ key: 'linkWalk', frame: 9 }],
            frameRate: 1,
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

        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('linkWalk', { start: 0, end: 8 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'walkRight',
            frames: this.anims.generateFrameNumbers('linkWalk', { start: 9, end: 16 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('linkWalk', { start: 18, end: 26 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'attackRight',
            frames: this.anims.generateFrameNumbers('linkSword', { start: 0, end: 6 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'attackUp',
            frames: this.anims.generateFrameNumbers('linkSword', { start: 7, end: 12 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'attackDown',
            frames: this.anims.generateFrameNumbers('linkSword', { start: 14, end: 20 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('linkDead', { start: 0, end: 5 }),
            frameRate: 4,
            repeat: 0
        });
    }

    createInputKeys() {
        this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    setColliders() {
        this.scene.physics.add.collider(this, this.scene.walls);
    }

    updateHealthBar() {
        if (this.healthBar) { 
            if (this.hp === 3) {
                this.healthBar.setFrame(3);
            } else if (this.hp === 2) {
                this.healthBar.setFrame(2);
            } else if (this.hp === 1) {
                this.healthBar.setFrame(1);
            } else if (this.hp === 0) {
                this.healthBar.setFrame(0);
            }
        }
    }

    handleMovement() {
        if (this.state !== 'walk') return;

        if (!this.lastDirection) this.lastDirection = 'left';

        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-gamePrefs.LINK_SPEED);
            this.body.setVelocityY(0);
            this.setFlipX(true);
            this.anims.play('walkRight', true);
            this.lastDirection = 'left';
        } else if (this.cursors.right.isDown) {
            this.body.setVelocityX(gamePrefs.LINK_SPEED);
            this.body.setVelocityY(0);
            this.setFlipX(false);
            this.anims.play('walkRight', true);
            this.lastDirection = 'right';
        } else if (this.cursors.up.isDown) {
            this.body.setVelocityY(-gamePrefs.LINK_SPEED);
            this.body.setVelocityX(0);
            this.setFlipX(false);
            this.anims.play('walkUp', true);
            this.lastDirection = 'up';
        } else if (this.cursors.down.isDown) {
            this.body.setVelocityY(gamePrefs.LINK_SPEED);
            this.body.setVelocityX(0);
            this.setFlipX(false);
            this.anims.play('walkDown', true);
            this.lastDirection = 'down';
        } else {
            this.body.setVelocity(0, 0);
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
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHealh) this.hp = this.maxHealh;
        this.updateHealthBar();
    }

    takeDamage(damage, source) {
        if (this.invulnerable) return;
    
        this.hp -= damage;
        this.invulnerable = true;
    
        if (source) {
            // Calculamos el vector desde la fuente hasta Link
            const dx = this.x - source.x;
            const dy = this.y - source.y;
            const angle = Math.atan2(dy, dx);
            const knockBackForce = 100; // Ajusta este valor según convenga
    
            // Asignamos la velocidad usando el ángulo calculado
            this.body.setVelocity(
                Math.cos(angle) * knockBackForce,
                Math.sin(angle) * knockBackForce
            );
        }
    
        // Cambiar el estado a "hurt" para evitar que el movimiento normal lo sobrescriba
        this.state = 'hurt';
    
        // Temporizador para volver al estado 'walk' luego del knockback (por ejemplo, 300ms)
        this.scene.time.delayedCall(300, () => {
            // Reiniciamos la velocidad (opcional, según cómo quieras que se sienta)
            this.body.setVelocity(0, 0);
            this.state = 'walk';
        });
    
        // Animación de invulnerabilidad (parpadeo)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 100,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                this.alpha = 1;
                this.invulnerable = false;
            }
        });
    
        if (this.hp <= 0) {
            this.hp = 0;
            this.updateHealthBar();
            this.handleDeath();
        } else {
            this.updateHealthBar();
        }
    }
    
    
    handleDeath() {
        this.scene.cameras.main.shake(250, 0.01);
        this.scene.cameras.main.flash(250, 255, 255, 255);
        this.scene.time.delayedCall(300, () => {
            this.setPosition(92, 77);
            this.hp = gamePrefs.LINK_MAXHEALTH;
            this.updateHealthBar();
            this.alpha = 1;
            this.anims.play('idleDown', true);
        });
    }

    attack() {
        if (this.attackCooldown) return;

        this.attackCooldown = true;
        this.state = 'attack';
        this.body.setVelocity(0, 0);
        const offset = 10;

        switch (this.lastDirection) {
            case 'left':
                this.setFlipX(false);
                this.setOrigin(0.37, 0.43);
                this.body.setOffset(8, 15);
                this.anims.play('attackRight', true);
                this.swordHitbox.setPosition(this.x - offset, this.y);
                break;
            case 'right':
                this.setFlipX(true);
                this.setOrigin(0.37, 0.43);
                this.body.setOffset(8, 15);
                this.anims.play('attackRight', true);
                this.swordHitbox.setPosition(this.x + offset, this.y);
                break;
            case 'up':
                this.anims.play('attackUp', true);
                this.setOrigin(0.55, 0.67);
                this.body.setOffset(14, 24);
                this.swordHitbox.setPosition(this.x, this.y - offset);
                break;
            case 'down':
                this.anims.play('attackDown', true);
                this.setOrigin(0.5, 0.45);
                this.body.setOffset(13, 16);
                this.swordHitbox.setPosition(this.x, this.y + offset);
                break;
        }

        this.swordHitbox.setActive(true).setVisible(true);
        this.swordHitbox.body.enable = true;

        this.scene.time.delayedCall(150, () => {
            this.swordHitbox.setActive(false).setVisible(false);
            this.swordHitbox.body.enable = false;
        });

        this.once('animationcomplete', () => {
            this.setOrigin(0.5, 0.5);
            this.body.setOffset(3, 12);
            this.state = 'walk';
            this.attackCooldown = false;
        });
    }

    handleAttack() {
        if (this.attackKey.isDown && this.hasSword) {
            this.state = 'attack';
        }
    }

    addSwordUI() {
        if (!this.swordUI) {
            this.swordUI = this.scene.add.image(15, 10, 'sword');
            this.swordUI.setScrollFactor(0);
        }
    }

    handleFall() {
        if (this.state !== 'fall') return;
        if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'dead') {
            this.anims.play('dead', true);
        }
        this.once('animationcomplete', () => {
            this.scene.scene.start('swordLevel', { 
                linkHP: this.hp, 
                linkHasSword: this.hasSword 
            });
        });
    }

    checkCollisionWithAgujero(agujeroObject) {
        this.scene.physics.add.collider(this, agujeroObject, () => {
            if (this.state !== 'fall') {
                this.state = 'fall';
            }
        });
    }

    preUpdate(time, delta) {
        // Máquina de estados
        switch (this.state) {
            case 'walk':
                this.handleMovement();
                break;
            case 'attack':
                this.attack();
                break;
            case 'fall':
                this.handleFall();
                break;
                case 'hurt':
                    break;
            default:
                this.state = 'walk';
                this.handleMovement();
                break;
        }
        this.handleAttack();

        /*
        // Si la hitbox está activa, la volvemos a alinear al sprite
        if (this.swordHitbox.active) {
            const offset = 10;
            switch (this.lastDirection) {
                case 'left':
                    this.swordHitbox.setPosition(this.x - offset, this.y);
                    break;
                case 'right':
                    this.swordHitbox.setPosition(this.x + offset, this.y);
                    break;
                case 'up':
                    this.swordHitbox.setPosition(this.x, this.y - offset);
                    break;
                case 'down':
                    this.swordHitbox.setPosition(this.x, this.y + offset);
                    break;
            }
        }

        // Detectar la finalización de la animación de ataque
        if (this.anims.currentAnim && this.anims.currentAnim.key.indexOf('attack') !== -1) {
            if (this.anims.isPlaying === false) {
                // Restauramos la posición y el offset del sprite
                this.setOrigin(0.5, 0.5);
                this.body.setOffset(3, 12);
                // Desactivamos la hitbox de la espada
                this.swordHitbox.active = false;
                this.swordHitbox.visible = false;
                this.swordHitbox.body.enable = false;
                this.attackCooldown = false;
                this.state = 'walk';
            }
        }
            */

        super.preUpdate(time, delta);
    }
}


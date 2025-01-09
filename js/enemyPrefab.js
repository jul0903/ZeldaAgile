class enemyPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='enemy')
    { //instanciar el objeto
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.link = this;
        this.scene = _scene;
        this.body.setSize(16, 26, true).setOffset(0, 0);
        this.setColliders();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.loadAnimations();
        this.anims.play('idleDown',true);
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
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'walkRight',
            frames:this.anims.generateFrameNumbers('linkWalk', {start:9, end:16}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'walkUp',
            frames:this.anims.generateFrameNumbers('linkWalk', {start:18, end:26}),
            frameRate: 10,
            repeat: -1
        });    
   }

    setColliders()
    {
        this.scene.physics.add.collider
        (
            this,
            this.scene.walls
        );        
    }

    preUpdate(time, delta) {
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
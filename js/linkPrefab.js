class linkPrefab extends Phaser.GameObjects.Sprite 
{
    //18, 30
    constructor(_scene,_posX,_posY,_spriteTag='link')
    { //instanciar el objeto
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.link = this;
        this.scene = _scene;
        this.body.setSize(30, 35, true).setOffset(5, 10);
        this.setColliders();
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.loadAnimations();
        this.anims.play('run',true);

        this.hacha = true;
        this.playingAnim = false;
    }

   loadAnimations()
   {
        this.anims.create(
        {
            key: 'idle',
            frames:this.anims.generateFrameNumbers('link', {start:0, end:5}),
            frameRate: 10,
            repeat: -1,
        });
        
        this.anims.create(
        {
            key: 'walking',
            frames:this.anims.generateFrameNumbers('link', {start:0, end:5}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create(
        {
            key: 'run',
            frames:this.anims.generateFrameNumbers('link', {start:46, end:53}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'dig',
            frames:this.anims.generateFrameNumbers('link', {start:69, end:81}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'axe',
            frames:this.anims.generateFrameNumbers('link', {start:92, end:101}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'mining',
            frames:this.anims.generateFrameNumbers('link', {start:115, end:124}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'watering',
            frames:this.anims.generateFrameNumbers('link', {start:138, end:142}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'hammering',
            frames:this.anims.generateFrameNumbers('link', {start:161, end: 183}),
            frameRate: 10,
            repeat: 0
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

    preUpdate(time,delta)
    {
        if(this.cursors.left.isDown)
        { //ME MUEVO A LA IZQUIERDA
            this.body.setVelocityX(-gamePrefs.LINK_SPEED);
            this.setFlipX(true);
            this.link.anims.play('run',true);
        }else
        if(this.cursors.right.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityX(gamePrefs.LINK_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        if(this.cursors.up.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityY(-gamePrefs.LINK_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        if(this.cursors.down.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityY(gamePrefs.LINK_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        { //NO ME MUEVO
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            if(!this.playingAnim)
                this.anims.play('idle',true);
        }    
        super.preUpdate(time, delta);
        
    }
}
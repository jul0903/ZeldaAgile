class studentPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='student')
    { //instanciar el objeto
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.student = this;
        this.scene = _scene;
        this.body.setSize(12,22,true).setOffset(43,19);
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
            frames:this.anims.generateFrameNumbers('student', {start:0, end:8}),
            frameRate: 10,
            repeat: -1,
        });
         console.log("hola?");
        this.anims.create(
        {
            key: 'walking',
            frames:this.anims.generateFrameNumbers('student', {start:23, end:30}),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create(
        {
            key: 'run',
            frames:this.anims.generateFrameNumbers('student', {start:46, end:53}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create(
        {
            key: 'dig',
            frames:this.anims.generateFrameNumbers('student', {start:69, end:81}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'axe',
            frames:this.anims.generateFrameNumbers('student', {start:92, end:101}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'mining',
            frames:this.anims.generateFrameNumbers('student', {start:115, end:124}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create(
        {
            key: 'watering',
            frames:this.anims.generateFrameNumbers('student', {start:138, end:142}),
            frameRate: 10,
            repeat: 2
        });

        this.anims.create(
        {
            key: 'hammering',
            frames:this.anims.generateFrameNumbers('student', {start:161, end: 183}),
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
       // this.anims.play("idle",true);
        if(this.cursors.left.isDown)
        { //ME MUEVO A LA IZQUIERDA
            this.body.setVelocityX(-gamePrefs.STUDENT_SPEED);
          // this.body.setVelocity(100, 0);
            this.setFlipX(true);
            this.student.anims.play('run',true);
        }else
        if(this.cursors.right.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityX(gamePrefs.STUDENT_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        if(this.cursors.up.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityY(-gamePrefs.STUDENT_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        if(this.cursors.down.isDown)
        { //ME MUEVO A LA DERECHA
            this.body.setVelocityY(gamePrefs.STUDENT_SPEED);
            this.setFlipX(false);
            this.anims.play('run',true);
        }
        else
        { //NO ME MUEVO AT ALL
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            if(!this.playingAnim)
                this.anims.play('idle',true);
            //this.anims.stop().setFrame(0);
        }    
        super.preUpdate(time, delta);
        
    }
}
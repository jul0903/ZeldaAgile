class enemyPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_posX,_posY,_spriteTag='enemy')
    { //instanciar el objeto
        super(_scene,_posX,_posY,_spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.link = this;
        this.scene = _scene;
        this.body.setSize(27, 38, true).setOffset(0, 0);
        this.setColliders();
        this.loadAnimations();
        this.anims.play('idleDown',true);
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
                key: 'rangerAtackUp',
                frames:this.anims.generateFrameNumbers('enemies', {start:32, end:34}),
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

        
        super.preUpdate(time, delta);
    }
}
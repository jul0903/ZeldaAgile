class changeScenePrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_changeScene)
    { 
        super(_scene,_changeScene.posX,_changeScene.posY);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.changeScene = this;
        this.changeScene.body.setAllowGravity(false);
        this.scene = _scene;
        this.setColliders();
    }

    setColliders()
    {
        this.scene.physics.add.overlap
        (
            this.scene.link,
            this,
            this.ChangeScene,
            null,
            this
        );
    }

    ChangeScene()
    {
        // ChangeScene    
        console.log(':)');  
    }
}
class bushPrefab extends Phaser.GameObjects.Sprite 
{
    constructor(_scene,_bush)
    { //instanciar el objeto
        super(_scene,_bush.posX,_bush.posY,_bush.spriteTag);
        _scene.add.existing(this);
        _scene.physics.world.enable(this);
        this.bush = this;
        this.bush.body.setAllowGravity(false);
        this.scene = _scene;
        this.setColliders();
    }

    setColliders()
    {
        this.scene.physics.add.collider
        (
            this.scene.link,
            this.bush,
            this.getBush,
            null,
            this
        );
    }

    getBush()
    {
        this.bush.destroy();       
    }
}
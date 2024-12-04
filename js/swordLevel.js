class swordLevel extends Phaser.Scene
{
    constructor()
    {
        super({key:'swordLevel'});
    }

    preload()
    {
        this.cameras.main.setBackgroundColor("112");

        this.load.setPath('assets/sprites'); // Declarar spriteSheet PJ (Link)
        this.load.spritesheet('student', 'spr_student.png', {frameWidth:96,frameHeight:64});

        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('Background', 'SwordDungeon.png');
        //this.load.image('changeScene', '');

        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('SwordDungeonTiled', 'SwordDungeon.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        this.add.sprite(100, 100, 'Background');
        this.add.image('Background');
        
        // Cargamos JSON
        this.map = this.add.tilemap('SwordDungeonTiled');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'SwordDungeon');

        // Pintar PJ
        this.student = new studentPrefab(this, 100, 100).setDepth(1);
        
        // Pintar capa superior
        //this.map.createLayer('Superior', 'SwordDungeon');
        
        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
        
        // CAMARA
        this.cameras.main.startFollow(this.student);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);
            
    }
}
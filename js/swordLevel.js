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
        this.load.spritesheet('link', 'spr_link2.gif', { frameWidth: 41, frameHeight: 45});
        this.load.spritesheet('linkWalk', 'sprLinkWalking.png', { frameWidth: 16, frameHeight: 26,transparentColor: '#004040'});

        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('Background', 'SwordDungeon1.png');
        //this.load.image('changeScene', '');

        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('Sword_Dungeon', 'SwordDungeon.json');


        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        this.add.sprite(230, 100, 'Background');
        this.add.image('Background');
        
        // Cargamos JSON
        this.map = this.add.tilemap('SwordDungeon');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'Sword_Dungeon');

        // Pintar PJ
        this.link = new linkPrefab(this, 380, 110).setDepth(1);
        
        // Pintar capa superior
        //this.map.createLayer('Superior', 'SwordDungeon');
        
        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
        
        // CAMARA
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);
            
    }
}
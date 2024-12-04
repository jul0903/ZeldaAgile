class exteriorCastle extends Phaser.Scene
{
    constructor()
    {
        super({key:'exteriorCastle'});
    }

    preload()
    {
        this.cameras.main.setBackgroundColor("112");

        this.load.setPath('assets/sprites'); // Declarar spriteSheet PJ (Link)
        this.load.spritesheet('link', 'spr_link.png', { frameWidth: 41, frameHeight: 45, transparentColor: 0xFF00FF });
        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('CastleTileset', 'CastleTileset.png');
        this.load.image('Background', 'CastilloZelda.png');

        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('ZeldaMap', 'ZeldaMap.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        this.add.sprite(510, 510, 'Background');
        this.add.image('Background');
        
        // Cargamos JSON
        this.map = this.add.tilemap('ZeldaMap');

        // Cargamos tileset
        this.map.addTilesetImage('CastleTileset');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'CastilloZelda');

        // Pintar PJ
        this.link = new linkPrefab(this, 500, 700).setDepth(1);
        
        // Pintar capa superior
        this.map.createLayer('Superior', 'CastilloZelda');
        
        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
        
        // CAMARA
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);
    }
}
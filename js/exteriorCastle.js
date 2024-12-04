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
        this.load.spritesheet('student', 'spr_student.png', {frameWidth:96,frameHeight:64});

        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('CastleTileset', 'CastleTileset.png');
        this.load.image('Background', 'CastleTilesetSimple.png');
        this.load.image('bush', 'arbusto.png');

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
        this.student = new studentPrefab(this, 500, 700).setDepth(1);
        
        // Pintar capa superior
        this.map.createLayer('Superior', 'CastilloZelda');
        
        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
        
        // CAMARA
        this.cameras.main.startFollow(this.student);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);
        
        
        
        this.game_elements = this.map.getObjectLayer('Arbustos');
        this.game_elements.objects.forEach(function (element)
        {
                if(element.type=='bush')
                {
                    this.bush = new bushPrefab (
                        this,
                        {
                         posX:element.x,
                         posY:element.y,
                         spriteTag:element.type,
                        });
                }           
        },this);
            
    }
}
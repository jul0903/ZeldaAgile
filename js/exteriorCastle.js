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
        this.load.spritesheet('link', 'spr_link2.gif', { frameWidth: 41, frameHeight: 45});
        this.load.spritesheet('linkWalk', 'sprLinkWalking.png', { frameWidth: 16, frameHeight: 26,transparentColor: '#004040'});
        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('Background', 'CastleTilesetSimple.png');
        this.load.image('bush', 'arbusto.png');
        //this.load.image('changeScene', '');


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
        
        
        
        this.game_elements = this.map.getObjectLayer('Arbustos');
        this.game_elements.objects.forEach(function (element)
        {
            switch(element.type)
                {
                    case 'bush':
                        this.bush = new bushPrefab (
                            this,
                            {
                             posX:element.x,
                             posY:element.y,
                             spriteTag:element.type,
                            });
                        break;

                    //case 'changeScene':
                      //  this.changeScene = new changeScenePrefab (
                        //    this,
                          //  {
                            // posX:element.x,
                            // posY:element.y,
                            //});
                        //break;

                    default:
                        break;
                }           
        },this);
    }
}
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

        this.load.setPath('assets/tilesets'); // Declarar tiled
        this.load.image('CastilloZelda', 'CastilloZelda.png');

        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('ZeldaMap', 'ZeldaMap.json');
    }

    create()
    {
        // Cargamos JSON
        this.map = this.add.tilemap('ZeldaMap');

        // Cargamos tileset
        this.map.addTilesetImage('CastilloZelda');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'CastilloZelda');

        // Pintar PJ

        // Pintar capa superior
        this.map.createLayer('Superior', 'CastilloZelda');

        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');

        // CAMARA
        
    }
}
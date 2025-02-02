import {gamePrefs} from '../globals.js';

import linkPrefab from '/js/prefabs/linkPrefab.js';
import npcPrefab from '../prefabs/npcPrefab.js';
import bushPrefab from '/js/prefabs/bushPrefab.js';

export default class dungeon2 extends Phaser.Scene
{
    constructor()
    {
        super({key:'dungeon2'});
    }

    preload()
    {
         //MAP
         this.load.setPath('assets/tilesets'); 
         this.load.image('Background3', 'Dungeon2.png');
         this.load.image('Jarro', 'jarro.png');
         this.load.image('Chest', 'chest.png');
 
         this.load.setPath('assets/maps'); // Declarar mapa
         this.load.tilemapTiledJSON('Dungeon2', 'Dungeon2.json');
    }

    create()
    {
        this.add.sprite(476/2, 222/2, 'Background3');
        this.add.image('Background3');

         // Cargamos JSON
        this.map = this.add.tilemap('Dungeon2');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'Dungeon2');

        // Pintar PJ
        this.link = new linkPrefab(this, 100, 100).setDepth(1);  

        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
                
        // CAMARA
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);
        
        this.game_elements = this.map.getObjectLayer('Objects');
        this.game_elements.objects.forEach(function (element)
        {
            switch(element.type)
                {
                    case 'Jarro':
                        this.bush = new bushPrefab (
                            this,
                            {
                                posX:element.x,
                                posY:element.y,
                                spriteTag:element.type,
                            });
                        break;
                    case 'Chest': 
                        console.log("chest")
                    break;    
                    default:
                        break;
                }           
        },this);
    }

    update(time, delta) 
    {
    }
}
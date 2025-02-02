import {gamePrefs} from '../globals.js';

import linkPrefab from '/js/prefabs/linkPrefab.js';
import npcPrefab from '../prefabs/npcPrefab.js';
import bushPrefab from '/js/prefabs/bushPrefab.js';
import chestPrefab from '../prefabs/chestPrefab.js';
import keyPrefab from '../prefabs/keyPrefab.js';

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
         this.load.image('jarro', 'jarro.png');
         this.load.image('chest', 'chest.png');
         this.load.image('key', 'key.png');
 
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
        this.walls = this.map.createLayer('Collisions', 'Dungeon2').setVisible(false);

        // Pintar PJ
        this.link = new linkPrefab(this, 92, 77).setDepth(1);

        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');
        
        this.game_elements = this.map.getObjectLayer('Objects');
        this.game_elements.objects.forEach(function (element)
        {
            switch(element.type)
                {
                    case 'jarro':
                        this.bush = new bushPrefab (
                            this,
                            {
                                posX:element.x,
                                posY:element.y,
                                spriteTag:element.type,
                            });
                        break;
                    case 'chest': 
                    this.chest = new chestPrefab (
                        this,
                        {
                            posX:element.x + element.width / 2,
                            posY:element.y + element.height / 2,
                            spriteTag:element.type,
                        });    
                        break;    
                    case 'key':
                        this.key = new keyPrefab (
                            this,
                            {
                                posX:element.x + element.width / 2,
                                posY:element.y + element.height / 2,
                                spriteTag:element.type,
                            });    
                    default:
                        break;
                }           
        },this);

        // CAMARA
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);

        //debug
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    }

    update(time, delta) 
    {
        if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.scene.start('swordLevel');
        }

        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.scene.start('exteriorCastle');
        }

        this.link.updateHealthBar();
    }
}
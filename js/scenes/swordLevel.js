import {gamePrefs} from '../globals.js';

import linkPrefab from '/js/prefabs/linkPrefab.js';
import npcPrefab from '../prefabs/npcPrefab.js';

export default class swordLevel extends Phaser.Scene
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
        this.load.image('Background2', 'SwordDungeon.png');
        //this.load.image('changeScene', '');

        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('Dungeon', 'Dungeon.json');


        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create()
    {
        this.add.sprite(464/2, 176/2, 'Background2');
        this.add.image('Background2');
        
        // Cargamos JSON
        this.map = this.add.tilemap('Dungeon');

        // Pintar capas
        this.walls = this.map.createLayer('Collisions', 'Dungeon').setVisible(false);

        // Pintar PJ
        this.link = new linkPrefab(this, 380, 110).setDepth(1);
        
        // COLISIONES
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');

        this.game_elements = this.map.getObjectLayer('NPCs');

        this.game_elements.objects.forEach((element) => {
            if (element.type === 'NPC') {
                const dialogueProperty = element.properties ? element.properties.find(prop => prop.name === 'Dialogue') : null;
                const npcDialogue = dialogueProperty ? dialogueProperty.value : '...';

                console.log(`Creando NPC en (${element.x}, ${element.y}) con diálogo: "${npcDialogue}"`);

                new npcPrefab(this, {
                    posX: element.x,
                    posY: element.y,
                    spriteTag: 'npc2', // Mantiene el spriteTag manualmente
                    dialogue: npcDialogue,
                });
            }
        });
        


        // CAMARA
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0,0,gamePrefs.level1Width,gamePrefs.level1Height);  
    }
}
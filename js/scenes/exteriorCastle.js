import {gamePrefs} from '../globals.js';

import bushPrefab from '/js/prefabs/bushPrefab.js';
import npcPrefab from '/js/prefabs/npcPrefab.js';
import linkPrefab from '/js/prefabs/linkPrefab.js';
import enemiesPrefab from '/js/prefabs/enemiesPrefab.js';

export default class exteriorCastle extends Phaser.Scene
{
    constructor()
    {
        super({key:'exteriorCastle'});
    }

    preload()
    {
        this.cameras.main.setBackgroundColor("112");

        this.load.setPath('assets/sprites'); 
        //LINK
        this.load.spritesheet('link', 'spr_link2.gif', { frameWidth: 41, frameHeight: 45});
        this.load.spritesheet('linkWalk', 'sprLinkWalking.png', { frameWidth: 16, frameHeight: 26});
        this.load.spritesheet('linkArcher', 'sprLinkArcher.png', { frameWidth: 21, frameHeight: 24});
        this.load.spritesheet('linkSword', 'sprLinkSword.png', { frameWidth: 36, frameHeight: 36});
        this.load.spritesheet('linkDead', 'sprLinkDead.png', { frameWidth: 24, frameHeight: 24});

        //UI
        this.load.spritesheet('ui', 'sprUI.png', { frameWidth: 20, frameHeight: 21});
        this.load.spritesheet('healthBar', 'sprHealth.png', { frameWidth: 39, frameHeight: 20});
        this.load.image('sword', 'sword.png');

        //ENEMIES
        this.load.spritesheet('enemies', 'sprEnemies2.png', { frameWidth: 34, frameHeight: 38});
        this.load.spritesheet('enemiesArrow', 'sprEnemiesArrow.png', { frameWidth: 15, frameHeight: 15});

        //NPCs
        this.load.spritesheet('npc', 'sprNpc.png', { frameWidth: 16, frameHeight: 24});
        this.load.image('npc1', 'sprNpc1.png');
            //dialogue
            this.load.image('dialogueBox', 'dialogueBox3.png');
        
        //MAP
        this.load.setPath('assets/tilesets'); 
        this.load.image('Background', 'CastleTilesetSimple.png');
        this.load.image('bush', 'arbusto.png');
        //this.load.image('changeScene', '');


        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('ZeldaMap', 'ZeldaMap.json');

        //INPUT
        this.cursors = this.input.keyboard.createCursorKeys();

        //DIALOGUE
        this.load.setPath('assets/fonts/');
        this.load.bitmapFont('textFont','textFont.png','textFont.xml');
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
        this.link = new linkPrefab(this, 600, 920).setDepth(1);  

        // HP Link
        this.healthBar = this.add.sprite(210, 10, 'healthBar').setScrollFactor(0);

        this.link.healthBar = this.healthBar.setDepth(2); 


        this.enemies = this.add.group();

        const meleEnemy = new enemiesPrefab(this, 500, 750, 'mele', this.link).setDepth(1);
        this.enemies.add(meleEnemy);
        //const rangerEnemy = new enemiesPrefab(this, 500, 900, 'ranger', this.link).setDepth(1);
        //this.enemies.add(rangerEnemy);

        /* Flechas
        this.arrows = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true,
        });
        */
        
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

                    default:
                        break;
                }           
        },this);

        this.game_elements = this.map.getObjectLayer('NPC');

        this.game_elements.objects.forEach((element) => {
            if (element.type === 'NPC') {
        
                const dialogueProperty = element.properties.find(prop => prop.name === 'Dialogue');
                const npcDialogue = dialogueProperty ? dialogueProperty.value : '...'; 
    
                new npcPrefab(this, {
                    posX: element.x,
                    posY: element.y,
                    spriteTag: 'npc1',     
                    dialogue: npcDialogue,
                });
            }
        });

        
        this.game_elements = this.map.getObjectLayer('Agujero');

        const agujeroLayer = this.game_elements.objects.filter(obj => obj.type === 'agujero');

        agujeroLayer.forEach((element) => {
            // Crear el objeto sin una imagen visible
            const agujeroObject = this.physics.add.staticImage(element.x, element.y, null);
            agujeroObject.setSize(element.width / 3, element.height / 3);
            agujeroObject.setOrigin(0.3, 0.5);
            agujeroObject.setAlpha(0);  // Hacer que no sea visible
            
            this.link.checkCollisionWithAgujero(agujeroObject);
        });

        this.physics.add.overlap(
            this.link.swordHitbox,  // Usamos el hitbox desde link
            this.enemies, 
            (sword, enemy) => {
                enemy.takeDamage(1);  // Lógica de daño
            }
        );

        //debug
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    }

    update(time, delta) {
        
        /*
        this.arrows.children.iterate((arrow) => {
            if (arrow && (arrow.x < 0 || arrow.x > this.game.config.width || arrow.y < 0 || arrow.y > this.game.config.height)) {
                arrow.setActive(false).setVisible(false); 
            }
        });
        */

        this.enemies.getChildren().forEach((enemy) => {
            enemy.update(time, delta);
        }); 

        this.link.updateHealthBar();

        //debug
        if (Phaser.Input.Keyboard.JustDown(this.key2)) {
            this.scene.start('swordLevel');
        }
          
        if (Phaser.Input.Keyboard.JustDown(this.key3)) {
        this.scene.start('dungeon2');
        }
    }    
}
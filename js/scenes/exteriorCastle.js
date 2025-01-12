import {gamePrefs} from '../globals.js';

import bushPrefab from '/js/prefabs/bushPrefab.js';
import npcPrefab from '/js/prefabs/npcPrefab.js';
import changeScenePrefab from '/js/prefabs/changeScenePrefab.js';
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

        //ENEMIES
        this.load.spritesheet('enemies', 'sprEnemies2.png', { frameWidth: 34, frameHeight: 38});
        this.load.spritesheet('enemiesArrow', 'sprEnemiesArrow.png', { frameWidth: 15, frameHeight: 15});

        //NPCs
        this.load.spritesheet('npc', 'sprNpc.png', { frameWidth: 16, frameHeight: 24});
        this.load.image('npc1', 'sprNpc1.png');
            //dialogue
            this.load.image('dialogueBox', 'dialogueBox.png');
        
        //MAP
        this.load.setPath('assets/tilesets'); 
        this.load.image('Background', 'CastleTilesetSimple.png');
        this.load.image('bush', 'arbusto.png');
        //this.load.image('changeScene', '');


        this.load.setPath('assets/maps'); // Declarar mapa
        this.load.tilemapTiledJSON('ZeldaMap', 'ZeldaMap.json');

        //INPUT
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
        this.link = new linkPrefab(this, 600, 920).setDepth(1);  

        // HP Link
        this.healthBar = this.add.sprite(210, 10, 'healthBar').setScrollFactor(0);

        this.link.healthBar = this.healthBar; 

        // Enemies
        this.enemies = this.add.group();

        const meleEnemy = new enemiesPrefab(this, 500, 750, 'mele', this.link).setDepth(1);
        //const rangerEnemy = new enemiesPrefab(this, 500, 650, 'ranger', this.link).setDepth(1);

        this.enemies.add(meleEnemy);
        //this.enemies.add(rangerEnemy);

        // Flechas
        this.arrows = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true,
        });
        
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

        this.game_elements = this.map.getObjectLayer('NPC');
        const npcLayer = this.map.getObjectLayer('NPC');
        if (npcLayer) {
            console.log('Capa NPC cargada correctamente.');
        } else {
            console.error('Capa NPC no encontrada.');
        }
        this.game_elements.objects.forEach((element) => {
            if (element.type === 'NPC') {
                // Extraer el diálogo de las propiedades
                const dialogueProperty = element.properties.find(prop => prop.name === 'Dialogue');
                const npcDialogue = dialogueProperty ? dialogueProperty.value : '...';  // Establecer el valor del diálogo
        
                console.log(`Creando NPC en (${element.x}, ${element.y}) con diálogo: "${npcDialogue}"`);
        
                // Crear una nueva instancia de npcPrefab
                new npcPrefab(this, {
                    posX: element.x,
                    posY: element.y,
                    spriteTag: 'npc',     // Usar el sprite adecuado
                    dialogue: npcDialogue,
                });
            }
        });
    }

    

    update(time, delta) {
        // Llama al método update de cada enemigo en el grupo
        this.enemies.getChildren().forEach((enemy) => {
            enemy.update(time, delta);
        });

        this.arrows.children.iterate((arrow) => {
            if (arrow && (arrow.x < 0 || arrow.x > this.game.config.width || arrow.y < 0 || arrow.y > this.game.config.height)) {
                arrow.setActive(false).setVisible(false); // Desactivar flecha fuera de pantalla
            }
        });

        this.link.updateHealthBar();
    }    
}
import {gamePrefs} from '../globals.js';

import linkPrefab from '/js/prefabs/linkPrefab.js';
import npcPrefab from '../prefabs/npcPrefab.js';
import bushPrefab from '/js/prefabs/bushPrefab.js';

export default class swordLevel extends Phaser.Scene {
    constructor() {
        super({ key: 'swordLevel' });
    }

    preload() {
        this.cameras.main.setBackgroundColor("112");

        // Cargamos sprites y tiles
        this.load.setPath('assets/sprites'); 
        this.load.spritesheet('link', 'spr_link2.gif', { frameWidth: 41, frameHeight: 45 });
        this.load.spritesheet('linkWalk', 'sprLinkWalking.png', { frameWidth: 16, frameHeight: 26, transparentColor: '#004040' });

        this.load.setPath('assets/tilesets'); 
        this.load.image('Background2', 'SwordDungeon.png');

        this.load.setPath('assets/maps'); 
        this.load.tilemapTiledJSON('Dungeon', 'Dungeon.json');

        // Configuración de las teclas
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        // Agregamos el fondo
        this.add.sprite(464 / 2, 176 / 2, 'Background2');
        this.add.image('Background2');

        // Cargamos el tilemap
        this.map = this.add.tilemap('Dungeon');

        // Creamos la capa de colisiones y la ocultamos si lo deseas
        this.walls = this.map.createLayer('Collisions', 'Dungeon').setVisible(false);

        // Creamos al jugador
        this.link = new linkPrefab(this, 380, 110).setDepth(1);

        // Activamos las colisiones en la capa de colisiones
        this.map.setCollisionByExclusion(-1, true, true, 'Collisions');

        // Procesamos la capa de NPCs (como ya lo tienes implementado)
        this.game_elements = this.map.getObjectLayer('NPCs');
        if (this.game_elements && this.game_elements.objects) {
            this.game_elements.objects.forEach((element) => {
                if (element.type === 'NPC') {
                    const dialogueProperty = element.properties ? element.properties.find(prop => prop.name === 'Dialogue') : null;
                    const npcDialogue = dialogueProperty ? dialogueProperty.value : '...';
                    console.log(`Creando NPC en (${element.x}, ${element.y}) con diálogo: "${npcDialogue}"`);
                    new npcPrefab(this, {
                        posX: element.x,
                        posY: element.y,
                        spriteTag: 'npc2',
                        dialogue: npcDialogue,
                    });
                }
            });
        }

        // PROCESAR LA CAPA DE OBJETOS "ChangeScene"
        // Se asume que en Tiled tienes una capa llamada "ChangeScene" y un objeto (o varios) definido(s) como rectángulo
        const changeSceneLayer = this.map.getObjectLayer('ChangeScene');
        if (changeSceneLayer && changeSceneLayer.objects) {
            changeSceneLayer.objects.forEach((object) => {
                // Ajustamos la posición para que el centro del rectángulo sea el punto de referencia
                const zoneX = object.x + object.width / 2;
                const zoneY = object.y + object.height / 2;

                // Creamos la zona en la escena
                const zone = this.add.zone(zoneX, zoneY, object.width, object.height);

                // Habilitamos la física en la zona
                this.physics.world.enable(zone);
                zone.body.setAllowGravity(false);
                zone.body.setImmovable(true);

                // Opcional: Si deseas ver la zona para depurar, puedes dibujar un rectángulo
                // let graphics = this.add.graphics();
                // graphics.lineStyle(2, 0xff0000);
                // graphics.strokeRect(zoneX - object.width/2, zoneY - object.height/2, object.width, object.height);

                // Configuramos la detección de overlap entre el jugador y la zona
                this.physics.add.overlap(this.link, zone, () => {
                    console.log("Trigger de cambio de escena activado");
                    this.scene.start('dungeon2'); // Cambia a la escena "dungeon2"
                });
            });
        }

        // Configuración de la cámara para que siga al jugador
        this.cameras.main.startFollow(this.link);
        this.cameras.main.setBounds(0, 0, gamePrefs.level1Width, gamePrefs.level1Height);

        //debug
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    }

    update(time, delta) 
    {
        if (Phaser.Input.Keyboard.JustDown(this.key3)) {
            this.scene.start('dungeon2');
        }

        if (Phaser.Input.Keyboard.JustDown(this.key1)) {
            this.scene.start('exteriorCastle');
        }

        this.link.updateHealthBar();
    }
}

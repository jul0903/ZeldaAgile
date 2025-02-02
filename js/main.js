//Cargamos el Intellisense
/// <reference path="../def/phaser.d.ts" />

//Importamos las escenas
import exteriorCastle from '/js/scenes/exteriorCastle.js';
import swordLevel from '/js/scenes/swordLevel.js';
import dungeon2 from '/js/scenes/dungeon2.js';

//Importamos el módulo de gamePrefs
import {gamePrefs} from '/js/globals.js';

var config = 
{
    type: Phaser.AUTO,
    width: gamePrefs.gameWidth,
    height: gamePrefs.gameHeight,
    scene:[exteriorCastle,swordLevel,dungeon2],
    render:
    {
        pixelArt:true
    },
    scale:
    {
        mode:Phaser.Scale.FIT,
        width:gamePrefs.gameWidth/4,
        height:gamePrefs.gameHeight/4,
        autoCenter:Phaser.Scale.CENTER_BOTH
    }
    ,
    physics:
    {
        default:'arcade',
        arcade:
        {
            gravity:{y:gamePrefs.LINK_GRAVITY},
            debug:true
        }
    },
    fps:
    {
        target:60,
        forceSetTimeOut:true
    }
};

var juego = new Phaser.Game(config);
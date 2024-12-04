var gamePrefs=
{
    gameWidth:960,
    gameHeight:540,
    level1Width:1040, //130*8
    level1Height:1040, //130*8
    LINK_SPEED:100,
    LINK_GRAVITY:0
}

var config = 
{
    type: Phaser.AUTO,
    width: gamePrefs.gameWidth,
    height: gamePrefs.gameHeight,
    scene:[exteriorCastle], //array con las escenas
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
import { gamePrefs } from '../globals.js';

export default class ArrowPrefab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        _scene.add.existing(this);
    }

    preUpdate()
    {
        if(this.y<=0 || this.y>=config.height)
        {
            this.setActive(false);
        }
    }
    
}

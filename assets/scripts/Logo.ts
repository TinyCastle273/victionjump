import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Logo')
export class Logo extends Component {
    @property({
        type: Sprite,
    })
    public mainSprite: Sprite

    public pass: boolean;
    setLogo() {
        this.pass = false;
    }

    getLogo() {
        this.pass = true;
        console.log("get Logo");
    }
}



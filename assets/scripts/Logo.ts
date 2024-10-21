import { _decorator, CCFloat, Component, Node, Sprite, tween, Tween, Vec2, Vec3 } from 'cc';
import { LogoDetails } from './LogoDetails';
const { ccclass, property } = _decorator;

@ccclass('Logo')
export class Logo extends Component {
    @property([LogoDetails])
    public logoDetails: LogoDetails[] = [];

    @property({
        type: Sprite,
    })
    public mainSprite: Sprite

    @property({
        type: CCFloat,
        tooltip: 'how high does he jump?'
    })
    public jumpHeight: number = 100;

    @property({
        type: CCFloat,
        tooltip: 'how long does he jump?'
    })
    public jumpDuration: number = 1.5;

    public tweenGetLogo: Tween;
    public pass: boolean;
    public currentLogoDetails: LogoDetails


    setLogo(index) {
        index = index % this.logoDetails.length;
        this.currentLogoDetails = this.logoDetails[index];

        if (this.tweenGetLogo)
            this.tweenGetLogo.stop();
        this.mainSprite.spriteFrame = this.currentLogoDetails.logoIcon;
        this.node.scale = Vec3.ONE;
        this.pass = false;
    }

    getLogo() {
        this.pass = true;
        this.playEffect();
    }

    playEffect() {
        if (this.tweenGetLogo)
            this.tweenGetLogo.stop();

        let tweenUp = tween(this.node)
            .to(this.jumpDuration, {
                position: {
                    value: new Vec3(this.node.position.x, this.node.position.y + this.jumpHeight),
                    easing: 'quadOut'
                },
                scale: {
                    value: new Vec3(0.5, 0.5, 0.5)
                }
            });

        let tweenDown = tween(this.node)
            .to(this.jumpDuration, {
                position: {
                    value: new Vec3(this.node.position.x, this.node.position.y),
                    easing: 'quadIn'
                },
                scale: {
                    value: new Vec3(0, 0, 0)
                }
            });

        this.tweenGetLogo = tween(this.node).then(tweenUp).then(tweenDown).start();
        return true;
    }
}



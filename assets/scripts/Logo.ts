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

    @property({
        type: CCFloat,
        tooltip: 'how long does he jump?'
    })
    public durationPerChar: number = 0.1;

    public tweenGetLogo: Tween;
    public pass: boolean;
    public currentLogoDetails: LogoDetails

    protected onLoad(): void {
        this.logoDetails.forEach(element => {
            console.log(element.tier + " -- " + element.logoIcon.name + " -- " + element.detail);
        });
    }

    setLogo(index) {
        index = index % this.logoDetails.length;
        this.currentLogoDetails = this.logoDetails[index];

        if (this.tweenGetLogo)
            this.tweenGetLogo.stop();
        this.mainSprite.spriteFrame = this.currentLogoDetails.logoIcon;
        this.node.scale = new Vec3(0.6, 0.6, 0.6);
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
                    value: new Vec3(0.3, 0.3, 0.3)
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

    getDuration() {
        if (this.currentLogoDetails.detail) {
            return this.durationPerChar * this.currentLogoDetails.detail.length * 1000;
        }
        return 0;
    }


}



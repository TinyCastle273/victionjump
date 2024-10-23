import { _decorator, CCFloat, Component, Node, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MCController')
export class MCController extends Component {
    @property({
        type: CCFloat,
        tooltip: 'how high does he jump?'
    })
    public jumpHeight: number = 1.5;

    @property({
        type: CCFloat,
        tooltip: 'how high does he jump?'
    })
    public canJumpHeight: number = 1.5;

    @property({
        type: CCFloat,
        tooltip: 'how long does he jump?'
    })
    public jumpDuration: number = 1.5;

    @property({
        type: Sprite,
    })
    public mainSprite: Sprite

    @property({
        type: SpriteFrame,
    })
    public defaultFrame: SpriteFrame

    @property({
        type: SpriteFrame,
    })
    public scoringFrame: SpriteFrame

    @property({
        type: UITransform,
    })
    public uiTransform: UITransform

    public tweenJump: Tween;
    public floor: number;
    //hit detection call
    public hitSomething: boolean;

    onLoad() {
        this.floor = this.node.position.y;
    }

    jump() {
        let canJump = this.node.position.y <= this.floor + this.canJumpHeight;
        if (!canJump) return false;
        this.mainSprite.spriteFrame = this.defaultFrame;
        if (this.tweenJump)
            this.tweenJump.stop();

        let tweenUp = tween(this.node)
            .to(this.jumpDuration, {
                position: {
                    value: new Vec3(this.node.position.x, this.floor + this.jumpHeight),
                    easing: 'quadOut'
                }
            });

        let tweenDown = tween(this.node)
            .to(this.jumpDuration, {
                position: {
                    value: new Vec3(this.node.position.x, this.floor),
                    easing: 'quadIn'
                }
            });
        this.tweenJump = tween(this.node).then(tweenUp).then(tweenDown).start();
        return true;
    }

    reset() {
        this.mainSprite.spriteFrame = this.defaultFrame;
        //place bird in location
        this.node.setPosition(new Vec3(this.node.position.x, this.floor));
        this.normalFace();
        //reset hit detection
        this.hitSomething = false;

    }

    normalFace() {
        this.mainSprite.spriteFrame = this.defaultFrame;
    }

    smileFace() {
        this.mainSprite.spriteFrame = this.scoringFrame;
    }



}



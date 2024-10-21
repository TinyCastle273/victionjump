import { _decorator, CCFloat, Component, Label, Node, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Quote')
export class Quote extends Component {
    @property({
        type: Node
    })
    public quotePopup: Node

    @property({
        type: Label,
    })
    public quoteLabel: Label;

    @property({
        type: CCFloat,
    })
    public showDuration: number = 1.5;

    @property({
        type: CCFloat,
    })
    public hideDuration: number = 1.5;

    public tweenLogo: Tween;

    protected onLoad(): void {
        this.quotePopup.active = false;
    }

    show(detail) {
        if (this.tweenLogo)
            this.tweenLogo.stop();
        this.quotePopup.active = true;
        this.quotePopup.scale = Vec3.ZERO;
        this.tweenLogo = tween(this.quotePopup)
            .to(this.showDuration, {
                scale: {
                    value: Vec3.ONE,
                    easing: 'quadOut'
                }
            }).start();

        this.quoteLabel.string = detail;
    }

    hide() {
        if (this.tweenLogo)
            this.tweenLogo.stop();
        this.tweenLogo = tween(this.quotePopup)
            .to(this.showDuration, {
                scale: {
                    value: Vec3.ZERO
                    , easing: 'quadOut'
                }
            }).call(() => {
                this.quotePopup.active = false;
            }).start()
    }

}



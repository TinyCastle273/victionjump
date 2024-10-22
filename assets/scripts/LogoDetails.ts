import { _decorator, CCFloat, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LogoDetails')
export class LogoDetails {

    @property({
        type: CCFloat
    })
    public tier: number;

    @property({
        type: String
    })
    public detail: String;


    @property({
        type: SpriteFrame,
    })
    public logoIcon: SpriteFrame
}



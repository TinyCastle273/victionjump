import { _decorator, CCFloat, Component, Node, screen, UITransform, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Clouds')
export class Clouds extends Component {
    @property({
        type: GameController,
    })
    public gameController: GameController;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public cloudSpeed: number = 0.1;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public randomFromHeight: number = 0.1;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public randomToHeight: number = 0.1;

    @property([UITransform])
    public grounds: UITransform[] = [];
    public maxElementX: number;

    protected onLoad(): void {
        this.maxElementX = 0;

        this.grounds.forEach(element => {
            this.setRandomElementPosition(element);
        });
    }

    protected update(dt: number): void {
        let x = this.node.position.x - this.gameController.currentRunSpeed * dt * this.cloudSpeed;
        this.node.setPosition(new Vec3(x, this.node.position.y))
        this.grounds.forEach(element => {
            if (element.node.worldPosition.x < -screen.windowSize.width / 2 - element.width / 2) {
                this.setRandomElementPosition(element);
            }
        });
    }

    setRandomElementPosition(element) {
        let xG = this.maxElementX + this.getRandomDistace(200, 600);
        let yG = this.getRandomDistace(this.randomFromHeight, this.randomToHeight)
        element.node.setWorldPosition(new Vec3(xG, yG))
        if (this.maxElementX < element.node.worldPosition.x)
            this.maxElementX = element.node.worldPosition.x;
    }


    getRandomDistace(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}



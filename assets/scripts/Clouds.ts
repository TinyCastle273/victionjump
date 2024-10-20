import { _decorator, CCFloat, Component, Node, screen, UITransform, Vec2, Vec3 } from 'cc';
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
    public clouds: UITransform[] = [];

    protected onLoad(): void {

        this.clouds.forEach(element => {
            this.setRandomElementPosition(element);
        });
    }

    protected update(dt: number): void {
        let x = this.node.position.x - this.gameController.currentRunSpeed * dt * this.cloudSpeed;
        this.node.setPosition(new Vec3(x, this.node.position.y))
        this.clouds.forEach(element => {
            if (element.node.worldPosition.x < 0) {
                this.resetElementPosition(element);
            }
        });
    }

    setRandomElementPosition(element) {
        let xG = this.getRandomDistace(0, screen.windowSize.width);
        let yG = this.getRandomDistace(this.randomFromHeight, this.randomToHeight)
        element.node.worldPosition = new Vec3(xG, yG);
        let scale = this.getRandomDistace(5, 10) * 0.1;
        element.node.scale = new Vec2(scale, scale);
    }

    resetElementPosition(element) {
        let xG = screen.windowSize.width + this.getRandomDistace(100, 500);
        let yG = this.getRandomDistace(this.randomFromHeight, this.randomToHeight)
        element.node.worldPosition = new Vec3(xG, yG);
        let scale = this.getRandomDistace(5, 10) * 0.1;
        element.node.scale = new Vec2(scale, scale);
    }



    getRandomDistace(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}



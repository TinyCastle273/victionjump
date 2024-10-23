import { _decorator, CCFloat, Component, Node, screen, UITransform, Vec2, Vec3 } from 'cc';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Clouds')
export class Clouds extends Component {
    @property(GameController)
    public gameController: GameController;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public cloudSpeed: number = 0.1;

    @property({
        type: CCFloat,
    })
    public cloudScaleRandomForm: number = 0.1;

    @property({
        type: CCFloat,
    })
    public cloudScaleRandomTo: number = 0.1;

    @property({
        type: CCFloat,
    })
    public randomDistanceFrom: number = 300;

    @property({
        type: CCFloat,
    })
    public randomDistanceTo: number = 400;


    @property({
        type: CCFloat,
    })
    public randomFromHeight: number = 0.1;

    @property({
        type: CCFloat,
    })
    public randomToHeight: number = 0.1;

    @property([UITransform])
    public cloudTransforms: UITransform[] = [];

    public lastCloud: Node;

    protected onLoad(): void {
        this.resetClouds();
    }

    resetClouds() {
        this.lastCloud = null;
        this.cloudTransforms.forEach(element => {
            this.setRandomElementPosition(element);
        });
    }

    protected update(dt: number): void {

        this.cloudTransforms.forEach(element => {
            let x = element.node.position.x - this.gameController.currentRunSpeed * dt * this.cloudSpeed;
            element.node.setPosition(new Vec3(x, element.node.position.y))

            if (element.node.position.x < -screen.windowSize.width / 2 - element.contentSize.x) {
                this.setRandomElementPosition(element);
            }
        });
    }

    setRandomElementPosition(element) {
        let startPoint = -screen.windowSize.width / 2;
        if (this.lastCloud)
            startPoint = this.lastCloud.position.x;
        let xG = startPoint + this.getRandomDistace(this.randomDistanceFrom, this.randomDistanceTo);
        let yG = this.getRandomDistace(this.randomFromHeight, this.randomToHeight)
        element.node.position = new Vec3(xG, yG);
        let scale = this.getRandomDistace(this.cloudScaleRandomForm, this.cloudScaleRandomTo) * 0.1;
        element.node.scale = new Vec2(scale, scale);
        this.lastCloud = element.node;
    }

    getRandomDistace(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}



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

    @property([UITransform])
    public grounds: UITransform[] = [];

    protected update(dt: number): void {
        let x = this.node.position.x - this.gameController.currentRunSpeed * dt * this.cloudSpeed;
        this.node.setPosition(new Vec3(x, this.node.position.y))
        this.grounds.forEach(element => {
            console.log(element.node.position.x);
            if (element.node.worldPosition.x < -screen.windowSize.width / 2 - element.width / 2) {
                let xG = screen.windowSize.width + element.width;
                element.node.setPosition(xG, element.node.position.y)
            }
        });
    }
}



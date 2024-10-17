import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Spike')
export class Spike extends Component {
    @property([Node])
    public spikeObjects: Node[] = [];

    setSpike(hardCore) {
        let min = 0;
        let max = this.spikeObjects.length - 2;
        if (hardCore)
            max = this.spikeObjects.length - 1;

        const random = Math.floor(Math.random() * (max - min + 1) + min);
        this.spikeObjects.forEach((element, index) => {
            element.active = index == random;
        });
    }
}



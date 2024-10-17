import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpikePool')
export class SpikePool extends Component {
    @property({
        type: Prefab,
        tooltip: 'The prefab of spike'

    })
    public prefabSpike = null;

    @property({
        type: Node,
        tooltip: 'Where the new spike go'
    })
    public spikePoolHome;

    public pool = new NodePool;

    start() {
        this.initPool();
    }

    initPool() {

        //build the amount of nodes needed at a time
        let initCount = 10;

        //fill up the node pool
        for (let i = 0; i < initCount; i++) {
            // create the new node
            let createSpike = instantiate(this.prefabSpike); //instantiate means make a copy of the orginal

            // put first one on the screen. So make it a child of the canvas.
            if (i == 0) {
                this.spikePoolHome.addChild(createSpike);
            } else {
                //put others into the nodePool
                this.pool.put(createSpike);
            }
        }

    }

    reset() {
    }
}



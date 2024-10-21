import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LogoPool')
export class LogoPool extends Component {
    @property({
        type: Prefab,
        tooltip: 'The prefab of spike'

    })
    public prefabLogo = null;

    @property({
        type: Node,
        tooltip: 'Where the new spike go'
    })
    public logoPoolHome;

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
            let createLogo = instantiate(this.prefabLogo); //instantiate means make a copy of the orginal

            // put first one on the screen. So make it a child of the canvas.
            //this.spikePoolHome.addChild(createSpike);
            this.pool.put(createLogo);
        }

    }
}



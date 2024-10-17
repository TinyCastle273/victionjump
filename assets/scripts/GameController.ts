import { _decorator, Component, Node, screen, CCFloat, director, Collider2D, Contact2DType, IPhysics2DContact, Vec3, Vec2, Scene } from 'cc';
import { MCController } from './MCController';
import { SpikePool } from './SpikePool';
import { Results } from './Results';
import { MCAudio } from './MCAudio';
import { Spike } from './Spike';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type: MCController,
        tooltip: "Add CharacterController node",
    })
    public mcController: MCController;

    @property({
        type: SpikePool,
        tooltip: "Add SpikePool node",
    })
    public spikePool: SpikePool;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public runSpeed: number = 10;

    @property({
        type: CCFloat,
        tooltip: 'Spike Distance?'
    })
    public spikeDistanceSpawnRandomFrom: number = 100;

    @property({
        type: CCFloat,
        tooltip: 'Spike Distance?'
    })
    public spikeDistanceSpawnRandomTo: number = 200;

    @property({
        type: Results,
        tooltip: "Add results here",
    })
    public result: Results;

    @property({
        type: MCAudio,
        tooltip: "add audio controller",
    })
    public clip: MCAudio;

    public isOver: boolean;
    public currentRunSpeed: number;
    public activeSpikes: Node[]
    public lastSpike: Node;

    onLoad() {

        //get listener started
        this.initListener();

        //reset score to zero
        this.result.resetScore();

        //game is over
        this.isOver = true;

        //pause the game
        director.pause();
    }

    initListener() {
        //if an mouse or finger goes down, do this
        this.node.on(Node.EventType.TOUCH_START, () => {
            if (this.isOver == true) {

                //reset everything and start the game again
                this.resetGame();
                this.mcController.reset();
                this.startGame();

            }

            if (this.isOver == false) {

                let jumping = this.mcController.jump();
                if (jumping)
                    this.clip.onAudioQueue(0);
            }

        })
    }


    //when the bird hits something, run this
    gameOver() {

        //show the results
        this.result.showResult();

        //game is over
        this.isOver = true;

        //make the game over sound
        this.clip.onAudioQueue(3);

        //pause the game
        director.pause();

    }


    resetGame() {
        //reset score, bird, and pipes
        this.result.resetScore();

        //reset the pipes
        if (this.activeSpikes) {
            this.activeSpikes.forEach(element => {
                this.spikePool.pool.put(element);
            });
        }
        this.activeSpikes = new Array();
        //game is starting
        this.isOver = false;
        this.lastSpike = null;
        this.currentRunSpeed = this.runSpeed;

        //get objects moving again
        this.startGame();
    }

    //what to do when the game is starting.
    startGame() {

        //hide high score and other text
        this.result.hideResult();

        //resume game
        director.resume();

    }

    //check if there was contact with the bird and objects
    contactSpike() {

        //make a collider call from the bird's collider2D component
        let collider = this.mcController.getComponent(Collider2D);

        //check if the collider hit other colliders
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }

    //if you hit something, tell the bird you did
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        //will be called once when two colliders begin to contact
        this.mcController.hitSomething = true;

        //make the hit sound
        this.clip.onAudioQueue(2);

    }

    //hit detection call
    mcStruck() {

        //make a call to the gameBrain to see if it hit something.
        this.contactSpike()

        //if we hit it, tell the game to call game over.
        if (this.mcController.hitSomething == true) {
            this.gameOver();
        }

    }

    //every time the game updates, do this
    update(deltaTime: number) {
        //if the game is still going, check if the bird hit something
        if (this.isOver == false) {
            this.mcStruck();
            this.spawnSpike();

            this.activeSpikes.forEach(element => {
                let x = element.position.x - this.currentRunSpeed * deltaTime;
                if (x < -screen.windowSize.width / 2) {
                    x = this.lastSpike.position.x + this.getRandomDistace();
                    this.lastSpike = element;
                }
                element.setPosition(new Vec3(x, element.position.y))
            });
        }

    }

    spawnSpike() {
        if (!this.spikePool.pool) return;
        if (this.spikePool.pool.size() <= 0) return;

        let spike = this.spikePool.pool.get();
        this.spikePool.spikePoolHome.addChild(spike);

        let currentSpikeDisntance = screen.windowSize.width / 2;
        if (this.lastSpike)
            currentSpikeDisntance = this.lastSpike.position.x + this.getRandomDistace();
        spike.setPosition(new Vec3(currentSpikeDisntance, 0));

        this.activeSpikes.push(spike);
        this.lastSpike = spike;
    }

    getRandomDistace() {
        let min = this.spikeDistanceSpawnRandomFrom;
        let max = this.spikeDistanceSpawnRandomTo;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}



import { _decorator, Component, Node, screen, CCFloat, director, Collider2D, Contact2DType, IPhysics2DContact, Vec3, Vec2, Scene, SystemEvent, systemEvent, input, Input, KeyCode } from 'cc';
import { MCController } from './MCController';
import { SpikePool } from './SpikePool';
import { Results } from './Results';
import { MCAudio } from './MCAudio';
import { Spike } from './Spike';
import { LogoPool } from './LogoPool';
import { Logo } from './Logo';
import { Quote } from './Quote';
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
        type: LogoPool,
        tooltip: "Add SpikePool node",
    })
    public logoPool: LogoPool;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public runSpeed: number = 10;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public hardCoreSpeed: number = 10;

    @property({
        type: CCFloat,
        tooltip: 'How fast does game take?'
    })
    public speedUpMultiplier: number = 2;

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
        type: CCFloat,
        tooltip: 'Logo per Spike?'
    })
    public LogoPerSpikeRandomFrom: number = 10;

    @property({
        type: CCFloat,
        tooltip: 'Logo per Spike?'
    })
    public LogoPerSpikeRandomTo: number = 12;


    @property({
        type: Results,
        tooltip: "Add results here",
    })
    public result: Results;

    @property({
        type: Quote,
        tooltip: "Add results here",
    })
    public quote: Quote;

    @property({
        type: MCAudio,
        tooltip: "add audio controller",
    })
    public clip: MCAudio;

    public isOver: boolean;
    public currentRunSpeed: number;
    public currentSpikeSpawned: number;
    public activeSpikes: Spike[]
    public lastSpike: Spike;

    public activeLogos: Logo[]
    public lastLogo: Logo;

    onLoad() {

        //get listener started
        this.initListener();

        //reset score to zero
        this.result.resetScore();

        this.quote.hide();

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
        })

        input.on(Input.EventType.KEY_DOWN, (event) => {
            if (event.keyCode == KeyCode.SPACE)
                this.handleOnTap();
        });
    }

    handleOnTap() {
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
    }


    //when the bird hits something, run this
    gameOver() {
        this.mcController.die();
        //show the results
        this.result.showResult();

        this.quote.hide();

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
        this.quote.hide();
        //reset the pipes
        if (this.activeSpikes) {
            this.activeSpikes.forEach(element => {
                this.spikePool.pool.put(element.node);
            });
        }
        this.activeSpikes = new Array();

        if (this.activeLogos) {
            this.activeLogos.forEach(element => {
                this.logoPool.pool.put(element.node);
            });
        }
        this.activeLogos = new Array();

        //game is starting
        this.isOver = false;
        this.lastSpike = null;
        this.lastLogo = null;
        this.currentRunSpeed = this.runSpeed;
        this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
        //get objects moving again
        this.startGame();
    }

    //what to do when the game is starting.
    startGame() {

        //hide high score and other text
        this.result.hideResult();
        this.quote.hide();
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

        if (otherCollider.name.includes("obstacle")) {
            //will be called once when two colliders begin to contact
            this.mcController.hitSomething = true;

            //make the hit sound
            this.clip.onAudioQueue(2);
            return;
        }

        let logo = otherCollider.getComponent(Logo);
        if (logo)
            this.handleOnGetLogo(logo);
    }

    handleOnGetLogo(logo) {
        if (logo.pass) return;

        logo.getLogo();
        this.quote.show(logo.currentLogoDetails.detail);
        this.result.addScore();
        this.clip.onAudioQueue(1);
        this.mcController.scoring();
        setTimeout(() => {
            this.quote.hide();
            this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
        }, logo.currentLogoDetails.duration * 1000);
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
            this.activeSpikes.forEach((element, index) => {
                let x = element.node.position.x - this.currentRunSpeed * deltaTime;
                if (x < -screen.windowSize.width / 2 - 50) {
                    this.spikePool.pool.put(element.node);
                    this.activeSpikes.splice(index, 1);
                }
                element.node.setPosition(new Vec3(x, element.node.position.y))
                if (x <= this.mcController.node.position.x && !element.pass) {
                    element.pass = true;
                    this.result.addScore();
                    this.clip.onAudioQueue(1);
                    this.mcController.scoring();
                }
            });

            this.activeLogos.forEach((element, index) => {
                let x = element.node.position.x - this.currentRunSpeed * deltaTime;
                if (x < -screen.windowSize.width / 2 - 50) {
                    this.logoPool.pool.put(element.node);
                    this.activeLogos.splice(index, 1);

                    if (!element.pass) {
                        this.onMissLogo();
                    }
                }
                element.node.setPosition(new Vec3(x, element.node.position.y))

            });

            this.currentRunSpeed += deltaTime * this.speedUpMultiplier;
        }

    }

    onMissLogo() {
        this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
    }

    spawnSpike() {
        if (!this.spikePool.pool) return;
        if (this.spikePool.pool.size() <= 0) return;
        if (this.currentSpikeSpawned <= 0) return;
        this.currentSpikeSpawned -= 1;


        let spike = this.spikePool.pool.get().getComponent(Spike);
        this.spikePool.spikePoolHome.addChild(spike.node);

        let currentSpikeDisntance = screen.windowSize.width / 2;
        if (this.lastSpike) {
            let spawnFromLastSpike = this.lastSpike.node.position.x + this.getRandom(this.spikeDistanceSpawnRandomFrom, this.spikeDistanceSpawnRandomTo);
            if (currentSpikeDisntance < spawnFromLastSpike)
                currentSpikeDisntance = spawnFromLastSpike;
        }
        spike.node.setPosition(new Vec3(currentSpikeDisntance, this.mcController.floor));
        spike.setSpike(false);
        this.activeSpikes.push(spike);
        this.lastSpike = spike;

        if (this.currentSpikeSpawned == 0)
            this.spawnLogo();
    }

    spawnLogo() {
        if (!this.logoPool.pool) return;
        if (this.logoPool.pool.size() <= 0) return;
        let logo = this.logoPool.pool.get().getComponent(Logo);
        this.logoPool.logoPoolHome.addChild(logo.node);

        let currentSpikeDisntance = screen.windowSize.width / 2;
        if (this.lastSpike)
            currentSpikeDisntance = this.lastSpike.node.position.x + this.getRandom(this.spikeDistanceSpawnRandomFrom, this.spikeDistanceSpawnRandomTo);
        logo.node.setPosition(new Vec3(currentSpikeDisntance, this.mcController.floor + this.getRandom(0, this.mcController.jumpHeight)));
        logo.setLogo(0);
        this.activeLogos.push(logo);
        this.lastLogo = logo;
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }





}


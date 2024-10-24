import { _decorator, Component, Node, screen, CCFloat, director, Collider2D, Contact2DType, IPhysics2DContact, Vec3, Vec2, Scene, SystemEvent, systemEvent, input, Input, KeyCode, Sprite, tween, Color, Tween, Camera, VideoPlayer } from 'cc';
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
        type: VideoPlayer,
    })
    public videoPlayer: VideoPlayer;

    @property({
        type: Sprite,
    })
    public skySprite: Sprite;


    @property({
        type: SpikePool,
        tooltip: "Add SpikePool node",
    })
    public spikePool: SpikePool;

    @property({
        type: Logo,
    })
    public logo: Logo;

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
        tooltip: 'Logo Distance?'
    })
    public logoDistanceSpawnRandomFrom: number = 100;

    @property({
        type: CCFloat,
        tooltip: 'Logo Distance?'
    })
    public logoDistanceSpawnRandomTo: number = 200;


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

    @property({
        type: Sprite,
    })
    public introSprite: Sprite

    @property({
        type: Sprite,
    })
    public lastSceneSprite: Sprite

    @property({
        type: Camera,
    })
    public mainCamera: Camera


    public isOver: boolean;
    public isWin: boolean;
    public currentRunSpeed: number;
    public currentSpikeSpawned: number;
    public activeSpikes: Spike[]
    public lastSpike: Spike;

    public godMode: boolean;
    public speedUp: boolean;
    public cheatKey: String;

    public currentLogoIndex: number;
    onLoad() {

        //get listener started
        this.initListener();

        //reset score to zero
        this.result.resetScore();

        this.quote.hide();

        //game is over
        this.isOver = true;

        this.isWin = false;
        this.videoPlayer.play();
        //pause the game
        director.pause();
        this.godMode = false;
        this.cheatKey = "";
        this.logo.node.active = false;
        this.currentLogoIndex = 0;

        this.lastSceneSprite.node.active = false;
        this.introSprite.node.active = true;
        tween(this.introSprite)
            .to(1, {
                color: {
                    value: new Color(1, 1, 1, 0),
                    easing: 'quadOut'
                }
            }).call(() => {
                this.introSprite.node.active = false;
            }).start();
    }

    initListener() {
        //if an mouse or finger goes down, do this
        this.node.on(Node.EventType.TOUCH_START, () => {
            if (this.isWin)
                return;
            if (this.isOver == true) {
                //reset everything and start the game again
                this.resetGame();
                this.mcController.reset();
                this.startGame();

            }
        })


        input.on(Input.EventType.KEY_DOWN, (event) => {
            if (this.isWin)
                return;

            if (event.keyCode == KeyCode.SPACE)
                this.handleOnTap();
            else {
                let char = (String.fromCharCode(event.keyCode));
                this.cheatKey = this.cheatKey.concat(char);
                if (this.cheatKey.length > 50)
                    this.cheatKey = "";
                if (this.cheatKey.includes("VICTION")) {
                    this.godMode = !this.godMode;
                    console.log("godMode: " + this.godMode);
                    this.cheatKey = "";
                }

                if (this.cheatKey.includes("SPEEDUP")) {
                    this.speedUp = !this.speedUp;
                    if (this.speedUp)
                        this.currentRunSpeed *= 2;
                    else
                        this.currentRunSpeed /= 2;
                    console.log("speedUp: " + this.speedUp);
                    this.cheatKey = "";
                }

                if (this.cheatKey.includes("WIN")) {
                    this.currentLogoIndex = this.logo.logoDetails.length;
                    this.cheatKey = "";
                    console.log("Win!!!");
                }
            }

        });
    }

    handleOnTap() {
        if (this.isWin)
            return;

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
        this.videoPlayer.stop();

        this.mcController.normalFace();
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

    gameWin() {
        if (this.isWin)
            return;
        this.isWin = true;

        let tweenCharacter = tween(this.mcController.node).delay(1)
            .to(1.5, {
                position: {
                    value: new Vec3(0, this.mcController.floor),
                }
            }).call(() => {
                this.mcController.smileFace();
            }).delay(1);

        let baseOrthoHeight = this.mainCamera.orthoHeight;

        let zoomInDuration = 0.2;

        let tweenCameraZoomIn = tween(this.mainCamera).
            to(zoomInDuration, {
                orthoHeight: {
                    value: 0
                }
            });

        let tweenCameraMoveIn = tween(this.mainCamera.node).
            to(zoomInDuration, {
                position: {
                    value: new Vec3(0, this.mcController.node.position.y + this.mcController.uiTransform.contentSize.y * 0.5, this.mcController.node.position.z)
                }
            })

        // let zoomOutDuration = 0.01;
        // let tweenCameraZoomOut = tween(this.mainCamera).
        //     to(zoomOutDuration, {
        //         orthoHeight: {
        //             value: baseOrthoHeight,
        //             easing: "cubicOut"
        //         }
        //     });

        // let tweenCameraMoveOut = tween(this.mainCamera.node).
        //     to(zoomOutDuration, {
        //         position: {
        //             value: Vec3.ZERO,
        //             easing: "cubicOut"
        //         }
        //     });
        this.lastSceneSprite.color = Color.BLACK;
        let tweenLastScene = tween(this.lastSceneSprite).
            to(0.5, {
                color: Color.WHITE
            }
            );

        tween(this.node).then(tweenCharacter).call(() => {
            this.skySprite.enabled = true;
            this.videoPlayer.node.active = false;
        }).parallel(tweenCameraZoomIn, tweenCameraMoveIn).call(() => {
            this.lastSceneSprite.node.active = true;
            this.mainCamera.orthoHeight = baseOrthoHeight;
            this.mainCamera.node.position = Vec3.ZERO;
        }).then(tweenLastScene).start();

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

        this.logo.node.active = false;

        //game is starting
        this.isOver = false;
        this.lastSpike = null;
        this.currentRunSpeed = this.runSpeed;
        this.currentLogoIndex = 0;
        this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
        //get objects moving again
        this.startGame();
    }

    //what to do when the game is starting.
    startGame() {
        this.videoPlayer.play();
        //hide high score and other text
        this.result.hideResult();
        this.quote.hide();
        this.logo.node.active = false;
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
            if (!this.godMode) {
                //will be called once when two colliders begin to contact
                this.mcController.hitSomething = true;

                //make the hit sound
                this.clip.onAudioQueue(2);
            }
            return;
        }

        let logo = otherCollider.getComponent(Logo);
        if (logo)
            this.handleOnGetLogo(logo);
    }

    handleOnGetLogo(logo) {
        if (logo.pass) return;

        logo.getLogo();
        this.result.addScore();
        this.clip.onAudioQueue(1);
        this.mcController.smileFace();
        let logoDuration = logo.getDuration();
        if (this.speedUp)
            logoDuration = 100;

        if (logoDuration > 0) {
            //Show Quote
            this.quote.show(logo.currentLogoDetails.detail);
            setTimeout(() => {
                this.quote.hide();
                this.mcController.normalFace();
            }, logoDuration);

            setTimeout(() => {
                this.nextRound();
            }, logoDuration - 1000);

        } else {
            //Get Logo Only
            this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
            setTimeout(() => {
                this.mcController.normalFace();
            }, 1000)
        }
    }


    nextRound() {
        if (this.currentLogoIndex >= this.logo.logoDetails.length) {
            this.gameWin();
            return;
        }
        this.currentSpikeSpawned = this.getRandom(this.LogoPerSpikeRandomFrom, this.LogoPerSpikeRandomTo);
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
                    //this.result.addScore();
                    //this.clip.onAudioQueue(1);
                    //this.mcController.smileFace();
                }
            });

            if (this.logo.node.active) {

                let x = this.logo.node.position.x - this.currentRunSpeed * deltaTime;
                if (x < -screen.windowSize.width / 2 - 50) {
                    this.logo.node.active = false;

                    if (!this.logo.pass) {
                        this.nextRound();
                    }
                }
                this.logo.node.setPosition(new Vec3(x, this.logo.node.position.y))
            }


            this.currentRunSpeed += deltaTime * this.speedUpMultiplier;
        }

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
        let currentSpikeDisntance = screen.windowSize.width / 2;
        if (this.lastSpike)
            currentSpikeDisntance = this.lastSpike.node.position.x + this.getRandom(this.logoDistanceSpawnRandomFrom, this.logoDistanceSpawnRandomTo);
        let height = (this.getRandom(0, 1) == 0) ? this.mcController.floor : this.mcController.floor + this.mcController.jumpHeight;
        this.logo.node.setPosition(new Vec3(currentSpikeDisntance, height));
        this.logo.node.active = true;
        this.logo.setLogo(this.currentLogoIndex);
        this.currentLogoIndex += 1;
    }

    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }





}


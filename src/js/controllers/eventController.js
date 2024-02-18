import InputController from "./inputController.js";
import DialogController from "./dialogController.js";
import LightingController from "./lightingController.js";
import AudioController from "./audioController.js";


export default class EventController {
    constructor() {
        this.audioController = new AudioController();
        this.inputController = new InputController();
        this.dialogController = new DialogController({
            inputController: this.inputController,
            audioController: this.audioController
        });
        this.lightingController = new LightingController({audioController: this.audioController});
        this.scene = undefined;
        this.loading = false;


    }

    async triggerEvent(event) {
        
        // If loading stop events
        if(this.loading) {return}

        // Non-blocking events
        if(event.longSound){
            this.audioController.playLongSound(event.longSound);
        }
        if(event.soundEffect){
            this.audioController.playSoundEffect(event.soundEffect);
        }
        if(event.music){
            this.audioController.playMusic(event.music);
        }
        if(event.lightOn) {
            this.lightingController.onLight(event.lightOn);
        }
        if(event.lightOff) {
            this.lightingController.offLight(event.lightOff);
        }
        if(event.lightToggle) {
            this.lightingController.toggleLight(event.lightToggle);
        }

        // Blocking events
        if(event.dialog){
            const result = await this.dialogController.handleDialog(event.dialog);
            // Unlock event if unlockEvent
            if(result.unlockEvent){
                this.lockedEvents[result.unlockEvent] = true;
            }
            // Load scene if destination
            if(result.dest){
                this.loadScene(result.dest, result.playerLocation);
            }
            if(result.dialog){
                this.triggerEvent({dialog: result.dialog})
            }
        }
        else if(event.door){
            this.loadScene(event.door, event.playerLocation)
        }
   
    }

    async loadScene(sceneName, playerStartingLocation){
        this.loading = true;
        // If there is already a scene loaded we need to clean up the scene
        if(this.scene){
            this.scene.characterController.isEnabled=false;
            await this.lightingController.fadeOut()
            this.scene.cleanUp();
            this.audioController.cleanUp(sceneName);
        }
        // No scene loaded so just load one up
        else{
            this.audioController.sceneStart(sceneName)
        }
        // Dynamicly import scene file
        const module = await import(`../scenes/${sceneName}.js`)
        
        const loadedModule = async (module) => {
            const SceneClass = module.default;

            // Create a new scene
            this.scene = new SceneClass({
                eventController: this,
                inputController: this.inputController,
                lightingController: this.lightingController,
                playerStartingLocation,
            });
            // Update dialog controeller with new scene
            this.dialogController.currentScene = this.scene;
            // Update lighting controller with new scene
            this.lightingController.currentScene = this.scene;
            await this.lightingController.fadeIn()
            this.loading = false;
            this.scene.start();
        }
        loadedModule(module);

    }

    splashScreenInit(){
        this.audioController.init();
        this.loadScene("chapter1/bedroom", {x:-50, y: 10});
    }


}
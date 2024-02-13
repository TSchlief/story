import InputController from "./inputController.js";
import DialogController from "./dialogController.js";
import LightingController from "./lightingController.js";
import AudioController from "./audioController.js";


export default class EventController {
    constructor() {
        this.inputController = new InputController();
        this.dialogController = new DialogController({inputController: this.inputController});
        this.lightingController = new LightingController();
        this.audioController = new AudioController();
        this.scene = undefined;
        this.loading = false;
        this.loadScene("startSceneBedroom");
    }

    async triggerEvent(event) {
        // If loading stop events
        if(this.loading) {return}

        if(event.door){
            this.loadScene(event.door)
        }
        else if(event.dialog){
            const result = await this.dialogController.handleDialog(event.dialog);

            // Load scene if destination
            if(result.dest){
                this.loadScene(result.dest);
            }
            if(result.dialog){
                this.triggerEvent({dialog: result.dialog})
            }
            console.log("dialog Results",result)
        }
        else if(event.lightOn) {
            this.lightingController.onLight(event.lightOn);
        }
        else if(event.lightOff) {
            this.lightingController.offLight(event.lightOff);
        }
        else if(event.lightToggle) {
            this.lightingController.toggleLight(event.lightToggle);
        }
        else{
            console.error("unhandled event!", event.lightOn)
        }
        
    }

    async loadScene(sceneName){
        this.loading = true;
        if(this.scene){
            this.scene.characterController.isEnabled=false;
            await this.lightingController.fadeOut()
            this.scene.cleanUp();
        }
        
        const module = await import(`../scenes/${sceneName}.js`)
        
        const loadedModule = async (module) => {
            const SceneClass = module.default;
          

            // Create a new scene
            this.scene = new SceneClass({
                eventController: this,
                inputController: this.inputController,
                lightingController: this.lightingController,
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


}
import InputController from "./inputController.js";
import DialogController from "./dialogController.js";


export default class EventController {
    constructor() {
        this.inputController = new InputController();
        this.dialogController = new DialogController({inputController: this.inputController});
        this.scene = undefined;
        this.loadScene("startScene");
    }

    async triggerEvent(event) {
        console.log(event)
        if(event.type === "door"){
            this.loadScene(event.dest)
        }
        else if(event.type === "dialog"){
            const result = await this.dialogController.handleDialog(event.code);

            // Load scene if destination
            if(result.dest){
                this.loadScene(result.dest);
            }
            if(result.dialog){
                this.triggerEvent({type: "dialog", code: result.dialog})
            }
            console.log("dialog Results",result)
        }
        else{
            console.error("unhandled event!")
        }
        
    }

    loadScene(sceneName){
        import(`../scenes/${sceneName}.js`).then(module => {
            const SceneClass = module.default;
            if(this.scene){
                this.scene.cleanUp();
            }

            // Create a new scene
            this.scene = new SceneClass({
                eventController: this,
                inputController: this.inputController
            });
            // Update dialog controeller with new scene
            this.dialogController.currentScene = this.scene;
        });
    }


}
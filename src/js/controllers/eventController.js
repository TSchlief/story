import InputController from "./inputController.js";


export default class EventController {
    constructor() {
        this.inputController = new InputController();
        this.scene = undefined;
        this.loadScene("startScene");
    }

    triggerEvent(eventName) {
        console.log(eventName)
        if(eventName === "door"){
            this.loadScene("secondScene")
        }
        if(eventName === "window"){
            this.loadScene("startScene")
        }
    }

    loadScene(sceneName){
        import(`../scenes/${sceneName}.js`).then(module => {
            const SceneClass = module.default;
            if(this.scene){
                this.scene.cleanUp();
            }

            this.scene = new SceneClass({
                eventController: this,
                inputController: this.inputController
            });
        });
    }


}
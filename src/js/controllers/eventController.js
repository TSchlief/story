import InputController from "./inputController.js";


export default class EventController {
    constructor() {
        this.inputController = new InputController();
        
        this.scene = undefined;
        this.loadScene("startScene");
    }

    triggerEvent(event) {
        console.log(event)
        if(event.type === "door"){
            this.loadScene(event.dest)
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
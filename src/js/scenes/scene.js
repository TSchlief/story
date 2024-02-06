

export default class Scene {
    constructor(config) {
        
        this.mainCanvas = document.getElementById('mainCanvas');
        this.ctx = mainCanvas.getContext('2d');
        this.inputController = config.inputController;
        this.eventController = config.eventController;

        this.inputController.changeRemote(this.input.bind(this))
    }

    input(input){
        console.log(input);
    }
    cleanUp(){
        this.inputController = undefined;
        this.eventController = undefined;
    }


}
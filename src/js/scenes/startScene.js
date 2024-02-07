
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import { mapBoundry } from '../boundryLayers/largeMap.js';
import CharacterController from '../controllers/characterController.js';
import Boundry from '../objects/boundry.js';
import { displayOffset, displaySize } from '../config.js';

export default class startScene extends Scene{

    constructor(config) {
        super(config);
        this.CharacterController = new CharacterController({scene: this});
        this.boundryLayer = mapBoundry;
        this.staticBoundries = {};
        this.sceneObjects = {};
        this.boundries = true;
        this.timeStamp = Date.now();
        this.playerSpeed = 0.07;
        this.centerMap = false;
        

        

        this.init();
    }

    cleanUp() {
        super.cleanUp();
        this.CharacterController = undefined;
    }

    contructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/largeMap.png"
        })
        

        this.player = new Sprite({
            
            position: {x:-65, y: -3},
            parent: this.map,
            image: "/src/img/grass1.png"
        })

        const door = new Boundry({   
            parent: this.map,
            event: {type:"door", dest:"secondScene"} ,
            boundry: {
                "left": 104,
                "top": 80,
                "right": 105,
                "bottom": 95
            }
        });

        
        this.sceneObjects = {door}
    }

    // Run anthing that requires updating
    update(dt){
        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.CharacterController.update(dt);

        
        this.map.draw();
        this.player.draw();
        if(this.boundries){
            this.drawBoundries(this.staticBoundries);
        }
        this.drawBoundries(this.sceneObjects);
    }

    // Fires when any input is detected
    input(input){
        
        if(input.code === "KeyB"){
            if(this.boundries){
                this.boundries = false;
            }
            else{
                this.boundries = true;
            }
        }
        
        if(input.code === "KeyP"){ //debugging
            console.log(this.player)
        }           
        if(input.code === "KeyC"){ //debugging
            this.CharacterController.isEnabled = false;
        }        
        if(input.code === "KeyV"){ //debugging
            this.CharacterController.isEnabled = true;
        }
        
        if(input.code === "BracketRight"){ //debugging
            window.open('/mapEditor', '_blank');
        }
        if(input.code === "mainAction"){
            const mapCoods = {
                x: input.localCoords.x - this.map.localPosition.x,
                y: input.localCoords.y - this.map.localPosition.yw
            }
            console.log(mapCoods)
        }
    }

    drawBoundries(objGroup){
        for (let key in objGroup){
            if (objGroup.hasOwnProperty(key)) {
                const obj = objGroup[key];
                const x = Math.round(obj.boundingRect.left);
                const y = Math.round(obj.boundingRect.top);
                const width = obj.size.width;
                const height = obj.size.height;
                
        
                
                this.ctx.fillStyle = "red"; // Change the fill color here
                this.ctx.fillRect(x , y , width, height);
            }
        }
        
   
            
        
    }


     // Turn boundry layer data into game objects
     createStaticBoundries(){
        for (let key in this.boundryLayer){
            if (this.boundryLayer.hasOwnProperty(key)) {
                const obj = this.boundryLayer[key];
                this.staticBoundries[key] = new Boundry({
                    parent: this.map,
                    boundry: obj
                });
            }
        }
        // Set maps position to its own position to propagate child positions
        this.map.position = this.map.localPosition
    }

    // Try to center map on player location
    centeringMap() {
        // Check if we should center map
        if(!this.centerMap) {
            this.animationLoop();
            return;
        }

        // Check if map is loaded if not try again
        if(!this.map.imageLoaded){
            setTimeout(()=>this.centeringMap(), 10)
            return;
        }
        

        let mapX = -this.player.localPosition.x;
        let mapY = -this.player.localPosition.y;
        let overFlowX = 0;
        let overFlowY = 0;
        
        this.map.position = { x: mapX, y: mapY }
        // If both conditions are true then map is smaller than display size dont worry about showing map edges
        if(this.map.boundingRect.top > -1 && this.map.boundingRect.bottom < displaySize.y+1){

        }
        else{
            if(this.map.boundingRect.top > -1){
                overFlowY -= this.map.boundingRect.top;
            }
            
            if(this.map.boundingRect.bottom < displaySize.y+1){
                overFlowY += displaySize.y-this.map.boundingRect.bottom;
            }

        }
        // If both conditions are true then map is smaller than display size dont worry about showing map edges
        if(this.map.boundingRect.left > -1 && this.map.boundingRect.right < displaySize.x+1){

        }
        else{

            if(this.map.boundingRect.left > -1){
                overFlowX -= this.map.boundingRect.left;
            }
            
            if(this.map.boundingRect.right < displaySize.x+1){
                overFlowX += displaySize.x-this.map.boundingRect.right;
            }
        }
    
        this.map.position = {
            x: this.map.localPosition.x + overFlowX,
            y: this.map.localPosition.y + overFlowY
        }
        this.animationLoop();
      
    }

    // Initialization 
    init(){
        this.contructSceneObjects();
        this.createStaticBoundries();
        this.centeringMap();
    }

    // Runs the update loop
    animationLoop = () => {
        try{
            const now = Date.now();
            this.update(now-this.timeStamp);
            this.timeStamp = now;
            requestAnimationFrame(this.animationLoop);
        }
        catch(error){
            
        }
    }
    
}







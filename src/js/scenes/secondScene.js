
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
        

        

        this.init();
    }

    cleanUp() {
        super.cleanUp();
        this.CharacterController = undefined;
    }

    contructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/tinyMap.png"
        })
        

        this.player = new Sprite({
            parent: this.map,
            position: {x:-46, y:-3},
            image: "/src/img/grass1.png"
        })

        const door = new Boundry({   
            parent: this.map,
            event: {type:"door", dest:"startScene"} ,
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

        
        this.map.draw()
        this.player.draw()
        if(this.boundries){
            this.drawBoundries();
        }
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
            console.log(this.map.boundingRect)
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
    }

    drawBoundries(){
        for (let key in this.staticBoundries){
            if (this.staticBoundries.hasOwnProperty(key)) {
                const obj = this.staticBoundries[key];
                const x = Math.round(obj.boundingRect.left);
                const y = Math.round(obj.boundingRect.top);
                const width = obj.size.width;
                const height = obj.size.height;
                
        
                
                this.ctx.fillStyle = "red"; // Change the fill color here
                this.ctx.fillRect(x , y , width, height);
            }
        }
        
            
                const obj = this.sceneObjects.door;
                const x = Math.round(obj.boundingRect.left);
                const y = Math.round(obj.boundingRect.top);
                const width = obj.size.width;
                const height = obj.size.height;
                
        
                
                this.ctx.fillStyle = "red"; // Change the fill color here
                this.ctx.fillRect(x , y , width, height);
            
        
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
    }

    // Try to center map on player location
    centerMap() {
        if(!this.map.imageLoaded){
            setTimeout(()=>this.centerMap(), 10)
            return;
        }
        //this.animationLoop();
       
        
        console.log("centering map", this.player.position, this.player.localPosition, this.player.origin)
        console.log(this.map.position, this.map.localPosition, this.map.origin)
        let mapX = -this.player.localPosition.x;
        let mapY = -this.player.localPosition.y;
        let overFlowX = 0;
        let overFlowY = 0;
        let centerX = 0;
        let centerY = 0;
        this.map.position = { x: mapX, y: mapY }

        if(this.map.boundingRect.top > -1){
            overFlowY -= this.map.boundingRect.top;
            centerY++;
            console.log('here')
        }
    
        if(this.map.boundingRect.bottom < displaySize.y+1){
            overFlowY += displaySize.y-this.map.boundingRect.bottom;
            centerY++;
            console.log('here1')
        }
        
        if(this.map.boundingRect.left > -1){
            overFlowX -= this.map.boundingRect.left;
            centerX++;
            console.log('here2')
        }
        
         if(this.map.boundingRect.right < displaySize.x+1){
            overFlowX += displaySize.x-this.map.boundingRect.right;
            centerX++;
            console.log('here3')
        }
        if(centerX === 2){
            overFlowX = this.player.localPosition.x;
            console.log('overflowx')
        }
        if(centerY === 2){
            overFlowY = this.player.localPosition.y;
            console.log('overflowy')
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
        this.centerMap();
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







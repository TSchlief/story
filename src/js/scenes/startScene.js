
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import { mapBoundry } from '../boundryLayers/largeMap.js';
import GameObject from '../objects/gameObject.js';
import CharacterController from '../controllers/characterController.js';
import Boundry from '../objects/boundry.js';

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
            position: {x:0, y: 0},
            image: "/src/img/largeMap.png"
        })
        

        this.player = new Sprite({
            parent: this.map,
            image: "/src/img/grass1.png"
        })

        const door = new Boundry({   
            parent: this.map,
            event: "door",
            boundry: {
                "left": 192,
                "top": 80,
                "right": 208,
                "bottom": 96
            }
        });

        this.sceneObjects = {door}
    }

    // Run anthing that requires updating
    update(dt){
        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.CharacterController.update(dt);

        
        this.map.draw()
        console.log(this.map)
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
        
        if(input.code === "BracketRight"){
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



    // Initialization 
    init(){
        this.contructSceneObjects();
        this.animationLoop();
        this.createStaticBoundries();
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







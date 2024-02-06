
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import { mapBoundry } from '../boundryLayers/tinyMap.js';
import GameObject from '../objects/gameObject.js';
import CharacterController from '../controllers/characterController.js';
import Boundry from '../objects/boundry.js';

export default class startScene extends Scene{

    constructor(config) {
        super(config);
        this.mainCanvas = document.getElementById('mainCanvas');
        this.ctx = mainCanvas.getContext('2d');
        this.CharacterController = new CharacterController({scene: this});
        this.boundryLayer = mapBoundry;
        this.staticBoundries = {};
        this.sceneObjects = {};
        this.boudries = true;
 
        this.timeStamp = Date.now();
        this.playerSpeed = 0.07;

        this.init();
    }

    contructSceneObjects() {
        this.map = new Sprite({
            position: {x:-20, y: -20},
            image: "/src/img/tinyMap.png"
        })
        

        this.player = new Sprite({
            parent: this.map,
            image: "/src/img/grass1.png"
        })

        const door = new Boundry({   
            parent: this.map,
            event: "window",
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
        this.player.draw()
        if(this.boudries){
            this.drawBoundries();
        }
    }

    // Fires when any input is detected
    input(input){
        if(input.code === "KeyB"){
            if(this.boudries){
                this.boudries = false;
            }
            else{
                this.boudries = true;
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







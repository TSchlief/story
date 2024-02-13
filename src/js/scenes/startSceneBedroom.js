
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import Boundry from '../objects/boundry.js';
import LightEmitter from '../objects/light.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config); 
        
        
    }

    start(){
        this.eventController.triggerEvent({dialog:1})
    }


    contructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/startSceneBedroom.png"
        })
        
        this.player = new Sprite({
            position: {x:-50, y: 10},
            boundingRect: {top:-28, left:-1, right:-1},
            parent: this.map,
            image: "/src/img/player.png"
        })

        const desk = new Sprite({
            position: {x:90, y: 45},
            boundingRect: {top:-13},
            zHeight:-10,
            moveable: "down",
            parent: this.map,
            image: "/src/img/furniture/deskVerticlePlain.png"
        })

        const chair = new Sprite({
            position: {x:72, y: 45},
            event:{lighting: 1},
            boundingRect: {top:-13, right:-10},
            parent: this.map,
            image: "/src/img/furniture/chairLeftPlain.png"
        })        
        
        const door = new Boundry({   
            parent: this.map,
            event: {dialog: 2} ,
            color:"green",
            boundry: {
                "left": -31,
                "top": -17,
                "right": -2,
                "bottom": -9
            }
        });
        

 

        
    
        this.sceneObjects = [this.player, desk, chair, door]
    }
    
    constructLightObjects() {
        // Define lightobjects here

        // Add lightobjects to list
        this.lightObjects =[];
    }
    
    loadBoundryLayer() {
        this.boundryLayer = {
            "topWall": {
                "left": -130,
                "top": -30,
                "right": 84,
                "bottom": -13
            },

            "bed": {
                "left": -106,
                "top": -14,
                "right": -61,
                "bottom": 45
            },

            "leftwall": {
                "left": -121,
                "top": -29,
                "right": -107,
                "bottom": 108
            },

            "bottomWall": {
                "left": -107,
                "top": 94,
                "right": 105,
                "bottom": 108
            },

            "rightwall": {
                "left": 106,
                "top": -10,
                "right": 127,
                "bottom": 100
            },

            "topLeftFuriture": {
                "left": 23,
                "top": -31,
                "right": 105,
                "bottom": -1
            },
            
    
           
        };

    }
}
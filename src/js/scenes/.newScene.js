
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import Boundry from '../objects/boundry.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config);        
    }

    start(){
        // Run starting dialog or event here
    }

    constructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/largeMap.png"
        })
        
        this.player = new Sprite({
            position: {x:0, y: 0},
            boundingRect: {top:-20},
            parent: this.map,
            image: "/src/img/player.png"
        })
        // Additional Objects
        const newObject = new Sprite({
            position: {x:0, y: 0},
            boundingRect: {top:-20},
            parent: this.map,
            image: "/src/img/player.png"
        })

        

        
        this.sceneObjects = [this.player, newObject]
    }

    constructLightObjects() {
        // Define lightobjects here

        // Add lightobjects to list
        this.lightObjects =[];
    }
    loadBoundryLayer() {
        this.boundryLayer = {
            "newBoundry": {
                "left": 0,
                "top": 0,
                "right": 0,
                "bottom": 0
            },
            
        };

    }
}
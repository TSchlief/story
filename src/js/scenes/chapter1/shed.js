
import Scene from '../scene.js';
import Sprite from "../../objects/sprite.js";
import Boundry from '../../objects/boundry.js';
import Light from '../../objects/light.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config);        
        this.darkness = 0;
    }

    start(){
        // Run starting dialog or event here
        this.characterController.isEnabled = true;
    }

    constructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/largeMap.png"
        })
        
        this.player = new Sprite({
            position: this.playerStartingLocation,
            boundingRect: {top:-28, left:-1, right:-1},
            parent: this.map,
            image: "/src/img/thorn.png"
        })
        // Additional Objects
        const newObject = new Sprite({
            position: {x:0, y: 0},
            boundingRect: {top:-20},
            parent: this.map,
            image: "/src/img/kaois.png"
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
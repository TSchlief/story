
import Scene from './scene.js';
import Sprite from "../objects/sprite.js";
import Boundry from '../objects/boundry.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config);        
    }


    start(){
        // Run starting dialog or event here
        this.characterController.isEnabled = true;
    }

    constructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/acreage.png"
        })
        

        this.player = new Sprite({
            position: {x:0, y: 0},
            boundingRect: {top:-20, left:-10, right:-10},
            parent: this.map,
            image: "/src/img/player.png"
        })

   

        const door = new Boundry({   
            parent: this.map,
            event: {type:"dialog", dest:"secondScene"} ,
            boundry: {
                "left": -25,
                "top": 111,
                "right": -11,
                "bottom": 121
            }
        });


        const houseRoof = new Sprite({
            parent: this.map,
            position: {x:-29, y: 75},
            traversable: true,
            zHeight:-30,
            hasBoundingRect: false,
            image: "/src/img/acreageHouse.png"
        })

             

        const sign = new Sprite({
            event: {door: "startSceneBedroom"},
            parent: this.map,
            position: {x:30, y: 0},
            image: "/src/img/sign.png"
        })

        const tree = new Sprite({
            event: {type: "dialog", code: 4},
            parent: this.map,
            position: {x:-200, y: 90},
            zHeight: -15,
            boundingRect: {top:-70, bottom:-2, left: -10, right: -12},
            image: "/src/img/largeTree.png"
        })
        

        
        this.sceneObjects = [this.player,  houseRoof,door, sign, tree]
    }

    constructLightObjects() {
        // Define lightobjects here

        // Add lightobjects to list
        this.lightObjects =[];
    }

    loadBoundryLayer() {
        this.boundryLayer = {
            "houseLeft": {
                "left": -4,
                "top": 63,
                "right": 35,
                "bottom": 133
            },
            "houseRight": {
                "left": -93,
                "top": 63,
                "right": -31,
                "bottom": 133
            },
            "houseTop": {
                "left": -32,
                "top": 63,
                "right": 4,
                "bottom": 95
            }
        };

    }
}
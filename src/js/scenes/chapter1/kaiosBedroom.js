
import Scene from '../scene.js';
import Sprite from "../../objects/sprite.js";
import Boundry from '../../objects/boundry.js';
import Light from '../../objects/light.js';
import Character from '../../objects/character.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config);        
        this.darkness = 0.7;
    }

    start(){
        // Run starting dialog or event here
        this.characterController.isEnabled = true;
    }

    constructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/kaoisBedroom.png"
        })
        
        this.player = new Character({
            position: this.playerStartingLocation,
            inputController: this.inputController,
            characterController: this.characterController,
            size: {width:16, height:32},
            boundingRect: {top:-28, left:-1, right:-1},
            parent: this.map,
            image: "/src/img/thornSpriteSheet.png"
        })
        // Additional Objects
        const kaois = new Sprite({
            position: {x:0, y: 0},
            boundingRect: {top:-28, left:-1, right:-1},
            event:{dialog: 12},
            parent: this.map,
            image: "/src/img/kaios.png"
        })

        
        const hallway = new Boundry({
            parent: this.map,
            traversable: true,
            event: {door: "chapter1/hallway", playerLocation: {x: 3, y: 14}},
            color:"blue",
            boundry: {
                "left": -64,
                "top": 99,
                "right": -29,
                "bottom": 106
            }
        });
        const ls = new Boundry({
            parent: this.map,
            traversable: true,
            action: {lightToggle: 3},
            color:"blue",
            boundry: {
                "left": -86,
                "top": 75,
                "right": -65,
                "bottom": 107
            }
        });

        const dresser = new Sprite({
            position: {x:44, y: -24},
            parent: this.map,
            image: "/src/img/furniture/dresserFrontPlain.png"
        })

        const shelf = new Sprite({
            position: {x:-100, y: -34},
            parent: this.map,
            image: "/src/img/furniture/shelfFrontPlain.png"
        })
        const table = new Sprite({
            position: {x:99, y: 72},
            boundingRect: {top:-13},
            parent: this.map,
            image: "/src/img/furniture/smallTable.png"
        })
        const chair = new Sprite({
            position: {x:70, y: 69},
            boundingRect: {top:-13, right:-10},
            parent: this.map,
            image: "/src/img/furniture/chairLeftPlain.png"
        })
        

        
        this.sceneObjects = [this.player, kaois, hallway, ls, dresser,shelf, table, chair]
    }

    constructLightObjects() {
        // Define lightobjects here

        const light= new Light({
            parent: this.map,
            lightId: 3,
            radius: 120,
            lightingController: this.lightingController,
            position: {x: -6, y:34}
            
        })   
        // Add lightobjects to list
        this.lightObjects =[light];
    }
    loadBoundryLayer() {
        this.boundryLayer = {
            "door": {
                "left": -63,
                "top": 102,
                "right": -22,
                "bottom": 110
            },
            "bottomLeft": {
                "left": -125,
                "top": 96,
                "right": -61,
                "bottom": 102
            },
            "bottomRight": {
                "left": -31,
                "top": 95,
                "right": 125,
                "bottom": 104
            },
            "left": {
                "left": -138,
                "top": -104,
                "right": -121,
                "bottom": 95
            },
            "right": {
                "left": 119,
                "top": -100,
                "right": 132,
                "bottom": 100
            },
            "top": {
                "left": -133,
                "top": -46,
                "right": 121,
                "bottom": -18
            },
            "bed": {
                "left": 75,
                "top": -18,
                "right": 118,
                "bottom": 41
            },
            
        };

    }
}
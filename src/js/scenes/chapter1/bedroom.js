
import Scene from '../scene.js';
import Sprite from "../../objects/sprite.js";
import Character from "../../objects/character.js";
import Boundry from '../../objects/boundry.js';
import Light from '../../objects/light.js';

export default class startScene extends Scene{
    constructor(config) {
        super(config); 
        
        this.darkness =0.7;
        
    }

    start(){
        this.eventController.triggerEvent({dialog:1})
    }


    constructSceneObjects() {
        this.map = new Sprite({
            image: "/src/img/maps/startSceneBedroom.png"
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

        const desk = new Sprite({
            position: {x:90, y: 45},
            boundingRect: {top:-13},
            zHeight:-10,
            moveEvent:{longSound: "woodSliding"},
            moveable: "down",
            parent: this.map,
            image: "/src/img/furniture/deskVerticlePlain.png"
        })

        const chair = new Sprite({
            position: {x:72, y: 45},
            event: {dialog: 9} ,
            boundingRect: {top:-13, right:-10},
            parent: this.map,
            image: "/src/img/furniture/chairLeftPlain.png"
        })        
        
        const door = new Boundry({   
            parent: this.map,
            event: {dialog: 2} ,
            color:"green",
            traversable: true,
            boundry: {
                "left": -31,
                "top": -50,
                "right": -7,
                "bottom": -9
            }
        });    
        const lightSwitch = new Boundry({
            parent: this.map,
            traversable: true,
            action:{lightToggle: 1},
            color:"blue",
            boundry: {
                "left": -2,
                "top": -50,
                "right": 24,
                "bottom": -25
            }
        });
        const painting = new Boundry({
            parent: this.map,
            traversable: true,
            action:{dialog: 6},
            color:"blue",
            boundry: {
                "left": -33,
                "top": 80,
                "right": 13,
                "bottom": 104
            }
        });
        const cabnet = new Boundry({
            parent: this.map,
            traversable: true,
            action:{dialog: 4},
            color:"yellow",
            boundry: {
                "left": 73,
                "top": -30,
                "right": 104,
                "bottom": -13
            }
        });
        const bed = new Boundry({
            parent: this.map,
            traversable: true,
            action:{dialog: 8},
            color:"blue",
            boundry: {
                "left": -104,
                "top": -12,
                "right": -62,
                "bottom": 29
            }
        });
        const dresser = new Boundry({
            parent: this.map,
            traversable: true,
            action:{dialog: 7},
            color:"blue",
            boundry: {
                "left": 22,
                "top": -30,
                "right": 68,
                "bottom": -13
            }
        });
        const desktutorial = new Boundry({
            parent: this.map,
            traversable: true,
            event:{dialog: 10},
            color:"blue",
            boundry: {
                "left": 76,
                "top": 49,
                "right": 104,
                "bottom": 57
            }
        });
        

 

        
    
        this.sceneObjects = [this.player, desk, chair, door, lightSwitch,
             painting, cabnet, bed, dresser,desktutorial];
    }
    
    constructLightObjects() {
        // Define lightobjects here
        const light1= new Light({
            parent: this.map,
            lightId: 1,
            lightingController: this.lightingController,
            position: {x: 0, y:30}
            
        })
        // Add lightobjects to list
        this.lightObjects =[light1];
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
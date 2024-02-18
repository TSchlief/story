
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
            image: "/src/img/maps/hallway.png"
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
        const ls1 = new Boundry({
            parent: this.map,
            traversable: true,
            action:{lightToggle: 2},
            color:"blue",
            boundry: {
                "left": -142,
                "top": -10,
                "right": -114,
                "bottom": 3
            }
        });
        const ls2 = new Boundry({
            parent: this.map,
            traversable: true,
            action:{lightToggle: 2},
            color:"blue",
            boundry: {
                "left": 98,
                "top": -10,
                "right": 113,
                "bottom": 3
            }
        });
        
        const thornBed = new Boundry({
            parent: this.map,
            traversable: true,
            event: {door: "chapter1/bedroom", playerLocation: {x: -16, y: -15}},
            color:"green",
            boundry: {"left": -113, "top": 65, "right": -84, "bottom": 67}
        });
        
        const kaoisBed = new Boundry({
            parent: this.map,
            traversable: true,
            event: {door: "chapter1/kaiosBedroom", playerLocation: {x: -46, y: 82}},
            color:"blue",
            boundry: {"left": -13, "top": 11, "right": 16, "bottom": 18}
        });

        const parentsBed = new Boundry({
            parent: this.map,
            traversable: true,
            event:{dialog: 3},
            color:"blue",
            boundry: {"left": -111, "top": 11, "right": -84, "bottom": 18}
        });

        const bathroom = new Boundry({
            parent: this.map,
            traversable: true,
            event:{dialog: 5},
            color:"blue",
            boundry: {
                "left": -153,
                "top": 24,
                "right": -147,
                "bottom": 53
            }
        });

        const kitchen = new Boundry({
            parent: this.map,
            traversable: true,
            event:{dialog: 11},
            color:"blue",
            boundry: {
                "left": 145,
                "top": 22,
                "right": 151,
                "bottom": 54
            }
        });

        

        
        this.sceneObjects = [this.player, ls1, ls2, thornBed, kaoisBed, parentsBed, bathroom, kitchen]
    }

    constructLightObjects() {
        // Define lightobjects here
        const light1= new Light({
            parent: this.map,
            lightId: 2,
            lightingController: this.lightingController,
            position: {x: -48, y:36}
            
        })        
        const light2= new Light({
            parent: this.map,
            lightId: 2,
            lightingController: this.lightingController,
            position: {x: 81, y:36}
            
        })      
        const light3= new Light({// thorns bedroom light
            parent: this.map,
            lightId: 1,
            radius: 70,
            lightingController: this.lightingController,
            position: {x: -98, y:95}
            
        })     
        // Add lightobjects to list
        this.lightObjects =[light1,light2,light3, ];
    }
    loadBoundryLayer() {
        this.boundryLayer = {
            "mapTop": {
                "left": -149,
                "top": 5,
                "right": 143,
                "bottom": 16
            },
            "mapBottom": {
                "left": -82,
                "top": 61,
                "right": 149,
                "bottom": 71
            },
            "mapBottomLeft": {
                "left": -142,
                "top": 61,
                "right": -113,
                "bottom": 68
            },
            "mapLeftBottom": {
                "left": -151,
                "top": 52,
                "right": -143,
                "bottom": 60
            },
            "mapLeftTop": {
                "left": -154,
                "top": -72,
                "right": -143,
                "bottom": 23
            },
            "mapRightTop": {
                "left": 142,
                "top": 15,
                "right": 147,
                "bottom": 24
            },
            "mapRightBottom": {
                "left": 142,
                "top": 53,
                "right": 151,
                "bottom": 68
            },
            "bathroomDoor": {
                "left": -162,
                "top": 22,
                "right": -148,
                "bottom": 57
            },
            "kitchenDoor": {
                "left": 149,
                "top": 21,
                "right": 159,
                "bottom": 68
            },
            
        };

    }
}
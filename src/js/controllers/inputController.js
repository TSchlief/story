import { displaySize } from "../config.js";

export default class InputController {
    constructor(config){
        this.remote = undefined;
        this.canvasCoords = {};
        this.localCoords = {};
        this.pressedKeys = {};
        this.keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'KeyW': 'up',
            'KeyS': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'KeyZ': 'mainAction',
            'KeyX': 'secondaryAction',
            '0': 'mainAction',
            '2': 'secondaryAction',
        }
        this.init(); // Initialize the event listeners
    }

    // Change remote
    changeRemote(remote) {
        this.remote = remote;
    }

    // Fires when input is detected
    input(input) {
        // Input not recongnized or no remote
        if(!input || !this.remote){ return; }
        // Fire remote callback
        this.remote(input);
    }

    // Initialize event listeners
    init() {
        document.addEventListener("keydown", e=> {
            this.pressedKeys[this.keyMap[e.code]] = true;
            let code = this.keyMap[e.code];
            if(!code){
                code = e.code;
            }
            this.input({code});
        });

        document.addEventListener("keyup", e=> {
            this.pressedKeys[this.keyMap[e.code]] = false;
        });

        document.addEventListener("mousedown", e=> {
            this.pressedKeys[this.keyMap[e.button]] = true;
            
            const rect = mainCanvas.getBoundingClientRect();
            const mouseX = e.clientX  - rect.left;
            const mouseY = e.clientY - rect.top;
        
            const x = Math.round((mouseX * displaySize.x) / rect.width);
            const y = Math.round((mouseY * displaySize.y) / rect.height);

            this.canvasCoords = {x, y};
            this.localCoords = {
                x: Math.round(x - (displaySize.x/2)),
                y: Math.round(y - (displaySize.y/2))
            }
          
            this.input({
                code: this.keyMap[e.button],
                canvasCoords: {x, y},
                localCoords: this.localCoords
            });
        });

        document.addEventListener("mouseup", e=> {
            this.pressedKeys[this.keyMap[e.button]] = false;
        });

        document.addEventListener("contextmenu", function(event) {
        // Prevent the default right-click menu
        event.preventDefault();
    });
    }
}

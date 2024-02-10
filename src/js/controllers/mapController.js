
import { displayOffset, displaySize } from '../config.js';

export default class MapController{
    constructor(config){
        this.map = config.map;
        this.inputController = config.inputController;
        this.speed = 64;
    }

    

    // Moves charcter
    moveMap(input){
        console.log(input.code)
        
        let x = 0;
        let y = 0;
        if(input.code==='up') { y += 1; }
        if(input.code==='down') { y -= 1; }
        if(input.code==='left') { x += 1; }
        if(input.code==='right') { x -= 1; }

        const magnitude = Math.sqrt(x**2 + y**2);

        console.log(magnitude)
        // If input is detectedd
        if(magnitude > 0){
            x = x/magnitude;
            y = y/magnitude;
            x *= this.speed;
            y *= this.speed;
            
            // Move map
            this.map.position = {
                x: this.map.localPosition.x + x,
                y: this.map.localPosition.y + y
            }   
        }
        
    }
}

import { displayOffset, displaySize } from '../config.js';

export default class CharacterController{
    constructor(config){
        this.scene = config.scene;
        this.isEnabled = true;

    }

    update(dt){
        
        // Check if controller is enabled
        if(!this.isEnabled) return;

        this.playerMovement(dt);
    }

    detectCollision(objectGroup){
        const obj1 = this.scene.player.boundingRect;
        let faces= {};
        for (let key in objectGroup){
            if (objectGroup.hasOwnProperty(key)) {
                const obj2 = objectGroup[key].boundingRect;
                // Check if obj1 is to the left of obj2
                if (obj1.right < obj2.left) { continue; }
                // Check if obj1 is to the right of obj2
                if (obj1.left > obj2.right) { continue; }
                // Check if obj1 is above obj2
                if (obj1.bottom < obj2.top) { continue; }
                // Check if obj1 is below obj2wd
                if (obj1.top > obj2.bottom) { continue; }

                // If none of the above conditions are met, the objects are colliding
                
                // Check if its an event collider
                if(objectGroup[key].event){
                    this.scene.eventController.triggerEvent(objectGroup[key].event);
              
                    if(objectGroup[key].traversable){
                        continue;
                    }
                }

                 // Determine the face of collision
                const overlapLeft = Math.ceil(obj2.right - obj1.left);
                const overlapRight = Math.ceil(obj1.right - obj2.left);
                const overlapTop = Math.ceil(obj2.bottom - obj1.top);
                const overlapBottom = Math.ceil(obj1.bottom - obj2.top);

                // Find the smallest overlap to determine the face of collision
                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapLeft) {
                    faces["left"] = true;
                }
                if (minOverlap === overlapRight) {
                    faces["right"] = true;
                }
                if (minOverlap === overlapTop) {
                    faces["top"] = true;
                }
                if (minOverlap === overlapBottom) {
                    faces["bottom"] = true;
                }
            }
        }
        return faces;
    }

    // Moves charcter
    playerMovement(dt){
        // Get current pressed keys
        const input = this.scene.inputController.pressedKeys;
        let x = 0;
        let y = 0;
        if(input['up']) { y -= 1; }
        if(input['down']) { y += 1; }
        if(input['left']) { x -= 1; }
        if(input['right']) { x += 1; }

        const magnitude = Math.sqrt(x**2 + y**2);

        // If input is detected
        if(magnitude > 0){
            x = x/magnitude;
            y = y/magnitude;
            x *= this.scene.playerSpeed * dt;
            y *= this.scene.playerSpeed * dt;
            
            // Move player
            this.scene.player.position = {
                x: this.scene.player.localPosition.x + x,
                y: this.scene.player.localPosition.y + y
            }

            // Move map
            let mapX = x;
            let mapY = y;
            if(input['up']) { 
                if(this.scene.map.boundingRect.top > -1 || this.scene.player.position.y > displayOffset.y){
                    mapY = 0;
                }
            }
            if(input['down']) {
                if(this.scene.map.boundingRect.bottom < displaySize.y+1 || this.scene.player.position.y < displayOffset.y){
                    mapY = 0;
                }
                
            }
            if(input['left']) {
                if(this.scene.map.boundingRect.left > -1 || this.scene.player.position.x > displayOffset.x){
                    mapX = 0;
                }
                
            }
            if(input['right']) {
                if(this.scene.map.boundingRect.right < displaySize.x+1 || this.scene.player.position.x < displayOffset.x){
                    mapX = 0;
                }
            }
            
            this.scene.map.position = {
                x: this.scene.map.localPosition.x - mapX,
                y: this.scene.map.localPosition.y - mapY
            }
            
            const result1 = this.detectCollision(this.scene.staticBoundries);
            const result2 = this.detectCollision(this.scene.sceneObjects);
            // Combine collision results
            const collision = Object.assign({}, result1, result2);

            if(collision){
                // Move player back because of collision
                let positionX = 0;
                let postitionY = 0;
                let mapPositionX = 0;
                let mapPositionY = 0;
                if(collision["right"] && input["right"]){
                    positionX = x;
                    mapPositionX = mapX;
                }
                if(collision["left"] && input["left"]){
                    positionX = x;
                    mapPositionX = mapX;
                }

                if(collision["top"] && input["up"]){ 
                    postitionY = y;
                    mapPositionY = mapY;
                }
                if(collision["bottom"] && input["down"]){ 
                    postitionY = y;
                    mapPositionY = mapY;
                }
                // Reset player position
                this.scene.player.position = {
                    x: this.scene.player.localPosition.x - positionX,
                    y: this.scene.player.localPosition.y - postitionY
                }    
                // Reset map position
                this.scene.map.position = {
                    x: this.scene.map.localPosition.x + mapPositionX,
                    y: this.scene.map.localPosition.y + mapPositionY
                }
                
                
            }
        }
    }
}
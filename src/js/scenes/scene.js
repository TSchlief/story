

import CharacterController from '../controllers/characterController.js';
import { displayOffset, displaySize } from '../config.js';
import Boundry from '../objects/boundry.js';

export default class Scene{

    constructor(config) {
        this.mainCanvas = document.getElementById('mainCanvas');
        this.lightingCanvas = document.getElementById('lightingCanvas');
        this.ctx = mainCanvas.getContext('2d');
        this.ctxL = lightingCanvas.getContext('2d');
        this.inputController = config.inputController;
        this.eventController = config.eventController;
        this.lightingController = config.lightingController;
        this.inputController.changeRemote(this.input.bind(this));
        this.characterController = new CharacterController({scene: this});
        this.boundryLayer = {};
        this.staticBoundries = {};
        this.sceneObjects = [];
        this.lightObjects = [];
        this.boundries = false;
        this.timeStamp = Date.now();
        this.playerSpeed = 0.07;
        this.centerMap = false;
        this.playerStartingLocation = config.playerStartingLocation || {x:0, y:0};
        this.darkness = 0;
        
        this.init();
        
    }



    sceneAction(input){
        if(this.characterController.isEnabled){

            const result = this.rayCast(10, this.player, this.inputController.currentDirection, [this.sceneObjects]);
        
            if(result?.action){
                setTimeout(() => {
                    this.eventController.triggerEvent(result.action);
                    
                }, 50);
            }
            
            
        }
    }

    // Methods to be overriden
    constructSceneObjects() {throw new Error("You must override this method! Method: constructSceneObjects");}
    constructLightObjects() {throw new Error("You must override this method! Method: contructLightObjects");}
    loadBoundryLayer() {throw new Error("You must override this method! Method: loadBoundryLayer");}
    start() {}

    // Run anthing that requires updating
    update(dt){
        this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.ctxL.clearRect(0, 0, this.lightingCanvas.width, this.lightingCanvas.height);
        this.characterController.update(dt);
        
        this.map.draw();
        this.drawSceneObjects();

        this.ctxL.fillStyle = `rgba(0,0,0,${this.darkness})`; 
        this.ctxL.fillRect(0, 0, this.lightingCanvas.width, this.lightingCanvas.height); 

        this.ctx.globalCompositeOperation = "source-atop";
        this.ctxL.globalCompositeOperation = "destination-out";
        this.drawLightObjects();
        
        this.ctx.globalCompositeOperation = "source-over";
        this.ctxL.globalCompositeOperation = "source-over";
        if(this.boundries){
            this.drawBoundries(this.sceneObjects);
            this.drawBoundries(this.staticBoundries);
        }
    }

    // Fires when any input is detected
    input(input){
        
        if(input.code === "KeyB"){
            if(this.boundries){
                this.boundries = false;
            }
            else{
                this.boundries = true;
            }
        }
                 
        
        if(input.code === "mainAction"){
            if(input.localCoords){
                const localClick = {
                    x: Math.round(input.localCoords.x- this.map.localPosition.x),
                    y: Math.round(input.localCoords.y- this.map.localPosition.y)
                };
                console.log(localClick)
            }
            this.sceneAction({code:input.code})
        }
        if(input.code === "secondaryAction"){
            if(input.localCoords){

                const localClick = {
                    x: Math.round(input.localCoords.x- this.map.localPosition.x),
                    y: Math.round(input.localCoords.y- this.map.localPosition.y)
                };
                
                console.log(input.previousLocalCoords, "local coorsds")
                const prevLocalClick = {
                    x: Math.round(input.previousLocalCoords.x - this.map.localPosition.x),
                    y: Math.round(input.previousLocalCoords.y - this.map.localPosition.y)
                };
                // Click top left then bottom right to
                // log a boundry object for development
                console.log({"left": prevLocalClick.x,"top": prevLocalClick.y,"right": localClick.x,"bottom": localClick.y});
                
            }
            this.sceneAction({code:input.code})
        }
    }

    drawObjects(objList){
        for (let obj in objList){
            const currentObj = objList[obj];
            currentObj.draw();
        }
    }

    drawLightObjects(){
        this.drawObjects(this.lightObjects);
    }

    drawSceneObjects(){
        this.sceneObjects.sort((obj1, obj2) => obj1.zHeight - obj2.zHeight);
        this.drawObjects(this.sceneObjects);
    }

    drawBoundries(objGroup){
        this.ctx.globalAlpha =0.3;
        for (let key in objGroup){
            if (objGroup.hasOwnProperty(key)) {
                const obj = objGroup[key];
                if(obj.hasBoundingRect){
                    const x = Math.round(obj.boundingRect.left);
                    const y = Math.round(obj.boundingRect.top);
                    const width = Math.round(obj.boundingRect.right - obj.boundingRect.left);
                    const height = Math.round(obj.boundingRect.bottom - obj.boundingRect.top);

                    this.ctx.fillStyle = obj.color; 
                    this.ctx.fillRect(x , y , width, height);
                }
            }
        }
        
        this.ctx.globalAlpha =1;
    }



    // Try to center map on player location
    centeringMap() {
        // Check if we should center map
        if(!this.centerMap) {
            this.animationLoop();
            return;
        }

        // Check if map is loaded if not try again
        if(!this.map.imageLoaded){
            setTimeout(()=>this.centeringMap(), 10)
            return;
        }
        

        let mapX = -this.player.localPosition.x;
        let mapY = -this.player.localPosition.y;
        let overFlowX = 0;
        let overFlowY = 0;
        
        this.map.position = { x: mapX, y: mapY }
        // If both conditions are true then map is smaller than display size dont worry about showing map edges
        if(this.map.boundingRect.top > -1 && this.map.boundingRect.bottom < displaySize.y+1){

        }
        else{
            if(this.map.boundingRect.top > -1){
                overFlowY -= this.map.boundingRect.top;
            }
            
            if(this.map.boundingRect.bottom < displaySize.y+1){
                overFlowY += displaySize.y-this.map.boundingRect.bottom;
            }

        }
        // If both conditions are true then map is smaller than display size dont worry about showing map edges
        if(this.map.boundingRect.left > -1 && this.map.boundingRect.right < displaySize.x+1){

        }
        else{

            if(this.map.boundingRect.left > -1){
                overFlowX -= this.map.boundingRect.left;
            }
            
            if(this.map.boundingRect.right < displaySize.x+1){
                overFlowX += displaySize.x-this.map.boundingRect.right;
            }
        }
    
        this.map.position = {
            x: this.map.localPosition.x + overFlowX,
            y: this.map.localPosition.y + overFlowY
        }
        this.animationLoop();
      
    }

    // Initialization 
    init(){
        this.constructSceneObjects();
        this.constructLightObjects();
        this.loadBoundryLayer();
        this.createStaticBoundries();
        this.centeringMap();
    }

    // Runs the update loop
    animationLoop = () => {
        try{
            const now = Date.now();
            this.update(now-this.timeStamp);
            this.timeStamp = now;
            requestAnimationFrame(this.animationLoop);
        }
        catch(error){
            
        }
    }

    cleanUp() {        
        this.inputController = undefined;
        this.eventController = undefined;
        this.characterController = undefined;
    }

    directionToVector(direction){
        if(direction === "up") {
            return {x: 0, y:-1};
        }
        else if(direction === "down") {
            return {x: 0, y:1};
        }
        else if(direction === "left") {
            return {x: -1, y:0};
        }
        else if(direction === "right") {
            return {x: 1, y:0};
        }
        else if(direction === "upLeft") {
            return {x: -1, y:-1};
        }
        else if(direction === "upRight") {
            return {x: 1, y:-1};
        }
        else if(direction === "downLeft") {
            return {x: -1, y:1};
        }
        else{
            return {x: 1, y:1};
        }
    }

    // Cast a ray and return fist obj hit
    rayCast(distance, origin, direction, objGroups){

        // Init ray origin
        // We should set the origin to the center of the bounding rect instead ********************
        let ray = {x:origin.position.x, y:origin.position.y};
        // Get ray vector
        const rayDirection = this.directionToVector(direction);
        // Cycle through each ray location
        for(let i = 0; i<distance; i++) {
            // Cycle through different object collections
            for(let key in objGroups){
                const objGroup = objGroups[key]
                // Cycle through object collection
                for (let key in objGroup){
                    if (objGroup.hasOwnProperty(key)) {
                        // Object to test
                        const obj = objGroup[key];
                        // If obj is ray origin object then we are not colliding
                        if(obj === origin) { continue; }
                        // Check if obj1 is to the left of obj2
                        if (ray.x < obj.boundingRect.left) { continue; }
                        // Check if obj1 is to the right of obj2
                        if (ray.x > obj.boundingRect.right) { continue; }
                        // Check if obj1 is above obj2
                        if (ray.y < obj.boundingRect.top) { continue; }
                        // Check if obj1 is below obj2wd
                        if (ray.y > obj.boundingRect.bottom) { continue; }
                        // If none of the above conditions are met, the objects are colliding
                        
                        return obj;
                    }
                }
            }
            // Move ray along its vector
            ray.x += rayDirection.x;
            ray.y += rayDirection.y;
        }
    }

    // Takes a an object group and another objs boundingRect and checks for collisions
    detectCollision(objectGroup, obj1){
        let faces= {};
        let collidingObjects = [];
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
                if(obj1 === obj2) { continue; }
                // If none of the above conditions are met, the objects are colliding

                collidingObjects.push(objectGroup[key])
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
        return {faces, collidingObjects};
    }

    // Turn boundry layer data into game objects
    createStaticBoundries(){
        for (let key in this.boundryLayer){
            if (this.boundryLayer.hasOwnProperty(key)) {
                const obj = this.boundryLayer[key];
                this.staticBoundries[key] = new Boundry({
                    parent: this.map,
                    boundry: obj
                });
            }
        }
    // Set maps position to its own position to propagate child positions
    this.map.position = this.map.localPosition
}
    
}







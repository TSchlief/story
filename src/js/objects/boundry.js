import GameObject from "./gameObject.js";

export default class Boundry extends GameObject{
    constructor(config){
        super(config)
        this.origin = this.parent.origin;
        const width = config.boundry.right - config.boundry.left;
        const height = config.boundry.bottom - config.boundry.top;
        const globalX = config.boundry.left + (width/2);
        const globalY = config.boundry.top + (height/2);
        const x = globalX - this.origin.x;
        const y = globalY - this.origin.y;
        
        this.size = {width, height};
        this.position = {x, y};
        this.traversable = config.traversable;

        this.event = config.event || undefined; // Used for calling events
        
    }


}
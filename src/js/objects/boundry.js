import GameObject from "./gameObject.js";

export default class Boundry extends GameObject{
    constructor(config){
        super(config)
        this.origin = this.parent.origin;
        const width = config.boundry.right - config.boundry.left;
        const height = config.boundry.bottom - config.boundry.top;
        const x = config.boundry.left + (width/2);
        const y = config.boundry.top + (height/2);
        
        this.size = {width, height};
        this.position = {x, y};
        
    }


}
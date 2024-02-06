import { displayOffset } from "../config.js";

export default class GameObject {
    constructor(config) {
        this.parent = config.parent;
        this.origin = config.origin || config.parent?.position || {x: displayOffset.x, y: displayOffset.y}
 
        this._localPosition = config.position || {x:0, y:0};
        this._position = {
            x: this.origin.x + (config.position?.x || 0) ,
            y: this.origin.y + (config.position?.y || 0) 
        };
        this.boundingRect = config.boundingRect || {}

        this.size = config.size || 0;
        this.children = [];
        this.parent?.addChild(this);

    }

    
    
    // Sets the objects position relative to its origin
    set position(position){
        this._localPosition = position;
        this._position = {
            x: this.origin.x + position.x,
            y: this.origin.y + position.y
        };

        // Re-caclulate the bounding rect
        calculateBoundingRect();

        // Update the childrens origins and positions
        for(let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.origin = this._position;
            child.position = child._localPosition;
        }
    }
    
    // Returns position relative to center of the canvas
    get position(){
        return this._position;
    }

        // Sets the objects position relative to its origin
    set position(position){
        this._localPosition = position;
        
        this._position = {
            x: this.origin.x + this._localPosition.x,
            y: this.origin.y + this._localPosition.y
        };
        
        this.boundingRect = {     
            top: this._position.y - (this.size.height/2),
            left: this._position.x - (this.size.width/2),
            bottom: this._position.y + (this.size.height/2),
            right: this._position.x + (this.size.width/2)
        };
        // Update the childrens origins and positions
        for(let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.origin = this._position;
            child.position = child._localPosition;
        }
    }

    // Returns position relative to its origin
    get localPosition(){
        return this._localPosition;
    }

    //Recalulates objects top, left, right, bottom
    calculateBoundingRect(){

        this.boundingRect = {     
            top: this._position.y - (this.size.height/2),
            left: this._position.x - (this.size.width/2),
            bottom: this._position.y + (this.size.height/2),
            right: this._position.x + (this.size.width/2)
        };
    }

    // Adds child object
    addChild(child){
        this.children.push(child);
    }

    //Adds parent object
    addParent(parent){
        this.parent = parent;
        parent.addChild(this);
        parent.position = parent.localPosition;
    }

    removeChild(child){
        for(let i = 0; i < this.children.length; i++) {
            if(this.children[i] === child){
                this.children.splice(i,1);
            }
        }
    }

    
}
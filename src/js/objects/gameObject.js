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
        this.boundingRect = {}

        this.boundingRectOffset = (()=>{
            const offset = {top:0, bottom: 0, left:0, right:0}
            
            offset.top = config.boundingRect?.top || 0;
            offset.bottom = config.boundingRect?.bottom || 0;
            offset.left = config.boundingRect?.left || 0;
            offset.right = config.boundingRect?.right || 0;
            return offset
            
        })();
        
        this._zHeight = config.zHeight || 0; // Sets the offset fow screen height to render objects
        this.size = config.size || 0;
        this.children = [];
        this.hasBoundingRect = config.hasBoundingRect === undefined? true : config.hasBoundingRect;
        this.parent?.addChild(this);
        
        this.color = config.color || "red";// Used to draw boundries and squashing bugs
        this.traversable = config.traversable || false;
        this.moveable = config.moveable || false;
        this.action = config.action || undefined;
        this.event = config.event || undefined; // Used for calling events

        this.calculateBoundingRect();
    }

    // Gets the rendering priority based on vertical screen position
    get zHeight(){
        return this._position.y - this._zHeight;
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
        
        this.calculateBoundingRect();
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
            top: this._position.y - (this.size.height/2)- this.boundingRectOffset.top,
            left: this._position.x - (this.size.width/2) - this.boundingRectOffset.left,
            bottom: this._position.y + (this.size.height/2) + this.boundingRectOffset.bottom,
            right: this._position.x + (this.size.width/2 + this.boundingRectOffset.right)
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

    draw(){
        if(!this.image){
            return;
        }
    }

    
}
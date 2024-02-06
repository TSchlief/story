import GameObject from "./gameObject.js";

export default class Sprite extends GameObject {
    constructor(config) {
        super(config);
    
        // Initialize canvas context
        this.ctx = null;
        // If not null set context
        if(config.ctx !== null){
            this.ctx = config.ctx || (() => {
                const mainCanvas = document.getElementById('mainCanvas');
                const ctx = mainCanvas.getContext('2d');
                return ctx;
                
            })();
        }
        
        this.image = new Image();
        this.image.src = config.image;
        this.size = config.size;
        this.image.onload = (()=>{
            if(!this.size){ 
                this.size = {width: this.image.width, height: this.image.height}; 
            
                this.boundingRect.top = this._position.y - (this.size.height/2),
                this.boundingRect.left = this._position.x - (this.size.width/2),
                this.boundingRect.bottom = this._position.y + (this.size.height/2),
                this.boundingRect.right = this._position.x + (this.size.width/2)
            }
        })()
        
    }


    draw(ctx = this.ctx) {

        const width = this.size.width;
        const height = this.size.height;
        

        if(ctx){
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
                this.image,
                0,
                0,
                width,
                height,
                Math.round(this._position.x) - (width/2),
                Math.round(this._position.y) - (height/2),
                width,
                height
            );
            
            ctx.globalAlpha = 1;
        }
    }
}
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
        this.imageLoaded = false;
        this.image = new Image();
        this.image.src = config.image;
        this.size = config.size || {width: 0, height: 0};
        this.image.onload = ()=>{
            console.log('imageLoaded')
            this.size.width = this.image.width;
            this.size.height = this.image.height;
        
            
            this.calculateBoundingRect();
            this.imageLoaded = true;
        }
    }


    draw(ctx = this.ctx) {
        
        const width = this.size.width;
        const height = this.size.height;
        

        if(ctx){
            ctx.globalAlpha = 1;
            ctx.drawImage(
                this.image,
                0,
                0,
                width,
                height,
                Math.round((this._position.x) - (width/2)),
                Math.round((this._position.y) - (height/2)),
                width,
                height
            );
            
            ctx.globalAlpha = 1;
        }
        
    }
}
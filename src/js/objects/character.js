import GameObject from "./gameObject.js";

export default class Character extends GameObject {
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
            this.size.width = this.size.width > 0? this.size.width : this.image.width;
            this.size.height = this.size.height > 0? this.size.height : this.image.height;
        
            
            this.calculateBoundingRect();
            this.imageLoaded = true;
        }
        this.inputController = config.inputController;
        this.characterController = config.characterController;
        this.horizontalCut = config.characterDirection || 0;

        
    }


    draw(ctx = this.ctx) {
        
        const width = this.size.width;
        const height = this.size.height;
        

        //if(this.characterController?.isEnabled){
            const currentDirection = this.inputController.currentDirection;
            if(currentDirection === "up") {
                this.horizontalCut = width*3;
            }
            else if(currentDirection === "right") {
                this.horizontalCut = width*2;
            }
            else if(currentDirection === "left") {
                this.horizontalCut = width*1;
            }
            else{
                this.horizontalCut = 0;
            }
        //}


        if(ctx){
            ctx.drawImage(
                this.image,
                this.horizontalCut,
                0,
                width,
                height,
                Math.round((this._position.x) - (width/2)),
                Math.round((this._position.y) - (height/2)),
                width,
                height
            );
            
        }
        
    }
}
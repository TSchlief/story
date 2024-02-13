import GameObject from "./gameObject.js";


export default class Light extends GameObject{
    constructor(config) {
        super(config);
        this.lightingController = config.lightingController || undefined;
        this.lightId = config.lightId || 1;

        this.mainCanvas = document.getElementById('mainCanvas');
        this.ctx = mainCanvas.getContext('2d');
    }

    draw(ctx = this.ctx) {
        if(ctx && this.lightingController){
            const light = this.lightingController.getLight(this.lightId);

            // Define lighting bounds
            const bounds = this.parent.boundingRect;
            var gradient = ctx.createRadialGradient(this.position.x, this.position.y, light.initialRadius, this.position.x, this.position.y, light.endRadius);
            // Parameters are (x0, y0, r0, x1, y1, r1), where (x0, y0) is the start circle's center,
            // r0 is the start circle's radius, (x1, y1) is the end circle's center, and r1 is the end circle's radius.

            // Check if we need to render light
            if(light.on){
                
                gradient.addColorStop(0, light.initialColor);   // Start color (inner circle)
                if(light.secondColor){
                    gradient.addColorStop(light.secondColorPosition, light.secondColor);   // Start color (inner circle)
                }
                gradient.addColorStop(1, light.endColor);  // End color (outer circle)
                
                ctx.fillStyle = gradient;
                ctx.fillRect(bounds.left+1, bounds.top+1, bounds.right - bounds.left-1, bounds.bottom-bounds.top-1);
            }
            else if(light.darkness){
          
                gradient.addColorStop(0, "rgba(0,0,0,0.4)");   // Start color (inner circle)
                gradient.addColorStop(1, "rgba(0,0,0,0.7)");  // End color (outer circle)
                
                ctx.fillStyle = gradient;
                ctx.fillRect(bounds.left+1, bounds.top+1, bounds.right - bounds.left-1, bounds.bottom-bounds.top-1);
            }
        }
    }
}
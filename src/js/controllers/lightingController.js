import Lights from "../lights/lights.js";

export default class LightingController{
    constructor(config){
            this.lights = new Lights();
            this.curtain = document.getElementById("curtain");
            this.lightingCanvas = document.getElementById('lightingCanvas');
            this.ctx = lightingCanvas.getContext('2d');
            this.curtainClosed = true;
            this.currentScene = undefined;
            this.maskWidth = undefined;
            this.maskHeight = undefined;

            
    }
    

    onLight(lightId){
        this.lights.onLight(lightId)
    }

    offLight(lightId){
        this.lights.offLight(lightId)
    }

    toggleLight(lightId){
        this.lights.toggleLight(lightId)
    }

    getLight(lightId){
        return this.lights.getLight(lightId);
    }


    drawLight(){
        // Draw a rectangle
        this.ctx.fillStyle = 'rgba(200,200,200,0.1)'; // Fill color
        this.ctx.fillRect(0, 0, this.lightingCanvas.width, this.lightingCanvas.height); 
        this.drawMask();
    }

 

    // Not sure if this is needed. maybe if it is look into fillrect masking?
    drawMask(){ 
        // Get Map Dimensions
        const boundingRect = this.currentScene.map.boundingRect;
        // Draw mask
        this.ctx.fillStyle = 'black';
        // Top rectangle
        this.ctx.fillRect(0, 0, this.lightingCanvas.width, boundingRect.top);
        // Left rectangle
        this.ctx.fillRect(0, boundingRect.top-2, boundingRect.left, boundingRect.bottom - boundingRect.top+4);
        // Right rectangle
        this.ctx.fillRect(boundingRect.right+1, boundingRect.top-2, this.lightingCanvas.width - boundingRect.right, boundingRect.bottom - boundingRect.top+4);
        // Bottom rectangle
        this.ctx.fillRect(0, boundingRect.bottom+1, this.lightingCanvas.width, this.lightingCanvas.height - boundingRect.bottom);
    }

    async fadeIn(speed=20) {
        const curtain = this.curtain;
        const controller = this;
        function lowerOpacity(){
            // Convert opacity to a number
            const opacity = parseFloat(curtain.style.opacity);
            // Check if opacity is greater than 0
            if (opacity > 0) {
                // Decrease opacity
                if(opacity<0.20){
                    curtain.style.opacity = opacity - 0.05;

                }
                else{
                    curtain.style.opacity = opacity - 0.03;

                }
                // Call fadeIn again after delay
                setTimeout(() => lowerOpacity(), speed);
            }
            else{
                controller.curtainClosed = false;
            }
        }
        lowerOpacity();
        return new Promise(resolve => {
            const checkFlag = () => {
                if (!this.curtainClosed) {
                    resolve();
                } else {
                    setTimeout(checkFlag, 100);
                }
            };
            checkFlag();
        });
    }

      

    async fadeOut(speed=15){
        const curtain = this.curtain;
        const controller = this;
        function increaseOpacity(){
            // Convert opacity to a number
            const opacity = parseFloat(curtain.style.opacity);
            // Check if opacity is greater than 0
            if (opacity < 1) {
                // Decrease opacity
                curtain.style.opacity = opacity + 0.04;
                // Call fadeIn again after delay
                setTimeout(() => increaseOpacity(), speed);
            }
            else{
                controller.curtainClosed = true;
            }
        }
        increaseOpacity();
        return new Promise(resolve => {
            const checkFlag = () => {
                if (this.curtainClosed) {
                    resolve();
                } else {
                    setTimeout(checkFlag, 100);
                }
            };
            checkFlag();
        });
    }
    async fadeOutCreepy(speed=20){
        const curtain = this.curtain;
        const controller = this;
        let amt = 0.001;
        function increaseOpacity(){
            // Convert opacity to a number
            const opacity = parseFloat(curtain.style.opacity);
            // Check if opacity is greater than 0
            if (opacity < 1) {
                // Decrease opacity
                curtain.style.opacity = opacity + amt;
                amt+=amt/10;
                // Call fadeIn again after delay
                setTimeout(() => increaseOpacity(), speed);
            }
            else{
                controller.curtainClosed = true;
            }
        }
        increaseOpacity();
        return new Promise(resolve => {
            const checkFlag = () => {
                if (this.curtainClosed) {
                    console.log("done fadeOut")
                    resolve();
                } else {
                    setTimeout(checkFlag, 100);
                }
            };
            checkFlag();
        });
    }
}
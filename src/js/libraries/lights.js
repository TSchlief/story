/* Example
    on: false,
    initialRadius: 15,
    endRadius: 100,
    initialColor:"rgba(255, 147, 41, 0.1)",
    secondColor: undefined,
    secondColorPosition: undefined,
    endColor: 'rgba(0,0,0,0.1)',
    darkness: true,
    clone: 1, /// used to copy the properties of a light except for its state
*/


export default class Lights {
    constructor(config) {
        this.lights = {
            1: {//bedroom
                on: false,
                initialRadius: 20,
                endRadius: 170,
                initialColor:"rgba(255, 147, 41, 0.1)",
                secondColor: undefined,
                secondColorPosition: undefined,
                endColor: 'rgba(255, 147, 41,0)',
             
            },

            2: { //hallway
                clone: 1,
                on: false,
            },
            

            3: { //kaoisRoom
                clone: 1,
                on: true,
            },




            
        };
       
    }

    getLight(lightId) {
        const light = this.lights[lightId];
        if(light.clone){
            const clone = this.lights[light.clone];
            const clonedLight = {};
            clonedLight.on = light.on;                
            clonedLight.initialRadius = light.initialRadius || clone.initialRadius;
            clonedLight.endRadius = light.endRadius || clone.endRadius;
            clonedLight.initialColor = light.initialColor || clone.initialColor;
            clonedLight.secondColor = light.secondColor || clone.secondColor;
            clonedLight.secondColorPosition = light.secondColorPosition || clone.secondColorPosition;
            clonedLight.endColor = light.endColor || clone.endColor;
            clonedLight.darkness = light.darkness || clone.darkness;
            return clonedLight;
        }
        return this.lights[lightId];
    }    
    
    onLight(lightId){
        this.lights[lightId].on = true;
    }

    offLight(lightId){
        this.lights[lightId].on = false;
    }

    toggleLight(lightId){
        const light = this.lights[lightId];
        if(light.on){
            light.on = false;
            return false;
        }
        light.on = true;
        return true;
    }
}

export default class Lights {
    constructor(config) {
        this.lights = {
            1: {
                on: false,
                initialRadius: 15,
                endRadius: 100,
                initialColor:"rgba(255, 147, 41, 0.1)",
                secondColor: undefined,
                secondColorPosition: undefined,
                endColor: 'rgba(0,0,0,0.1)',
                darkness: true
            },




            
        };
       
    }

    getLight(lightId) {
        return this.lights[lightId];
    }    
    
    onLight(lightId){
        console.log(this.lights[lightId],lightId)
        this.lights[lightId].on = true;
    }

    offLight(lightId){
        this.lights[lightId].on = false;
    }

    toggleLight(lightId){
        const light = this.lights[lightId];
        if(light.on){
            light.on = false;
        }
        else{
            light.on = true;
        }
    }
}
export default class Sounds{
    constructor(config){
        this.soundEffects = {
            lightOn:{
                fileName: "lightSwitch.wav",
            },

            lightOff:{
                fileName: "lightSwitch.wav",
            },

            typeWriter:{
                fileName: "footstepCarpetRight3.mp3",
                end: 0.04,
            },
            
            woodDrawer:{
                fileName: "chestDrawerOpen.mp3",
            },
            
            woodSliding:{
                fileName: "chestDrawerOpen.mp3",
                end:0.4
            },
        }

        this.music = {

            splash:{
                fileName: "surrealGameMenuLooping.mp3",
            },

            startSceneBedroom:{
                fileName: "melt.mp3",
                next: "hallway",
                start:70
            },

            hallway:{
                fileName: "peacefulMind.mp3",
                looping: true,
            },

            acreageScene:{
                fileName: "peacefulMind.mp3",
                looping: true,
            },

        }
    }




    

}
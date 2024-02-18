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

            "chapter1/bedroom":{
                fileName: "melt.mp3",
                next: "chapter1/bedroom",
            },

            "chapter1/hallway":{
                fileName: "melt.mp3",
                next: "chapter1/hallway",
            },

            "chapter1/kaiosBedroom":{
                fileName: "darkQuest.mp3",
                next: "chapter1/kaiosBedroom",
            },

            acreageScene:{
                fileName: "peacefulMind.mp3",
            },

        }
    }




    

}
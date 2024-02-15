import Sounds from "../libraries/sounds.js";
import CoolDown from "../helpers/cooldown.js";

export default class AudioController{
    constructor(config){
        this.sounds = new Sounds();
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = undefined;
        this.baseUrl = "../../src/sound/";
        this.buffers = {};
        this.longSoundCoolDown = new CoolDown(1000);
        this.currentSong = undefined;
        this.currentSongObj = undefined;

        this.globalVolume = 50;
        this.musicGainNode = undefined;
        this.effectsGainNode = undefined;
    }

    init() {
        // Create new audio context
        this.audioCtx = new this.AudioContext();
        // Create gain nodes for volume control
        this.musicGainNode = this.audioCtx.createGain();
        this.effectsGainNode = this.audioCtx.createGain();
        // Load all soundEffects to buffer
        this.loadSoundEffects();
    }

    clearMusicBuffers() {
        for (let key in this.sounds.music){
            if (this.sounds.music.hasOwnProperty(key)) {
                const soundObj = this.sounds.music[key];
                    delete this.buffers[this.getKey(soundObj.fileName)];
            }
        }
    }

    cleanUp(nextSceneName){
        const nextSoundobj = this.sounds.music[nextSceneName];
        // Remove next song
        this.currentSong.onended = null
        // Check if the next scene plays the current song
        if(this.currentSongObj.fileName === nextSoundobj.fileName){
            // If current songs next song matches upcoming scenes next song set call back
            if(nextSoundobj.next) {
                this.currentSong.onended = ()=> {
                    this.playMusic(nextSoundobj.next)
                }
            }
            
        }
        else{
            this.currentSong.stop()
            this.clearMusicBuffers();
            this.playMusic(nextSceneName)
        }
    }

    sceneStart(sceneName){
        if(this.sounds.music[sceneName]){
            this.playMusic(sceneName);
        }
    }

    loadSoundEffects(){
        for (let key in this.sounds.soundEffects){
            if (this.sounds.soundEffects.hasOwnProperty(key)) {
                const soundEffect = this.sounds.soundEffects[key];
                // Check if sound is not in buffer
                if(!this.buffers[soundEffect.fileName]){
                   this.loadAudio(soundEffect)
                }
            }
        }
    }

    async loadAudio(audioObj){
        if(!this.buffers[audioObj.fileName]){
            return  fetch(this.baseUrl+audioObj.fileName)
            .then(response => response.arrayBuffer())
            .then(data => this.audioCtx.decodeAudioData(data))
            .then(buffer => {
                this.buffers[this.getKey(audioObj.fileName)] = buffer;
            })
            .catch(error => {
                console.error('Error loading audio file', error);
            });

        }
    }
    
    async playMusic(song){
        // Get soundObject from library
        const soundObject = this.sounds.music[song];
        // Keep a reference of the sound obj
        this.currentSongObj = soundObject;
        // Create audio source
        this.currentSong = this.audioCtx.createBufferSource();
        // Define buffer
        const buffer = this.getBuffer(soundObject.fileName);
        // If song is not in buffer then add it
        if(!buffer){
            await this.loadAudio(soundObject);
        }
        this.currentSong.buffer = this.getBuffer(soundObject.fileName);

        //Initialize options
        const start = soundObject.start || 0;
        const end = soundObject.end || this.currentSong.buffer.duration;
        if(soundObject.detune){
            this.currentSong.detune.setValueAtTime(soundObject.detune,this.audioCtx.currentTime)
        }
        this.currentSong.loop = soundObject.looping;
        if(soundObject.next){
            this.currentSong.onended = ()=> {
                this.playMusic(soundObject.next)
            }
        }
     
        // Connect the source to the gain node
        this.currentSong.connect(this.musicGainNode);
        // Connect the gain node to the speakers
        this.musicGainNode.connect(this.audioCtx.destination);
        // Set gain node volume
        this.musicGainNode.gain.value = this.globalVolume/100;
        this.currentSong.start(0, start, end);
        console.log("playing music", song)
    }    

    playSoundEffect(soundEffect){
        // Get soundObject from library
        const soundObject = this.sounds.soundEffects[soundEffect];
        // Create audio source
        var source = this.audioCtx.createBufferSource();
        // Define buffer
        source.buffer = this.getBuffer(soundObject.fileName);

        //Initialize options
        const start = soundObject.start || 0;
        const end = soundObject.end || source.buffer.duration;

        if(soundObject.detune){
            source.detune.setValueAtTime(soundObject.detune,this.audioCtx.currentTime)
        }

        source.connect(this.audioCtx.destination);
        source.start(0, start, end);
        this.longSoundCoolDown.setDelay((end-start)*1000)
        return soundObject;
    }

    playLongSound(sound){
        if(!this.longSoundCoolDown.onCoolDown()){
            const soundObject = this.playSoundEffect(sound);
            const start = soundObject.start || 0;
            const end = soundObject.end || source.buffer.duration;
            this.longSoundCoolDown.setDelay((end-start)*1000);
        }
    }

    getBuffer(fileName){
        // Get key from file name
        const key = this.getKey(fileName)
        return this.buffers[key];
    }

    getKey(fileName){
        return fileName.split('.')[0];
    }
}
import Sounds from "../libraries/sounds.js";
import CoolDown from "../helpers/cooldown.js";

export default class AudioController{
    constructor(config){
        this.sounds = new Sounds(); // Get sound library
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = undefined; // We need to get our audio context from a player action later
        this.baseUrl = "../../src/sound/";
        this.buffers = {}; // Loaded audio files
        this.longSoundCoolDown = new CoolDown(1000); // Cooldown for continueous acitons
        this.currentSong = undefined; // Current buffer playing
        this.currentSongObj = undefined; // Current sound object obtained from sound library

        this.globalVolume = 50;
        this.musicGainNode = undefined;
        this.effectsGainNode = undefined; // Not implemented
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

    // Clears all music tracks out of the buffers
    clearMusicBuffers() {
        for (let key in this.sounds.music){
            if (this.sounds.music.hasOwnProperty(key)) {
                const soundObj = this.sounds.music[key];
                    delete this.buffers[this.getKey(soundObj.fileName)];
            }
        }
    }

    // Continues current song or playes new song when switching scenes
    cleanUp(nextSceneName){
        const nextSoundobj = this.sounds.music[nextSceneName];
        // Remove next song
        this.currentSong.onended = null
        // Check if the next scene plays the current song
        if(this.currentSongObj.fileName === nextSoundobj.fileName){
            // Continue song
            if(nextSoundobj.next) {
                // Re-assign the new scenes song que
                this.currentSong.onended = ()=> {
                    this.playMusic(nextSoundobj.next)
                }
            }
        }
        // Play new song
        else{
            console.log("playing new song")
            this.currentSong.disconnect()
            this.clearMusicBuffers();
            this.playMusic(nextSceneName)
        }
    }

    // Plays a song if no scene was previously loaded
    sceneStart(sceneName){
        if(this.sounds.music[sceneName]){
            this.playMusic(sceneName);
        }
    }

    // Loads all sound effects into buffers for fast execution
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

    // Loads a audio file into buffers, takes a library sound object
    async loadAudio(audioObj){
        // Skip if the audio is already in the buffer
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
    
    // Plays music, song parameter is the sound library key
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
        // Detune song
        if(soundObject.detune){
            this.currentSong.detune.setValueAtTime(soundObject.detune,this.audioCtx.currentTime)
        }
        if(soundObject.next){
            // Que up next song
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

        // Detunes the sound effect
        if(soundObject.detune){
            source.detune.setValueAtTime(soundObject.detune,this.audioCtx.currentTime)
        }
        // Connect the audio to the speakers
        source.connect(this.audioCtx.destination);
        // Start the audio
        source.start(0, start, end);
        return soundObject;
    }

    // Use this method for calling sounds effects continuously, plays them only when off cooldown
    playLongSound(sound){
        if(!this.longSoundCoolDown.onCoolDown()){
            const soundObject = this.playSoundEffect(sound);
            const start = soundObject.start || 0;
            const end = soundObject.end || source.buffer.duration;
            this.longSoundCoolDown.setDelay((end-start)*1000);
        }
    }

    // Gets a loaded audio file from buffer
    getBuffer(fileName){
        // Get key from file name
        const key = this.getKey(fileName)
        return this.buffers[key];
    }

    // Turns a filename into a buffer key
    getKey(fileName){
        return fileName.split('.')[0];
    }
}
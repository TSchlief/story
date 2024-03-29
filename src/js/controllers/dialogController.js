import Dialog from "../libraries/dialog.js";

// Processes dialog objects and calls events
export default class DialogController {
    constructor(config) {
        this.dialog = new Dialog(); // Get the dialog library
        this.inputController = config.inputController // We need the input controller to navigate dialog
        this.inputController.setDialogRemote(this.input.bind(this)) // When we set this remote. InputController will call 
        this.audioController = config.audioController;
        this.currentScene = undefined;
        this.dialogWrapper = document.getElementById('dialogWrapper');
        this.dialogContainer = document.getElementById('dialogContainer');
        this.dialogText = document.getElementById('dialogText');

        this.optionSelect1 = document.getElementById('optionSelect1');
        this.optionSelect2 = document.getElementById('optionSelect2');
        this.option1 = document.getElementById('option1');
        this.option2 = document.getElementById('option2');

        this.isEnabled = false;
        this.nextFlag = false;
        this.renderFlag = false;
        this.skipFlag = false;
        this.option = 0;

        this.debugMode= false;
    }

    getDialog(code) {
        return this.dialog.getDialog(code);
    }

    async handleDialog(code) {
        this.isEnabled = true;
        let result = {};
        const request = this.getDialog(code);
        // Add destination to result
        if(request.dest){
            result.dest = request.dest;
            result.playerLocation = request.playerLocation;
        }
        // Add any event Unlocks to result
        if(request.unlockEvent){
            result.unlockEvent = request.unlockEvent;
        }
        // Check if forwarding is defined
        if(request.forwarding){
            // Check if forwarding is active
            if(request.forwarding[0] !== 0){
                // Foward to next dialog
                // The first item in forwarding is the index to choose
                const newCode = request.forwarding[request.forwarding[0]];
                if(newCode === 0){
                    this.currentScene.characterController.isEnabled = true;
                }
                return {dialog: newCode};
            }
        }
        // Check if the dialog changes state
        if(request.state){
            // Change dialog state
            this.changeState(request.state);
        }
        if (request.text) {
            this.openDialog();
            
            for (let i = 0; i < request.text.length; i++) {
                await this.populateText(request.text[i])
                await this.waitForPlayer();
            }
            if(request.options){
                await this.populateText(request.optionsText);
                this.optionSelect1.style.backgroundColor = "red";
                this.optionSelect2.style.backgroundColor = "black";
                this.option = 0;
                
                this.option1.innerHTML = request.options[0].text;
                this.option2.innerHTML = request.options[1].text;
                await this.waitForPlayer();
                
                if(request.options[this.option].next){
                    result.dialog = request.options[this.option].next;
                }
                if(request.options[this.option].dest){
                    result.dest = request.options[this.option].dest;
                }
                
            }


            this.closeDialog();
        }
        
        this.isEnabled = false;
        return result;
    }
    
    waitForPlayer(){
        
        return new Promise(resolve => {
            const checkFlag = () => {
                if (this.nextFlag) {
                    this.nextFlag = false;
                    resolve();
                } else {
                    setTimeout(checkFlag, 100);
                }
            };
            checkFlag();
        });
    }
    

    openDialog(location = 76){
        //Resest State
        this.renderFlag = false;
        this.skipFlag = false;
        this.nextFlag = false;
        this.option1.innerHTML = "";
        this.option2.innerHTML = "";
        this.optionSelect1.style.backgroundColor = "black";
        this.optionSelect2.style.backgroundColor = "black";

        this.currentScene.characterController.isEnabled = false;
        this.dialogWrapper.style.display = "flex";
        this.dialogContainer.style.top = location + "%"
    }
    closeDialog(){
        this.dialogWrapper.style.display = "none";
        this.currentScene.characterController.isEnabled = true;

    }
    
    typeWriter(text, index) {
        const char = text.charAt(index);
        let delay = (Math.random()*20)+20;

        if (index < text.length) {
            if(char === "." || char === "!" || char === "," || char === "?") {
                delay = 300;
            }
            if(char === "*") {
                this.dialogText.innerHTML += "</br>";
            }
            else{
                this.dialogText.innerHTML += char;
            }
            this.audioController.playSoundEffect('typeWriter')
            index++;
            if(this.skipFlag || this.debugMode){                
                const resultString = text.replace(/\*/g, "</br>");
                this.dialogText.innerHTML = resultString;
                this.renderFlag = true;
            }else{
                setTimeout(() => this.typeWriter(text, index), delay);
            }
            
        }
        else {
            this.renderFlag = true;
        }
          
    }

    populateText(text){
        this.renderFlag = false;
        this.skipFlag = false;
        this.dialogText.innerHTML = "";
        this.typeWriter(text,0)
        
        
    }
    changeState(state){
        this.dialog.changeState(state);
    }

    input(input){
        if(!this.isEnabled){
            return;
        }
        if(input.code === "mainAction") {
            if(this.renderFlag){
                this.nextFlag = true;
            }
            
        }
        if(input.code === "secondaryAction") {
            this.skipFlag = true;
        }
        if(input.code === "up") {
            this.optionSelect1.style.backgroundColor = "red";
            this.optionSelect2.style.backgroundColor = "black";
            this.option = 0
        }
        if(input.code === "down") {
            this.optionSelect1.style.backgroundColor = "black";
            this.optionSelect2.style.backgroundColor = "red";
            this.option = 1
        }

    }
}
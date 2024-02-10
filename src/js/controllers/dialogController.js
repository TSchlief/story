import Dialog from "../dialog/dialog.js";

export default class DialogController {
    constructor(config) {
        this.dialog = new Dialog();
        this.inputController = config.inputController
        this.inputController.setDialogRemote(this.input.bind(this))
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
    }

    getDialog(code) {
        return this.dialog.getDialog(code);
    }

    async handleDialog(code) {
        this.isEnabled = true;
        let result = {};
        const request = this.getDialog(code);
        if (request.text) {
            this.openDialog();
            console.log("text", request.text)
            
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
            
            index++;
            if(this.skipFlag){                
                const resultString = text.replace(/\*/g, "</br>");
                this.dialogText.innerHTML = resultString;
                this.renderFlag = true;
            }else{
                setTimeout(() => this.typeWriter(text, index), delay);
            }
            
        }
        else {
            console.log("finished rendering")
            this.renderFlag = true;
            console.log(this)
        }
          
    }

    populateText(text){
        this.renderFlag = false;
        this.skipFlag = false;
        this.dialogText.innerHTML = "";
        this.typeWriter(text,0)
        
        
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

        if(input.code === "right") {
            console.log(this.nextFlag, this.renderFlag, this.skipFlag)
        }
    }
}
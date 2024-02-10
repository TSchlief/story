/*Exampe

code: {
    location: 35,
    text: ["Welcome!"] ,
    speaker: "narrator",
    next: 3,
    dest: "scene 4",
    options: [{text: "Yes", next: 'confirm'},{text: "No"}]
    cutscene: --NOT IMPLEMENTED--
}

*/
export default class Dialog{
    constructor(config) {
        this.dialog = {
            
            1: {
                text: ["Welcome!", "You are amazing.", "Believe it or not, this sign is actually a doorway. * It's true!"] ,
                speaker: "narrator",
                options: [{text: "Yes", dest: 'secondScene'},{text: "No", next: 2}],
                optionsText: "Go through the door?", 
            },
            
            2: {
                text: ["Fine then! Don't go on a great adventure!"] ,
                speaker: "narrator",
            }




            











        }
    }
    getDialog(code){
        return this.dialog[code];
    }

    
}
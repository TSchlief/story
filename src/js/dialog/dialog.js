/*Example

code: {
    location: 35, // Vertical Location to display textbox
    text: ["Welcome!"] , // Text list to be displayed
    speaker: "player", // The context of the dialog if undefined speaker is the nararator
    next: 3, // Next code to read
    dest: "scene 4", // Changes scent when dialog is finished 
    options: [{text: "Yes", next: 'confirm', dest:'sceneName'},{text: "No"}] // Use for user choice input
    cutscene: --NOT IMPLEMENTED--
    
    forwarding: [index, code, code] // Can be set to forward to different codes based on index
    state: [code, index] // Used to change the forwarding index of a code;
}

*/
export default class Dialog{
    constructor(config) {
        this.dialog = {
            0: {},// Empty dialog can be used for skipping depending on state

            1: {
                text: ["You feel rested! Time to start your day."] ,
                forwarding: [0, 0],
                state:[1, 1],
            },

            2: {
                text: ["In a hurry?"] ,
                forwarding: [0, 4],
                state:[2, 1],
            },

            3: {
                text: ["Made of wood."] ,
                state:[2, 1],
            },
            
            4: {
                dest: "acreageScene"
            },
            
            




            











        }
    }
    // Retrieves a dialog object
    getDialog(code){
        return this.dialog[code];
    }
    changeState(state){
        // The fist index of state is the code to change
        // Second index of state is the new forwarding index
        this.dialog[state[0]].forwarding[0] = state[1];
    }

    
}
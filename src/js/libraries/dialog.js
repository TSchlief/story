/*Example

code: {
    location: 35, // Vertical Location to display textbox
    text: ["Welcome!"] , // Text list to be displayed
    speaker: "player", // The context of the dialog if undefined speaker is the nararator
    next: 3, // Next code to read
    dest: "scene 4", // Changes scene when dialog is finished 
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
                forwarding: [0, 2.1, 2.2],
                state:[2, 1],
            },
            2.1: {
                text: ["Do you want to have a look around first?"] ,
                state:[2, 2],
            },

            2.2: {
                dest: "chapter1/hallway",
                playerLocation: {x: -97, y: 46},
            },

            3: {
                text: ["Our parents door appears to be locked."] ,
            },

            4: {
                text: ["All your shelves are empty."] ,
            },
            
            5: {
                text: ["You dont feel the need to go to the bathroom."] ,
            },
            6: {
                text: ["Behold, a masterpiece gracing this wall. It's so exquisite that even the wall itself blinks in disbelief at its own inability to behold such magnificence."] ,
            },

            7: {
                text: ["You only have one stylish outfit, but you're already wearing it."] ,
            },

            8: {
                text: ["Going back to bed seems like a bad idea."] ,
            },

            9: {
                text: ["This chair is made of wood."] ,
            },

            10: {
                text: ["You found...", "The ability to move objects!"] ,
                forwarding: [0, 0],
                state:[2, "+", 10, 1],
            },
            11:{
                text: ["You would rather see what your brother is up to."] ,
            },
            
            12:{
                text: ["How's it going."] ,
                forwarding: [0, 13],
                state:[12, 1],
            },
            13:{
                text: ["Good morning."] ,
                state:[12, 0],
            }


            
            




            











        }
    }
    // Retrieves a dialog object
    getDialog(code){
        return this.dialog[code];
    }
    changeState(state){
        // The fist index of state is the code to change
        // Second index of state is the new forwarding index
        // If the second index is "+" then increment the forwarding index
        let i = 0;
        while (i < state.length){
            if(state[i+1] === "+"){
                this.dialog[state[i+0]].forwarding[0]++;
            }else{
                this.dialog[state[i+0]].forwarding[0] = state[i+1];
            }
            i+=2;
        }
        
    }

    
}
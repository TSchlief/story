// CoolDown class to manage cooldown periods between actions
export default class CoolDown{
    constructor(delay){
        this.delay = delay; // set cooldown delay
        this.executed = 0;  // initialize last execution time
    }
    
    // Returns true if cooldown is active
    onCoolDown(delay = this.delay){
        const now = Date.now();
        if((now - this.executed) >= delay){
            this.executed = now;
            return false;
        }
        return true;
    }

    // Set the cooldown delay
    setDelay(delay){
        this.delay = delay;
    }


}   


import EventController from "./controllers/eventController.js";




const eventController = new EventController();

let clickedSplash = false;
const splashScreen = document.getElementById('splashScreen');
splashScreen.addEventListener("click",()=>{
    // Check if we have clicked
    if(!clickedSplash){
        // Allow only one click
        clickedSplash = true
        function decreaseOpacity(){
            // Convert opacity to a number
            const opacity = parseFloat(splashScreen.style.opacity);
            // Check if opacity is greater than 0
            if (opacity > 0) {
                // Decrease opacity
                splashScreen.style.opacity = opacity - 0.03;
                // Call fadeIn again after delay
                setTimeout(() => decreaseOpacity(), 20);
            }
            else{
                splashScreen.remove();
                eventController.splashScreenInit();
            }
        }
        decreaseOpacity();
    }
});















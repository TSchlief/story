import  { app, BrowserWindow } from 'electron';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const expressApp = express();
const port = 3003;
const __dir = dirname(fileURLToPath(import.meta.url));

expressApp.use(express.static(__dir));

expressApp.listen(port, (e)=> {
    if(e) throw e;
    console.log(`Server listening on port ${port}`);
})

expressApp.get("/", (req, res)=>{
    res.sendFile(__dir+ "/app.html");
})
expressApp.get("/mapEditor", (req, res)=>{
    res.sendFile(__dir+ "/mapEditor.html");
})



// Create the Electron window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load your Express app URL
    win.loadURL('http://localhost:3003');
}

// Event listener for when the Electron app is ready
app.whenReady().then(createWindow);

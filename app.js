import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const expressApp = express();
const port = 3000;
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


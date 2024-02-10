import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const expressApp = express();
const port = 3000;
const __dir = dirname(fileURLToPath(import.meta.url));

expressApp.use(express.json());
expressApp.use(express.static(__dir));


expressApp.listen(port, (e)=> {
    if(e) throw e;
    console.log(`Server listening on port ${port}`);
});

expressApp.get("/", (req, res)=>{
    res.sendFile(__dir+ "/app.html");
});

expressApp.get("/mapEditor", (req, res)=>{
    res.sendFile(__dir+ "/mapEditor.html");
});

expressApp.post('/saveMapBoundry', (req, res) => {
    const mapBoundry = req.body.optimizedSquares;
    const fileName = req.body.fileName;
    console.log(req.body)

    const data = `export const mapBoundry = ${JSON.stringify(mapBoundry, null, 4)};`;
    
    fs.writeFileSync(__dir+`/src/js/boundryLayers/${fileName}.js`, data);

    res.send('File saved successfully');
});


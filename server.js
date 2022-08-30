const express = require("express");
const path = require("path");
const fs = require("fs");
const dataJson = require("./db/db.json");
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// routes

app.get("/notes", (req, res) =>
    res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) =>
    res.json(dataJson)
);

app.post('/api/notes', (req, res) => {
    const newNote = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf-8");
    req.body.id = uuidv4()
    dataJson.push(req.body);

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(dataJson), "utf-8");
    res.json(dataJson);
});                     

//new routes here
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, "./public/index.html"))
);
                        
// delete note
app.delete("/api/notes/:id", (req, res) => {
    const deleteNote = req.params.id
    const index = dataJson.findIndex((note) => note.id === deleteNote);
    dataJson.splice(index, 1);
    
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify((dataJson), null, 4), "utf8", () => {
        res.json(dataJson);
    })
});
    
app.listen(PORT, function(err) {
    if (err) 
    console.log(err);
    console.log(`Server listening on PORT ${PORT}`)
});

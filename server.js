const express = require("express");
const path = require("path");
const fs = require("fs");
const notes = require("./db/db.json");
const  uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

// routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        const notes = JSON.parse(data)
        
        res.json(notes)
    })
})

app.post("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        const notes = JSON.parse(data)
        
        const newNote = req.body;
        newNote.id = Math.floor(Math.random() * 1000000)

        notes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(notes), (err => {
            if(err) throw err;

            res.json("added a new note")
        }))
    })
})
//any new route here
app.delete("api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const deleteNote = notes.filter((removeNote) => removeNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(deleteNote));
    res.json(deleteNote);

    // res.send("DELETE Request Called")
})

app.listen(PORT, function(err) {
    if (err) 
    console.log(err);
    console.log("Server listening on PORT", PORT);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});
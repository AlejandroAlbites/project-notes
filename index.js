const express = require('express');
const mongoose = require('mongoose');
const Note = require("./models/note")
const cookieSession = require('cookie-session');
const app = express();

// llamando a mongoose
mongoose.connect("mongodb://localhost:27017/notes", {useNewUrlParser: true});

// middleware
const logger = (req, res, next) => {
    console.log("nueva peticion https");
    next();
};
//fin del middlweare

app.set("view engine", "pug");
app.set("views", "views");
app.use("/assets", express.static("assets"));
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
    secret: "una_cadena_secreta",
    maxAge: 24*60*60*1000
}));

//MUESTRA LA LISTA DE NOTAS

app.get( "/", async (req, res) => {
    // const name = req.query.name;
    // const age = req.query.age;
    const notes = await Note.find();
    // const notes = ["nota1", "nota2", "nota3"];
    res.render('index', {notes});
});

//MUESTRA EL FORMULARIO PARA CREAR UNA NOTA
app.get("/notes/new", async (req,res) => {
    const notes = await Note.find();
    res.render("new", {notes});
});

//ENVIA LA PETICION PARA CREAR LA NOTA
app.post("/notes",async (req,res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body,
    };
    try {
        const note = new Note(data);
        await note.save();
    } catch(err){
        return next(err);
    }
    res.redirect("/");
});

app.get("/notes/:id", async (req, res) => {
    const notes = await Note.find();
    const note = await Note.findById(req.params.id);
    res.render("show", {notes: notes, currentNote: note})
});


app.listen(3000, () => console.log("Listening on port 3000"));
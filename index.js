const express = require('express');
const mongoose = require('mongoose');
const Note = require("./models/note");
const User = require("./models/User");
const cookieSession = require('cookie-session');
const md = require('marked');
const app = express();

// llamando a mongoose
mongoose.connect("mongodb://localhost:27017/notes", {useNewUrlParser: true});

// middleware
// const logger = (req, res, next) => {
//     console.log("nueva peticion https");
//     next();
// };
//fin del middlweare

app.set("view engine", "pug");
app.set("views", "views");
app.use("/assets", express.static("assets"));
// app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
    secret: "una_cadena_secreta",
    maxAge: 24*60*60*1000
}));

const requireUser = (req, res, next) => {
    if(!res.locals.user) {
        return res.redirect("/login");
    }
    next();
};

app.use(async (req, res, next) => {
    const userId = req.session.userId;
    if(userId) {
        const user = await User.findById(userId);
        if(user){
            res.locals.user = user;
        } else {
            delete req.session.userId;
        }
    }
    next();
})

//MUESTRA LA LISTA DE NOTAS

app.get( "/", requireUser, async (req, res) => {
    const notes = await Note.find({ user: res.locals.user});
    res.render('index', {notes});
});

//MUESTRA EL FORMULARIO PARA CREAR UNA NOTA
app.get("/notes/new", requireUser, async (req,res) => {
    const notes = await Note.find({ user: res.locals.user});
    res.render("new", {notes});
});

//ENVIA LA PETICION PARA CREAR LA NOTA
app.post("/notes",requireUser, async (req,res, next) => {
    const data = {
        title: req.body.title,
        body: req.body.body,
        user: res.locals.user,
    };
    try {
        const note = new Note(data);
        await note.save();
    } catch(err){
        return next(err);
    }
    res.redirect("/");
});
//Muestra la nota
app.get("/notes/:id", requireUser, async (req, res) => {
    const notes = await Note.find({ user: res.locals.user});
    const note = await Note.findById(req.params.id);
    res.render("show", {notes: notes, currentNote: note})
});
// muestra el formulario para editar una nota

app.get("/notes/:id/edit", requireUser, async (req, res, next) => {
    try {
        const notes = await Note.find();
        const note = await Note.findById(req.params.id);
        res.render("edit", {notes: notes, currentNote: note});
    } catch (e) {
        return next(e);
    }    
});

//actualiza una nota
app.patch("/notes/:id", requireUser, async (req, res, next) => {
    const id = req.params.id;
    const note = await Note.findById(id);

    note.title = req.body.title;
    note.body = req.body.body;

    try {
        await note.save({});
        res.status(204).send({});
    } catch (e) {
        return next(e);
    }
});
// Elimina una nota
app.delete("/notes/:id", requireUser, async (req, res, next) => {
    try {
        await Note.deleteOne({ _id: req.params.id});
        res.status(204).send({});
    } catch (e) {
        return next(e);
    }
    
});

// creando rutas para el modelo de usuario

app.get( "/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res, next) => {
    try{
        const user = await User.create({
            email: req.body.email,
            password: req.body.password
        });
        res.redirect("/login");

    }catch(e) {
        return next(e);
    }
})

app.get( "/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        if(user){
            req.session.userId = user._id;
            return res.redirect("/");
        }else{
            res.render("/login", {error: " wrong email or password. Try again!"});
        }
    } catch(e) {
        return next(e);
    }
});

app.get( "/logout", requireUser, (req, res) => {
    res.session = null;
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.redirect("/login");
});



app.listen(3000, () => console.log("Listening on port 3000"));
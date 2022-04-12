const express = require('express');
const cookieSession = require('cookie-session');
const app = express();

// middleware
const logger = (req, res, next) => {
    console.log("nueva peticion https");
    next();
};

//fin del middlweare

app.set("view engine", "pug");
app.set("views", "views");
app.use("/static", express.static("public"));
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
    secret: "una_cadena_secreta",
    maxAge: 24*60*60*1000
}));

app.get( "/", (req, res) => {
    // const name = req.query.name;
    // const age = req.query.age;
    req.session.views = (req.session.views || 0) + 1
    const notes = ["nota1", "nota2", "nota3"];
    res.render('index', {notes, views: req.session.views});
});

app.get("/notes/new", (req,res) => {
    res.render('new');
});
app.post("/notes", (req,res) => {
    console.log(req.body);
    res.redirect("/");
});

// app.get("/users/:name", (req,res) => {
//     const name = req.params.name;
//     res.send(`<h1> hola ${name} </h1>`)
// })





// app.post("/users", (req, res) => {
//     res.status(404);
//     res.set("Content-type", "text/plain");
//     res.send("no se encontro el recurso");
// })

app.listen(3000, () => console.log("Listening on port 3000"));
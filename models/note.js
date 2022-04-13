const mongoose = require("mongoose");

// MONGOOSE / Creando el esquema
const NoteSchema = mongoose.Schema({
    title: String,
    body: String
});
// MONGOOSE / creando el modelo
const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
const mongoose = require("mongoose");

// MONGOOSE / Creando el esquema
const NoteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true,
    },
    body: String
});
NoteSchema.methods.truncateBody = function() {
    if (this.body && this.body.length > 75) {
        return this.body.substring(0, 70) + "...";
    }
    return this.body;
};
// MONGOOSE / creando el modelo
const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
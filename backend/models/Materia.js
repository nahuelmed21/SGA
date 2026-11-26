const mongoose = require("mongoose")

const materiaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true,                   
        uppercase: true,
        maxlength: 15
    },
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    descripcion: {
        type: String,
        default: "",
        maxlength: 300,
        validate: { validator: (valor) => valor.length === 0 || valor.trim().length > 0, }
    },
    cargaHoraria: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
    }
        },
    estado: {
        type: String,
        required: true,
        enum: ["activa", "inactiva"]
    }
},
{
    versionKey: false
}
)

const Materia = mongoose.model("Materia", materiaSchema)

module.exports = Materia

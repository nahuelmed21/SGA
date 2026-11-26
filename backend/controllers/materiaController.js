const Materia = require("../models/Materia")

async function obtenerMaterias(req, res) {
    const materias = await Materia.find()
    res.json(materias)
}

async function obtenerMateria(req, res) {
    const materia = await Materia.findOne({
        codigo: req.params.codigo.trim().toUpperCase()
    })
    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }
    res.json(materia)
}

async function crearMateria(req, res) {
    const { codigo, nombre, descripcion, cargaHoraria, estado } = req.body
    if (!codigo || !nombre || !cargaHoraria || !estado) {
        return res.status(400).json({
            mensaje: "Código, nombre, carga horaria y estado son obligatorios"
        })
    }
    if (typeof codigo !== "string" || typeof nombre !== "string") {
        return res.status(400).json({
            mensaje: "El código y el nombre deben ser texto"
        })
    }
    if (!Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
        return res.status(400).json({
            mensaje: "La carga horaria debe ser un número entero mayor que cero"
        })
    }
    if (estado !== "activa" && estado !== "inactiva") {
        return res.status(400).json({
            mensaje: "El estado solo puede ser activa o inactiva"
        })
    }
    const existe = await Materia.findOne({
        codigo: codigo.trim().toUpperCase()
    })
    if (existe) {
        return res.status(400).json({
            mensaje: "El código ya existe"
        })
    }
    const nuevaMateria = await Materia.create({
        codigo,
        nombre,
        descripcion,
        cargaHoraria,
        estado
    })
    res.status(201).json(nuevaMateria)
}

async function actualizarMateria(req, res) {
    const { nombre, descripcion, cargaHoraria, estado } = req.body
    const materia = await Materia.findOneAndUpdate(
        { codigo: req.params.codigo.trim().toUpperCase() },
        { nombre, descripcion, cargaHoraria, estado },
        { returnDocument: "after", runValidators: true }
    )
    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }
    res.json(materia)
}

async function eliminarMateria(req, res) {
    const materia = await Materia.findOneAndDelete({
        codigo: req.params.codigo.trim().toUpperCase()
    })
    if (!materia) {
        return res.status(404).json({
            mensaje: "Materia no encontrada"
        })
    }
    res.json({ mensaje: "Materia eliminada correctamente" })
}

module.exports = {
    obtenerMaterias,
    obtenerMateria,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}
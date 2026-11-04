const Materia = require("../models/Materia")

const ESTADOS_PERMITIDOS = ["activa", "inactiva"]

function normalizarCodigo(codigo) {
    return String(codigo).trim().toUpperCase()
}

function validarMateria({ codigo, nombre, descripcion, cargaHoraria, estado }) {
    if (typeof codigo !== "string" || codigo.trim() === "") {
        return "El código es obligatorio y debe ser un texto"
    }
    if (typeof nombre !== "string" || nombre.trim() === "") {
        return "El nombre es obligatorio"
    }
    if (nombre.trim().length < 3 || nombre.trim().length > 100) {
        return "El nombre debe tener entre 3 y 100 caracteres"
    }
    if (descripcion !== undefined && descripcion !== null) {
        if (typeof descripcion !== "string") {
            return "La descripción debe ser un texto"
        }
        if (descripcion.length > 0 && descripcion.trim() === "") {
            return "La descripción no puede contener únicamente espacios"
        }
    }
    if (cargaHoraria === undefined || cargaHoraria === null || cargaHoraria === "") {
        return "La carga horaria es obligatoria"
    }
    if (typeof cargaHoraria !== "number" || !Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
        return "La carga horaria debe ser un número entero mayor que cero"
    }
    if (estado === undefined || estado === null || estado === "") {
        return "El estado es obligatorio"
    }
    if (!ESTADOS_PERMITIDOS.includes(estado)) {
        return "El estado solo puede ser activa o inactiva"
    }
    return null
}

function armarDatos({ codigo, nombre, descripcion, cargaHoraria, estado }) {
    return {
        codigo: normalizarCodigo(codigo),
        nombre: nombre.trim(),
        descripcion: typeof descripcion === "string" ? descripcion.trim() : "",
        cargaHoraria,
        estado
    }
}

function responderError(res, error) {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe una materia con ese código"
        })
    }
    if (error.name === "ValidationError") {
        const primerError = Object.values(error.errors)[0]
        return res.status(400).json({
            mensaje: primerError.message
        })
    }
    console.error("Error en materias:", error)
    return res.status(500).json({
        mensaje: "Error interno del servidor"
    })
}

async function obtenerMaterias(req, res) {
    try {
        const materias = await Materia.find().sort({ codigo: 1 })
        res.json(materias)
    } catch (error) {
        responderError(res, error)
    }
}

async function obtenerMateria(req, res) {
    try {
        const materia = await Materia.findOne({
            codigo: normalizarCodigo(req.params.codigo)
        })
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        res.json(materia)
    } catch (error) {
        responderError(res, error)
    }
}

async function crearMateria(req, res) {
    try {
        const errorValidacion = validarMateria(req.body)
        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            })
        }
        const datos = armarDatos(req.body)

        const existe = await Materia.findOne({
            codigo: datos.codigo
        })
        if (existe) {
            return res.status(409).json({
                mensaje: "Ya existe una materia con ese código"
            })
        }
        const nuevaMateria = await Materia.create(datos)
        res.status(201).json(nuevaMateria)
    } catch (error) {
        responderError(res, error)
    }
}

async function actualizarMateria(req, res) {
    try {
        const codigoActual = normalizarCodigo(req.params.codigo)

        const materia = await Materia.findOne({
            codigo: codigoActual
        })
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }

        const errorValidacion = validarMateria(req.body)
        if (errorValidacion) {
            return res.status(400).json({
                mensaje: errorValidacion
            })
        }
        const datos = armarDatos(req.body)

        if (datos.codigo !== codigoActual) {
            const duplicada = await Materia.findOne({
                codigo: datos.codigo
            })
            if (duplicada) {
                return res.status(409).json({
                    mensaje: "Ya existe una materia con ese código"
                })
            }
        }

        const materiaActualizada = await Materia.findOneAndUpdate(
            { codigo: codigoActual },
            datos,
            { returnDocument: "after", runValidators: true }
        )
        if (!materiaActualizada) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        res.json(materiaActualizada)
    } catch (error) {
        responderError(res, error)
    }
}

async function eliminarMateria(req, res) {
    try {
        const materia = await Materia.findOneAndDelete({
            codigo: normalizarCodigo(req.params.codigo)
        })
        if (!materia) {
            return res.status(404).json({
                mensaje: "Materia no encontrada"
            })
        }
        res.json({ mensaje: "Materia eliminada correctamente" })
    } catch (error) {
        responderError(res, error)
    }
}

module.exports = {
    obtenerMaterias,
    obtenerMateria,
    crearMateria,
    actualizarMateria,
    eliminarMateria
}

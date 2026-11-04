import { useState } from "react";
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
const API_MATERIAS = "http://localhost:3000/materias"

const FORMULARIO_VACIO = {
    codigo: "",
    nombre: "",
    descripcion: "",
    cargaHoraria: "",
    estado: "activa"
}

function validarFormulario(formulario) {
    const errores = {}
    const codigo = formulario.codigo.trim()
    const nombre = formulario.nombre.trim()
    const cargaHoraria = formulario.cargaHoraria.trim()

    if (codigo === "") {
        errores.codigo = "El código es obligatorio"
    } else if (codigo.length > 15) {
        errores.codigo = "El código no puede superar los 15 caracteres"
    }

    if (nombre === "") {
        errores.nombre = "El nombre es obligatorio"
    } else if (nombre.length < 3 || nombre.length > 100) {
        errores.nombre = "El nombre debe tener entre 3 y 100 caracteres"
    }

    if (formulario.descripcion.length > 0 && formulario.descripcion.trim() === "") {
        errores.descripcion = "La descripción no puede contener únicamente espacios"
    } else if (formulario.descripcion.trim().length > 300) {
        errores.descripcion = "La descripción no puede superar los 300 caracteres"
    }

    if (cargaHoraria === "") {
        errores.cargaHoraria = "La carga horaria es obligatoria"
    } else if (!/^\d+$/.test(cargaHoraria) || Number(cargaHoraria) <= 0) {
        errores.cargaHoraria = "La carga horaria debe ser un número entero mayor que cero"
    }

    if (!["activa", "inactiva"].includes(formulario.estado)) {
        errores.estado = "El estado solo puede ser activa o inactiva"
    }

    return errores
}

function FormularioMateria({ materiaEditar, onMateriaGuardada, onCancelar }) {
    const [formulario, setFormulario] = useState({
        codigo: materiaEditar?.codigo ?? "",
        nombre: materiaEditar?.nombre ?? "",
        descripcion: materiaEditar?.descripcion ?? "",
        cargaHoraria: String(materiaEditar?.cargaHoraria ?? ""),
        estado: materiaEditar?.estado ?? "activa"
    })
    const [errores, setErrores] = useState({})
    const [error, setError] = useState("")
    const [guardando, setGuardando] = useState(false)

    function manejarCambio(e) {
        const { name, value } = e.target

        setFormulario({
            ...formulario,
            [name]: value
        })
        setErrores({
            ...errores,
            [name]: ""
        })
    }

    async function guardar(e) {
        e.preventDefault()
        setError("")

        const erroresValidacion = validarFormulario(formulario)
        if (Object.keys(erroresValidacion).length > 0) {
            setErrores(erroresValidacion)
            return
        }

        setGuardando(true)

        const materia = {
            codigo: formulario.codigo.trim().toUpperCase(),
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            cargaHoraria: Number(formulario.cargaHoraria),
            estado: formulario.estado
        }
        const editando = Boolean(materiaEditar)
        const url = editando
                    ? `${API_MATERIAS}/${encodeURIComponent(materiaEditar.codigo)}`
                    : API_MATERIAS
        try {
            const respuesta = await fetch(url, {
                method: editando ? "PUT" : "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(materia)
            })
            const datos = await respuesta.json().catch(() => ({}))

            if (!respuesta.ok) {
                throw new Error(datos.mensaje || `No se pudo guardar la materia. Estado HTTP: ${respuesta.status}`)
            }

            if (!editando) {
                setFormulario(FORMULARIO_VACIO)
                setErrores({})
            }
            onMateriaGuardada(editando
                ? `La materia ${datos.codigo} se modificó correctamente`
                : `La materia ${datos.codigo} se registró correctamente`)
        } catch (error) {
            console.error("Error al guardar:", error)
            setError(error instanceof TypeError
                ? "No se pudo conectar con el servidor. Verificá que el backend esté en funcionamiento."
                : error.message)
        } finally {
            setGuardando(false)
        }
    }

    function cancelar() {
        onCancelar()
    }

    return (
        <Paper
            component="section"
            elevation={0}
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                mb: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                bgcolor: "background.paper"
            }}
        >
            <Typography component="h2" variant="h5" sx={{ mb: 2.5, fontWeight: 700 }}>
                {materiaEditar ? `Editar materia ${materiaEditar.codigo}` : "Nueva materia"}
            </Typography>
            <Box
                component="form"
                onSubmit={guardar}
                noValidate
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2
                }}
            >
                <TextField
                    id="codigo"
                    name="codigo"
                    label="Código"
                    value={formulario.codigo}
                    onChange={manejarCambio}
                    error={Boolean(errores.codigo)}
                    helperText={errores.codigo || "Ejemplo: PRG4"}
                    slotProps={{ htmlInput: { maxLength: 15 } }}
                    required
                    fullWidth
                />
                <TextField
                    id="nombre"
                    name="nombre"
                    label="Nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    error={Boolean(errores.nombre)}
                    helperText={errores.nombre}
                    required
                    fullWidth
                />
                <TextField
                    id="cargaHoraria"
                    name="cargaHoraria"
                    label="Carga horaria"
                    type="number"
                    value={formulario.cargaHoraria}
                    onChange={manejarCambio}
                    error={Boolean(errores.cargaHoraria)}
                    helperText={errores.cargaHoraria || "Cantidad de horas (número entero)"}
                    slotProps={{ htmlInput: { min: 1, step: 1 } }}
                    required
                    fullWidth
                />
                <TextField
                    id="estado"
                    name="estado"
                    label="Estado"
                    select
                    value={formulario.estado}
                    onChange={manejarCambio}
                    error={Boolean(errores.estado)}
                    helperText={errores.estado}
                    required
                    fullWidth
                >
                    <MenuItem value="activa">Activa</MenuItem>
                    <MenuItem value="inactiva">Inactiva</MenuItem>
                </TextField>
                <TextField
                    id="descripcion"
                    name="descripcion"
                    label="Descripción"
                    value={formulario.descripcion}
                    onChange={manejarCambio}
                    error={Boolean(errores.descripcion)}
                    helperText={errores.descripcion || "Opcional"}
                    multiline
                    minRows={2}
                    fullWidth
                    sx={{ gridColumn: "1 / -1" }}
                />
                <Box
                    sx={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mt: 1
                    }}
                >
                    <Button type="submit" variant="contained" disabled={guardando}>
                        {guardando
                            ? "Guardando..."
                            : materiaEditar
                                ? "Guardar cambios"
                                : "Guardar"}
                    </Button>
                    {materiaEditar && (
                        <Button
                            type="button"
                            onClick={cancelar}
                            disabled={guardando}
                            variant="outlined"
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>
                {error && (
                    <Alert severity="error" role="alert" sx={{ gridColumn: "1 / -1" }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Paper>
    )
}
export default FormularioMateria

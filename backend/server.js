require("dotenv").config() 

const express = require("express") 
const cors = require("cors")

const conectarDB = require("./config/database")
const alumnosRoutes = require("./routes/alumnos.routes") 
const docentesRoutes = require("./routes/docentes.routes")
const authRoutes  = require("./routes/authRoutes")
const materiaRoutes = require("./routes/materiaRoutes")


const app = express() 

app.use(express.json()) 
app.use(cors()) 
app.use("/alumnos", alumnosRoutes) 
app.use("/docentes", docentesRoutes)
app.use("/auth", authRoutes)
app.use("/materias", materiaRoutes)

app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            mensaje: "El cuerpo de la petición no es un JSON válido"
        })
    }
    console.error("Error no controlado:", error)
    res.status(500).json({
        mensaje: "Error interno del servidor"
    })
})

const PORT = process.env.PORT 

conectarDB() 

console.log("Ejecutado con nodemon")

app.listen(PORT, () => { 
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})


// Creo un middleware
// app.use((req, res, next) => {
//     console.log(req.method)
//     console.log(req.url)
//     next()
// })
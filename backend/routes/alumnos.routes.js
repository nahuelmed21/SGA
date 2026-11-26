const express = require("express") 
const { verificarToken } = require("../middlewares/authMiddleware")
const { verificarRol } = require("../middlewares/rolMiddleware")
// const alumnosController = require("../controllers/alumnos.controller")
const { 
    obtenerAlumnos, 
    obtenerAlumno, 
    crearAlumno, 
    actualizarAlumno, 
    eliminarAlumno } = require("../controllers/alumnos.controller")
const router = express.Router() 

router.get("/", verificarToken , obtenerAlumnos) 

router.get("/:id", verificarToken , obtenerAlumno) 

router.post("/", verificarToken , verificarRol("admin"), crearAlumno) 

router.put("/:id", verificarToken , verificarRol("admin"), actualizarAlumno) 

router.delete("/:id", verificarToken , verificarRol("admin"),  eliminarAlumno) 

module.exports = router 
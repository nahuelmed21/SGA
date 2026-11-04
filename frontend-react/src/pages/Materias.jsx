import { useState } from "react"
import Alert from "@mui/material/Alert"
import FormularioMateria from "../components/FormularioMateria"
import { ListaMaterias } from "../components/ListaMaterias"

export default function Materias() {
const [actualizar, setActualizar] = useState(0)
const [materiaEditar, setMateriaEditar] = useState(null)
const [mensaje, setMensaje] = useState("")

function operacionExitosa(texto) {
  setMensaje(texto)
  setActualizar(valor => valor + 1)
  setMateriaEditar(null)
}

function seleccionarMateria(materia) {
  setMensaje("")
  setMateriaEditar(materia)
  window.scrollTo({ top: 0, behavior: "smooth" })
}

return (
   <>
   {mensaje && (
    <Alert severity="success" onClose={() => setMensaje("")} sx={{ mb: 3 }}>
      {mensaje}
    </Alert>
   )}
   <FormularioMateria key={materiaEditar?.codigo ?? "nueva"}
   materiaEditar={materiaEditar}
   onMateriaGuardada={operacionExitosa}
   onCancelar={() => setMateriaEditar(null)}
   />
   <ListaMaterias
   actualizar={actualizar}
   onEditarMateria={seleccionarMateria}
   onMateriaEliminada={operacionExitosa}
   />
  </>
  )
}

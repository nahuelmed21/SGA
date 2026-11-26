import { ListaMaterias } from "../components/ListaMaterias"
import { useState } from "react"
import FormularioMateria from "../components/FormularioMateria"

export default function Materias() {
const [actualizar, setActualizar] = useState(0)
const [materiaEditar, setMateriaEditar] = useState(null)

function materiaGuardada() {
  setActualizar(valor => valor + 1)
  setMateriaEditar(null)
}

function seleccionarMateria(materia) {
  setMateriaEditar(materia)
}

return (
   <>
   <FormularioMateria key={materiaEditar?.codigo ?? "nueva"}
   onMateriaGuardada={materiaGuardada}
   materiaEditar={materiaEditar}
   onCancelar={() => setMateriaEditar(null)}
   />
   <ListaMaterias
   actualizar={actualizar}
   onMateriaEliminada={materiaGuardada}
   onEditarMateria={seleccionarMateria}
   />
  </>
  )
}

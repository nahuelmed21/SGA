import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("token") || null)
    const [cargando, setCargando] = useState(true)
    const [usuario, setUsuario] = useState(() =>                         
        JSON.parse(localStorage.getItem("usuario") || "null")
    )

    const cerrarSesion = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        setToken(null)
        setUsuario(null)
    }

    useEffect(() => {
        const verificarSesion = async () => {
            const tokenGuardado = localStorage.getItem("token")

            if (!tokenGuardado) {
                setToken(null)
                setCargando(false)
                return
            }
            try {
                const respuesta = await fetch("http://localhost:3000/alumnos",
                    { headers: { Authorization: `Bearer ${tokenGuardado}` } }
                )
                if (!respuesta.ok) {
                    throw new Error("Sesión no válida")
                }
                setToken(tokenGuardado)
            } catch (error) {
                console.error("Error al verificar la sesión: ", error)
                cerrarSesion()
            } finally {
                setCargando(false)
            }
        }
        verificarSesion()
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken, cerrarSesion, cargando, usuario, setUsuario }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
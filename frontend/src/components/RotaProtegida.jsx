import { Navigate, useLocation } from 'react-router-dom'
import { estaLogado } from '../services/api'

// Envolve as telas que exigem login.
// Sem login, manda para /login e guarda a página de origem para voltar depois.
function RotaProtegida(props) {
  var localizacao = useLocation()

  if (!estaLogado()) {
    return <Navigate to="/login" replace state={{ de: localizacao.pathname }} />
  }

  return props.children
}

export default RotaProtegida

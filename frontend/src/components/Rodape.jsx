import { Link } from 'react-router-dom'
import './Rodape.css'

// Rodapé usado em todas as telas
function Rodape() {
  return (
    <footer className="rodape-site">
      <p>
        UNIFOR Exchange — plataforma de apoio à orientação.
        Não substitui os processos oficiais da UNIFOR.
      </p>

      <nav aria-label="Links do rodapé">
        <Link to="/requisitos">Requisitos</Link>
        <Link to="/elegibilidade">Elegibilidade</Link>
        <Link to="/contatos">Contato e Suporte</Link>
        <Link to="/relatos">Experiências de Estudantes</Link>
      </nav>
    </footer>
  )
}

export default Rodape

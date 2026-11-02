
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  var localizacao = useLocation()

  var links = [
    { nome: 'Mapa', caminho: '/mapa' },
    { nome: 'Universidades', caminho: '/universidades' },
    { nome: 'Quiz de Perfil', caminho: '/quiz' },
    { nome: 'Oportunidades', caminho: '/oportunidades' },
    { nome: 'Minha Jornada', caminho: '/minha-jornada' },
  ]

  return (
    <header className="home-header">
      <Link to="/" className="home-logo">
        <span className="home-logo-circle"></span>
        <strong>UNIFOR Exchange</strong>
      </Link>

      <nav className="home-nav">
        {links.map(function (link) {
          return (
            <Link
              key={link.caminho}
              to={link.caminho}
              className={
                localizacao.pathname === link.caminho ||
                  (link.caminho === '/quiz' &&
                    localizacao.pathname === '/resultado-quiz') ||
                  (link.caminho === '/universidades' &&
                    localizacao.pathname.startsWith('/universidades/')) ||
                  (link.caminho === '/mapa' &&
                    localizacao.pathname.startsWith('/pais/'))
                  ? 'link-ativo'
                  : ''
              }
            >
              {link.nome}
            </Link>
          )
        })}
      </nav>

      <Link to="/login" className="home-login">
        Entrar
      </Link>
    </header>
  )
}

export default Header

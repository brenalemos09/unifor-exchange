import { Link, useLocation, useNavigate } from 'react-router-dom'
import { obterUsuario, sair } from '../services/api'
import './Header.css'

function Header() {
  var localizacao = useLocation()
  var navegar = useNavigate()
  var usuario = obterUsuario()

  var links = [
    { nome: 'Mapa', caminho: '/mapa' },
    { nome: 'Universidades', caminho: '/universidades' },
    { nome: 'Quiz de Perfil', caminho: '/quiz' },
    { nome: 'Oportunidades', caminho: '/oportunidades' },
    { nome: 'Minha Jornada', caminho: '/minha-jornada' },
  ]

  if (usuario && usuario.tipo === 'administrador') {
    links.push({ nome: 'Administração', caminho: '/admin' })
  }

  function clicarSair() {
    sair()
    navegar('/')
  }

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

      {usuario ? (
        <div className="usuario-header">
          <span className="nome-usuario-header" title={usuario.email}>
            Olá, {usuario.nome.split(' ')[0]}
          </span>
          <button type="button" className="botao-sair-header" onClick={clicarSair}>
            Sair
          </button>
        </div>
      ) : (
        <Link to="/login" className="home-login">
          Entrar
        </Link>
      )}
    </header>
  )
}

export default Header

import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { entrar } from '../services/api'
import './Login.css'

function Login() {
  var navegar = useNavigate()
  var localizacao = useLocation()
  // página que a pessoa tentou abrir antes de ser mandada para o login
  var destino = localizacao.state && localizacao.state.de
  var [login, setLogin] = useState('')
  var [senha, setSenha] = useState('')
  var [erro, setErro] = useState('')
  var [carregando, setCarregando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      var usuario = await entrar(login, senha)
      if (destino) navegar(destino, { replace: true })
      else navegar(usuario.tipo === 'administrador' ? '/admin' : '/universidades')
    } catch (e) {
      setErro(e.message)
    }
    setCarregando(false)
  }

  return (
    <main className="pagina-login">
      <section className="painel-login">
        <Link to="/" className="marca-login">
          <span className="simbolo-login"></span>
          <strong>UNIFOR Exchange</strong>
        </Link>

        <div className="texto-painel-login">
          <h1>Seu próximo destino acadêmico começa aqui.</h1>

          <p>
            Acesse sua conta para acompanhar sua jornada de intercâmbio,
            explorar universidades e oportunidades disponíveis.
          </p>
        </div>

        <div className="destinos-login">
          <span className="destino destino-1"></span>
          <span className="destino destino-2"></span>
          <span className="destino destino-3"></span>
          <span className="destino destino-4"></span>
        </div>
      </section>

      <section className="formulario-login">
        <div className="conteudo-formulario">
          <h2>Bem-vindo de volta</h2>
          {destino && (
            <p className="aviso-login" role="status">
              Faça login para acessar esta página.
            </p>
          )}
          <p className="subtitulo-login">
            Entre com sua conta institucional para continuar.
          </p>

          <form onSubmit={enviar}>
            <div className="campo-login">
              <label htmlFor="email">Matrícula ou e-mail institucional</label>
              <input
                type="text"
                id="email"
                required
                value={login}
                onChange={function (evento) {
                  setLogin(evento.target.value)
                }}
                placeholder="Matrícula ou seunome@edu.unifor.br"
              />
            </div>

            <div className="campo-login">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                required
                value={senha}
                onChange={function (evento) {
                  setSenha(evento.target.value)
                }}
                placeholder="Digite sua senha"
              />
            </div>

            <div className="recuperar-senha">
              <Link to="/recuperar-senha">Esqueceu a senha?</Link>
            </div>

            {erro && <p role="alert" className="erro-login">{erro}</p>}

            <button type="submit" className="botao-login" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="criar-conta">
            Ainda não tem conta? <Link to="/cadastro" state={localizacao.state}>Criar conta</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
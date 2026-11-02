import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entrar } from '../services/api'
import './Login.css'

function Login() {
  var navegar = useNavigate()
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
      navegar(usuario.tipo === 'administrador' ? '/admin' : '/universidades')
    } catch (e) {
      setErro(e.message)
    }
    setCarregando(false)
  }

  return (
    <main className="pagina-login">
      <section className="painel-login">
        <div className="marca-login">
          <span className="simbolo-login"></span>
          <strong>UNIFOR Exchange</strong>
        </div>

        <div className="texto-painel-login">
          <h1>Seu próximo destino acadêmico começa aqui.</h1>

          <p>
            Acesse sua conta para acompanhar sua jornada de intercâmbio,
            explorar e oportunidades disponíveis.
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
              <a href="#recuperar">Esqueceu a senha?</a>
            </div>

            {erro && <p role="alert" style={{ color: '#b00020' }}>{erro}</p>}

            <button type="submit" className="botao-login" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="criar-conta">
            Ainda não tem conta? <a href="#cadastro">Criar conta</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
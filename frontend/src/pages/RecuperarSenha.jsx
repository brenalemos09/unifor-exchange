import { useState } from 'react'
import { Link } from 'react-router-dom'
import { pedirCodigoRecuperacao, redefinirSenha } from '../services/api'
import './Login.css'

function RecuperarSenha() {
  // etapa 1: pedir o código | etapa 2: informar código e nova senha | etapa 3: concluído
  var [etapa, setEtapa] = useState(1)
  var [login, setLogin] = useState('')
  var [codigo, setCodigo] = useState('')
  var [novaSenha, setNovaSenha] = useState('')
  var [confirmarSenha, setConfirmarSenha] = useState('')
  var [mensagem, setMensagem] = useState('')
  var [codigoDemo, setCodigoDemo] = useState('')
  var [erro, setErro] = useState('')
  var [carregando, setCarregando] = useState(false)

  async function pedirCodigo(evento) {
    evento.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      var resposta = await pedirCodigoRecuperacao(login.trim())
      setMensagem(resposta.mensagem)
      setCodigoDemo(resposta.codigo_demo ? String(resposta.codigo_demo) : '')
      setEtapa(2)
    } catch (e) {
      setErro(e.message)
    }
    setCarregando(false)
  }

  async function trocarSenha(evento) {
    evento.preventDefault()
    setErro('')
    if (novaSenha.length < 4) {
      setErro('A nova senha deve ter pelo menos 4 caracteres.')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }
    setCarregando(true)
    try {
      var resposta = await redefinirSenha(login.trim(), codigo, novaSenha)
      setMensagem(resposta.mensagem)
      setEtapa(3)
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
          <h1>Recupere o acesso à sua conta.</h1>
          <p>
            Informe sua matrícula ou e-mail. Vamos gerar um código de 6 dígitos,
            válido por 15 minutos, para você criar uma nova senha.
          </p>
        </div>
      </section>

      <section className="formulario-login">
        <div className="conteudo-formulario">
          <h2>Esqueceu a senha?</h2>

          {etapa === 1 && (
            <form onSubmit={pedirCodigo}>
              <p className="subtitulo-login">
                Digite a matrícula ou o e-mail cadastrado.
              </p>

              <div className="campo-login">
                <label htmlFor="login-recuperar">Matrícula ou e-mail</label>
                <input
                  type="text"
                  id="login-recuperar"
                  required
                  value={login}
                  onChange={function (evento) {
                    setLogin(evento.target.value)
                  }}
                  placeholder="Matrícula ou seunome@edu.unifor.br"
                />
              </div>

              {erro && <p role="alert" className="erro-login">{erro}</p>}

              <button type="submit" className="botao-login" disabled={carregando}>
                {carregando ? 'Enviando...' : 'Gerar código'}
              </button>
            </form>
          )}

          {etapa === 2 && (
            <form onSubmit={trocarSenha}>
              <p className="sucesso-login" role="status">{mensagem}</p>

              {codigoDemo ? (
                <p className="aviso-login">
                  Modo de demonstração: seu código é <strong>{codigoDemo}</strong>.
                </p>
              ) : (
                <p className="subtitulo-login">
                  Ainda não há envio de e-mail: o código aparece no terminal
                  em que a API está rodando. Peça-o à equipe responsável.
                </p>
              )}

              <div className="campo-login">
                <label htmlFor="codigo-recuperar">Código de 6 dígitos</label>
                <input
                  type="text"
                  id="codigo-recuperar"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={codigo}
                  onChange={function (evento) {
                    setCodigo(evento.target.value.replace(/\D/g, ''))
                  }}
                  placeholder="000000"
                />
              </div>

              <div className="campo-login">
                <label htmlFor="nova-senha">Nova senha</label>
                <input
                  type="password"
                  id="nova-senha"
                  required
                  autoComplete="new-password"
                  value={novaSenha}
                  onChange={function (evento) {
                    setNovaSenha(evento.target.value)
                  }}
                  placeholder="Mínimo de 4 caracteres"
                />
              </div>

              <div className="campo-login">
                <label htmlFor="confirmar-nova-senha">Confirmar nova senha</label>
                <input
                  type="password"
                  id="confirmar-nova-senha"
                  required
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={function (evento) {
                    setConfirmarSenha(evento.target.value)
                  }}
                  placeholder="Repita a nova senha"
                />
              </div>

              {erro && <p role="alert" className="erro-login">{erro}</p>}

              <button type="submit" className="botao-login" disabled={carregando}>
                {carregando ? 'Salvando...' : 'Redefinir senha'}
              </button>

              <p className="criar-conta">
                Não recebeu? <a href="#" onClick={function (evento) {
                  evento.preventDefault()
                  setEtapa(1)
                  setErro('')
                }}>Gerar outro código</a>
              </p>
            </form>
          )}

          {etapa === 3 && (
            <>
              <p className="sucesso-login" role="status">{mensagem}</p>
              <Link to="/login" className="botao-login botao-link-login">
                Ir para o login
              </Link>
            </>
          )}

          {etapa !== 3 && (
            <p className="criar-conta">
              Lembrou a senha? <Link to="/login">Voltar ao login</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}

export default RecuperarSenha

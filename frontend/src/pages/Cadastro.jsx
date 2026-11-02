import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { cadastrar } from '../services/api'
import './Cadastro.css'

function Cadastro() {
  var navegar = useNavigate()
  var localizacao = useLocation()
  var destino = localizacao.state && localizacao.state.de

  var [nome, setNome] = useState('')
  var [matricula, setMatricula] = useState('')
  var [email, setEmail] = useState('')
  var [senha, setSenha] = useState('')
  var [confirmarSenha, setConfirmarSenha] = useState('')
  var [aceitouTermos, setAceitouTermos] = useState(false)
  var [erro, setErro] = useState('')
  var [carregando, setCarregando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')

    if (!/^\d{2}[12]\d{4}$/.test(matricula)) {
      setErro('Matrícula inválida. Use os 7 números da sua matrícula, por exemplo 2511483.')
      return
    }
    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres.')
      return
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }
    if (!aceitouTermos) {
      setErro('Você precisa aceitar os Termos de Uso para criar a conta.')
      return
    }

    setCarregando(true)
    try {
      await cadastrar({
        nome: nome.trim(),
        matricula: matricula,
        email: email.trim().toLowerCase(),
        senha: senha,
      })
      navegar(destino || '/minha-jornada', { replace: true })
    } catch (e) {
      setErro(e.message)
      setCarregando(false)
    }
  }

  return (
    <main className="pagina-cadastro">
      <section className="painel-cadastro">
        <Link to="/" className="marca-cadastro">
          <span className="simbolo-cadastro"></span>
          <strong>UNIFOR Exchange</strong>
        </Link>

        <div className="conteudo-painel-cadastro">
          <h2>Junte-se à comunidade de estudantes UNIFOR em intercâmbio:</h2>

          <ul className="beneficios-cadastro">
            <li>
              <span className="check-cadastro">✓</span>
              <span className="icone-beneficio"></span>
              Catálogo completo de universidades conveniadas
            </li>
            <li>
              <span className="check-cadastro">✓</span>
              <span className="icone-beneficio"></span>
              Quiz de perfil com recomendações personalizadas
            </li>
            <li>
              <span className="check-cadastro">✓</span>
              <span className="icone-beneficio"></span>
              Acompanhamento da sua jornada de intercâmbio
            </li>
            <li>
              <span className="check-cadastro">✓</span>
              <span className="icone-beneficio"></span>
              Oportunidades e editais sempre atualizados
            </li>
          </ul>
        </div>
      </section>

      <section className="formulario-cadastro">
        <div className="conteudo-formulario-cadastro">
          <h1>Crie sua conta</h1>

          <p className="subtitulo-cadastro">
            Cadastre-se com sua matrícula e seu e-mail institucional para
            começar sua jornada de intercâmbio.
          </p>

          <form onSubmit={enviar}>
            <div className="campo-cadastro">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                required
                autoComplete="name"
                placeholder="Seu nome completo"
                value={nome}
                onChange={function (evento) {
                  setNome(evento.target.value)
                }}
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="matricula">Matrícula</label>
              <input
                type="text"
                id="matricula"
                required
                inputMode="numeric"
                maxLength={7}
                placeholder="Ex.: 2511483"
                value={matricula}
                onChange={function (evento) {
                  setMatricula(evento.target.value.replace(/\D/g, ''))
                }}
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="email-cadastro">E-mail institucional</label>
              <input
                type="email"
                id="email-cadastro"
                required
                autoComplete="email"
                placeholder="seunome@edu.unifor.br"
                value={email}
                onChange={function (evento) {
                  setEmail(evento.target.value)
                }}
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="senha-cadastro">Senha</label>
              <input
                type="password"
                id="senha-cadastro"
                required
                autoComplete="new-password"
                placeholder="Crie uma senha (mínimo 4 caracteres)"
                value={senha}
                onChange={function (evento) {
                  setSenha(evento.target.value)
                }}
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="confirmar-senha">Confirmar senha</label>
              <input
                type="password"
                id="confirmar-senha"
                required
                autoComplete="new-password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={function (evento) {
                  setConfirmarSenha(evento.target.value)
                }}
              />
            </div>

            <label className="termos-cadastro">
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={function (evento) {
                  setAceitouTermos(evento.target.checked)
                }}
              />
              <span>
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </span>
            </label>

            {erro && <p className="erro-cadastro" role="alert">{erro}</p>}

            <button type="submit" className="botao-cadastro" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="ja-tem-conta">
            Já tem uma conta? <Link to="/login" state={localizacao.state}>Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Cadastro

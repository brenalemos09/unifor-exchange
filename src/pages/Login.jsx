import './Login.css'

function Login() {
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

          <form>
            <div className="campo-login">
              <label htmlFor="email">E-mail institucional</label>
              <input
                type="email"
                id="email"
                placeholder="seunome@edu.unifor.br"
              />
            </div>

            <div className="campo-login">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="recuperar-senha">
              <a href="#recuperar">Esqueceu a senha?</a>
            </div>

            <button type="submit" className="botao-login">
              Entrar
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
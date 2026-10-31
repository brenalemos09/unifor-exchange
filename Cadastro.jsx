
import './Cadastro.css'

function Cadastro() {
  return (
    <main className="pagina-cadastro">
      <section className="painel-cadastro">
        <div className="marca-cadastro">
          <span className="simbolo-cadastro"></span>
          <strong>UNIFOR Exchange</strong>
        </div>

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
            Cadastre-se com seu e-mail institucional para começar sua
            jornada de intercâmbio.
          </p>

          <form>
            <div className="campo-cadastro">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="email-cadastro">E-mail institucional</label>
              <input
                type="email"
                id="email-cadastro"
                placeholder="seunome@edu.unifor.br"
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="curso">Curso</label>
              <select id="curso" defaultValue="">
                <option value="" disabled>Selecione seu curso</option>
                <option>Ciência da Computação</option>
                <option>Administração</option>
                <option>Arquitetura e Urbanismo</option>
                <option>Direito</option>
                <option>Engenharia</option>
                <option>Psicologia</option>
                <option>Outro</option>
              </select>
            </div>

            <div className="campo-cadastro">
              <label htmlFor="senha-cadastro">Senha</label>
              <input
                type="password"
                id="senha-cadastro"
                placeholder="Crie uma senha"
              />
            </div>

            <div className="campo-cadastro">
              <label htmlFor="confirmar-senha">Confirmar senha</label>
              <input
                type="password"
                id="confirmar-senha"
                placeholder="Repita a senha"
              />
            </div>

            <label className="termos-cadastro">
              <input type="checkbox" />
              <span>
                Li e aceito os Termos de Uso e a Política de Privacidade.
              </span>
            </label>

            <button type="submit" className="botao-cadastro">
              Criar conta
            </button>
          </form>

          <p className="ja-tem-conta">
            Já tem uma conta? <a href="#login">Entrar</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Cadastro

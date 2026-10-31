
import './ResultadoQuiz.css'

function ResultadoQuiz() {
  var resultados = [
    {
      nome: 'Universidade de Lisboa',
      cidade: 'Lisboa, Portugal',
      compatibilidade: 94,
      etiquetas: ['Idioma compatível', 'Centro de pesquisa', 'Área de interesse'],
    },
    {
      nome: 'Universidade do Porto',
      cidade: 'Porto, Portugal',
      compatibilidade: 87,
      etiquetas: ['Idioma compatível', 'Experiência acadêmica'],
    },
    {
      nome: 'ISCTE — Instituto Universitário de Lisboa',
      cidade: 'Lisboa, Portugal',
      compatibilidade: 79,
      etiquetas: ['Idioma compatível', 'Custo de vida acessível'],
    },
  ]

  return (
    <>
      <header className="topo-resultado">
        <a href="/" className="marca-resultado">
          <span className="simbolo-resultado"></span>
          <strong>UNIFOR Exchange</strong>
        </a>

        <nav className="menu-resultado">
          <a href="#mapa">Mapa</a>
          <a href="#universidades">Universidades</a>
          <a href="#quiz">Quiz de Perfil</a>
          <a href="#oportunidades">Oportunidades</a>
          <a href="#jornada">Minha Jornada</a>
        </nav>

        <a href="#login" className="botao-entrar-resultado">Entrar</a>
      </header>

      <main className="pagina-resultado">
        <section className="introducao-resultado">
          <span className="etiqueta-resultado">Resultado do seu quiz de perfil</span>
          <h1>Estes são os destinos mais compatíveis com você!</h1>
          <p>
            Com base nas suas respostas, encontramos estas instituições
            que combinam com suas preferências acadêmicas e pessoais.
          </p>
        </section>

        <section className="lista-resultados">
          {resultados.map(function (universidade, indice) {
            return (
              <article className="card-resultado" key={universidade.nome}>
                <span className="posicao-resultado">{indice + 1}º</span>

                <div className="informacoes-resultado">
                  <h2>{universidade.nome}</h2>
                  <p>{universidade.cidade}</p>

                  <div className="etiquetas-resultado">
                    {universidade.etiquetas.map(function (etiqueta) {
                      return <span key={etiqueta}>{etiqueta}</span>
                    })}
                  </div>

                  <a href="#universidade">Ver universidade →</a>
                </div>

                <div className="porcentagem-resultado">
                  <strong>{universidade.compatibilidade}%</strong>
                  <span>compatibilidade</span>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="rodape-resultado">
        <p>
          UNIFOR Exchange — plataforma de apoio à orientação.
          Não substitui os processos oficiais da UNIFOR.
        </p>
        <nav>
          <a href="#perguntas">Perguntas</a>
          <a href="#contato">Contato e Suporte</a>
          <a href="#experiencias">Experiências de Estudantes</a>
        </nav>
      </footer>
    </>
  )
}

export default ResultadoQuiz

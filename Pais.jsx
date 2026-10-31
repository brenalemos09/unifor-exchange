
import './Pais.css'

function Pais() {
  var universidades = [
    {
      nome: 'Instituto Politécnico de Bragança',
      cidade: 'Bragança, Portugal',
    },
    {
      nome: 'Universidade do Minho',
      cidade: 'Braga, Portugal',
    },
    {
      nome: 'Universidade de Aveiro',
      cidade: 'Aveiro, Portugal',
    },
    {
      nome: 'Universidade de Évora',
      cidade: 'Évora, Portugal',
    },
    {
      nome: 'Instituto Universitário de Lisboa (ISCTE)',
      cidade: 'Lisboa, Portugal',
    },
    {
      nome: 'Universidade Fernando Pessoa',
      cidade: 'Porto, Portugal',
    },
  ]

  return (
    <>
      <header className="topo-pais">
        <a href="/" className="marca-pais">
          <span className="simbolo-pais"></span>
          <strong>UNIFOR Exchange</strong>
        </a>

        <nav className="menu-pais">
          <a href="#mapa">Mapa</a>
          <a href="#universidades">Universidades</a>
          <a href="#quiz">Quiz de Perfil</a>
          <a href="#oportunidades">Oportunidades</a>
          <a href="#jornada">Minha Jornada</a>
        </nav>

        <a href="#login" className="botao-entrar-pais">Entrar</a>
      </header>

      <main className="pagina-pais">
        <section className="banner-pais">
          <div className="identificacao-pais">
            <span className="bandeira-portugal"></span>
            <div>
              <h1>Portugal</h1>
              <p>Europa</p>
            </div>
          </div>

          <div className="informacoes-pais">
            <div className="info-pais">
              <span>Capital</span>
              <strong>Lisboa</strong>
            </div>

            <div className="info-pais">
              <span>Moeda</span>
              <strong>Euro</strong>
            </div>

            <div className="info-pais">
              <span>Universidades conveniadas</span>
              <strong>16</strong>
            </div>

            <div className="info-pais">
              <span>Modalidades</span>
              <strong>Semestral e Dupla titulação</strong>
            </div>
          </div>
        </section>

        <section className="lista-universidades-pais" id="universidades">
          <div className="titulo-universidades-pais">
            <h2>Universidades conveniadas em Portugal</h2>
            <p>
              Conheça as instituições parceiras e encontre a melhor opção
              para sua jornada acadêmica.
            </p>
          </div>

          <div className="grade-universidades-pais">
            {universidades.map(function (universidade) {
              return (
                <article className="card-universidade-pais" key={universidade.nome}>
                  <div className="imagem-universidade-pais">
                    <span className="simbolo-universidade-pais"></span>
                    <span className="localizacao-universidade-pais">⌖</span>
                  </div>

                  <div className="conteudo-card-pais">
                    <h3>{universidade.nome}</h3>
                    <p>{universidade.cidade}</p>

                    <div className="etiquetas-universidade-pais">
                      <span>Presencial</span>
                      <span>Dupla titulação</span>
                    </div>

                    <a href="#detalhes">Ver detalhes →</a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="rodape-pais">
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

export default Pais

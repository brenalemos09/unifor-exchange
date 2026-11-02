import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Pais.css'

function Pais() {
  var navegar = useNavigate()
  var { nomePais } = useParams()

  var paises = {
    portugal: {
      nome: 'Portugal',
      regiao: 'Europa',
      capital: 'Lisboa',
      moeda: 'Euro',
      quantidade: 16,
      modalidades: 'Semestral e Dupla titulação',
      bandeira: 'bandeira-portugal',
    },
    franca: {
      nome: 'França',
      regiao: 'Europa',
      capital: 'Paris',
      moeda: 'Euro',
      quantidade: 8,
      modalidades: 'Semestral',
      bandeira: 'bandeira-franca',
    },
    irlanda: {
      nome: 'Irlanda',
      regiao: 'Europa',
      capital: 'Dublin',
      moeda: 'Euro',
      quantidade: 5,
      modalidades: 'Semestral',
      bandeira: 'bandeira-irlanda',
    },
    belgica: {
      nome: 'Bélgica',
      regiao: 'Europa',
      capital: 'Bruxelas',
      moeda: 'Euro',
      quantidade: 6,
      modalidades: 'Semestral',
      bandeira: 'bandeira-belgica',
    },
  }

  var pais = paises[nomePais] || paises.portugal

  var universidades = {
    portugal: [
      { nome: 'Instituto Politécnico de Bragança', cidade: 'Bragança, Portugal' },
      { nome: 'Universidade do Minho', cidade: 'Braga, Portugal' },
      { nome: 'Universidade de Aveiro', cidade: 'Aveiro, Portugal' },
      { nome: 'Universidade de Évora', cidade: 'Évora, Portugal' },
      { nome: 'Instituto Universitário de Lisboa (ISCTE)', cidade: 'Lisboa, Portugal' },
      { nome: 'Universidade Fernando Pessoa', cidade: 'Porto, Portugal' },
    ],
    franca: [
      { nome: 'Universidade de Paris', cidade: 'Paris, França' },
      { nome: 'Universidade de Lyon', cidade: 'Lyon, França' },
      { nome: 'Universidade de Bordeaux', cidade: 'Bordeaux, França' },
    ],
    irlanda: [
      { nome: 'Trinity College Dublin', cidade: 'Dublin, Irlanda' },
      { nome: 'University College Dublin', cidade: 'Dublin, Irlanda' },
      { nome: 'University of Galway', cidade: 'Galway, Irlanda' },
    ],
    belgica: [
      { nome: 'KU Leuven', cidade: 'Leuven, Bélgica' },
      { nome: 'Ghent University', cidade: 'Gante, Bélgica' },
      { nome: 'Université libre de Bruxelles', cidade: 'Bruxelas, Bélgica' },
    ],
  }

  var listaUniversidades = universidades[nomePais] || universidades.portugal

  return (
    <>
      <Header />

      <main className="pagina-pais">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar"
        >
          ←
        </button>
        <section className="banner-pais">
          <div className="identificacao-pais">
            <span className={pais.bandeira}></span>
            <div>
              <h1>{pais.nome}</h1>
              <p>{pais.regiao}</p>
            </div>
          </div>

          <div className="informacoes-pais">
            <div className="info-pais">
              <span>Capital</span>
              <strong>{pais.capital}</strong>
            </div>

            <div className="info-pais">
              <span>Moeda</span>
              <strong>{pais.moeda}</strong>
            </div>

            <div className="info-pais">
              <span>Universidades conveniadas</span>
              <strong>{pais.quantidade}</strong>
            </div>

            <div className="info-pais">
              <span>Modalidades</span>
              <strong>{pais.modalidades}</strong>
            </div>
          </div>
        </section>

        <section className="lista-universidades-pais" id="universidades">
          <div className="titulo-universidades-pais">
            <h2>Universidades conveniadas em {pais.nome}</h2>
            <p>
              Conheça as instituições parceiras e encontre a melhor opção
              para sua jornada acadêmica.
            </p>
          </div>

          <div className="grade-universidades-pais">
            {listaUniversidades.map(function (universidade) {
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

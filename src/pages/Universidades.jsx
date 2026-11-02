import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import { obterFavoritos, alternarFavorito } from '../utils/favoritos'
import './Universidades.css'

function Universidades() {
  var navegar = useNavigate()
  var universidades = [
    {
      nome: 'Berlin School of Economics and Law',
      cidade: 'Berlin, Alemanha',
      etiquetas: ['Presencial', 'Inglês'],
      slug: 'berlin-school',
    },
    {
      nome: 'Universidad de Santiago de Compostela',
      cidade: 'Santiago de Compostela, Espanha',
      etiquetas: ['Presencial', 'Espanhol'],
      slug: 'santiago-compostela',
    },
    {
      nome: 'Université de Rouen',
      cidade: 'Rouen, França',
      etiquetas: ['Presencial', 'Francês'],
      slug: 'universite-rouen',
    },
    {
      nome: 'Xiamen University',
      cidade: 'Xiamen, China',
      etiquetas: ['Presencial', 'Inglês'],
      slug: 'xiamen-university',
    },
    {
      nome: 'Universidade do Minho',
      cidade: 'Braga, Portugal',
      etiquetas: ['Presencial', 'Português'],
      slug: 'universidade-minho',
    },
    {
      nome: 'Ben-Gurion University of the Negev',
      cidade: 'Beer-Sheva, Israel',
      etiquetas: ['Presencial', 'Inglês'],
      slug: 'ben-gurion',
    },
    {
      nome: 'Universidad Diego Portales',
      cidade: 'Santiago, Chile',
      etiquetas: ['Presencial', 'Espanhol'],
      slug: 'diego-portales',
    },
    {
      nome: 'Rotterdam University of Applied Sciences',
      cidade: 'Rotterdam, Holanda',
      etiquetas: ['Presencial', 'Inglês'],
      slug: 'rotterdam-university',
    },
    {
      nome: 'Kyonggi University',
      cidade: 'Suwon, Coreia do Sul',
      etiquetas: ['Presencial', 'Inglês'],
      slug: 'kyonggi-university',
    },
  ]

  var [favoritos, setFavoritos] = useState(obterFavoritos())

  function clicarFavorito(universidade) {
    var atualizados = alternarFavorito(universidade)
    setFavoritos(atualizados)
  }

  var [busca, setBusca] = useState('')
  var [pais, setPais] = useState('')
  var [curso, setCurso] = useState('')
  var [idioma, setIdioma] = useState('')
  var [modalidade, setModalidade] = useState('')

  var universidadesFiltradas = universidades.filter(function (universidade) {
    var texto = (universidade.nome + ' ' + universidade.cidade).toLowerCase()

    var correspondeBusca = texto.includes(busca.toLowerCase())
    var correspondePais = !pais || universidade.cidade.includes(pais)
    var correspondeIdioma =
      !idioma || universidade.etiquetas.includes(idioma)

    return correspondeBusca && correspondePais && correspondeIdioma
  })

  return (
    <>
      <Header />

      <main className="pagina-catalogo">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar"
        >
          ←
        </button>
        <section className="busca-catalogo">
          <div className="introducao-catalogo">
            <h1>Catálogo de Universidades</h1>
            <p>
              Pesquise e filtre instituições conveniadas por país,
              curso, idioma e modalidade.
            </p>
          </div>

          <div className="campo-busca-catalogo">
            <input
              type="text"
              placeholder="Buscar por nome da universidade, país ou cidade..."
              value={busca}
              onChange={function (evento) {
                setBusca(evento.target.value)
              }}
            />
            <span>⌕</span>
          </div>

          <div className="filtros-catalogo">
            <select value={pais} onChange={function (evento) {
              setPais(evento.target.value)
            }}>
              <option value="">País</option>
              <option value="Alemanha">Alemanha</option>
              <option value="Espanha">Espanha</option>
              <option value="França">França</option>
              <option value="China">China</option>
              <option value="Portugal">Portugal</option>
              <option value="Israel">Israel</option>
              <option value="Chile">Chile</option>
              <option value="Holanda">Holanda</option>
              <option value="Coreia do Sul">Coreia do Sul</option>
            </select>

            <select value={curso} onChange={function (evento) {
              setCurso(evento.target.value)
            }}>
              <option value="">Curso ou Área</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Negócios">Negócios</option>
              <option value="Engenharia">Engenharia</option>
              <option value="Humanas">Humanas</option>
            </select>

            <select value={idioma} onChange={function (evento) {
              setIdioma(evento.target.value)
            }}>
              <option value="">Idioma</option>
              <option value="Português">Português</option>
              <option value="Inglês">Inglês</option>
              <option value="Espanhol">Espanhol</option>
              <option value="Francês">Francês</option>
            </select>

            <select value={modalidade} onChange={function (evento) {
              setModalidade(evento.target.value)
            }}>
              <option value="">Modalidade</option>
              <option value="Presencial">Presencial</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
        </section>

        <section className="resultados-catalogo" id="universidades">
          <div className="grade-catalogo">
            {universidadesFiltradas.map(function (universidade) {
              return (
                <article className="card-catalogo" key={universidade.nome}>
                  <div className="imagem-card-catalogo">
                    <span className="simbolo-card-catalogo"></span>
                    <button
                      type="button"
                      className="favorito-catalogo"
                      aria-label={
                        favoritos.some(function (item) {
                          return item.slug === universidade.slug
                        })
                          ? 'Remover dos favoritos'
                          : 'Adicionar aos favoritos'
                      }
                      onClick={function () {
                        clicarFavorito(universidade)
                      }}
                    >
                      {favoritos.some(function (item) {
                        return item.slug === universidade.slug
                      })
                        ? '♥'
                        : '♡'}
                    </button>
                  </div>

                  <div className="conteudo-card-catalogo">
                    <h2>{universidade.nome}</h2>
                    <p>{universidade.cidade}</p>

                    <div className="etiquetas-catalogo">
                      {universidade.etiquetas.map(function (etiqueta) {
                        return <span key={etiqueta}>{etiqueta}</span>
                      })}
                    </div>

                    <Link to={`/universidades/${universidade.slug}`}>
                      Ver detalhes →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {universidadesFiltradas.length === 0 && (
            <p className="sem-resultados">
              Nenhuma universidade encontrada.
            </p>
          )}
        </section>
      </main>

      <footer className="rodape-catalogo">
        <p>
          UNIFOR Exchange — plataforma de apoio à orientação.
          Não substitui os processos oficiais da UNIFOR.
        </p>

        <nav>
          <Link to="/quiz">Perguntas</Link>
          <Link to="/minha-jornada">Contato e Suporte</Link>
          <Link to="/oportunidades">Experiências de Estudantes</Link>
        </nav>
      </footer>
    </>
  )
}

export default Universidades

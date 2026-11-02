import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { obterFavoritos, alternarFavorito } from '../utils/favoritos'
import { listarUniversidades, listarFiltros } from '../services/api'
import './Universidades.css'

function Universidades() {
  var navegar = useNavigate()
  var [universidades, setUniversidades] = useState([])
  var [opcoes, setOpcoes] = useState({ paises: [], idiomas: [], modalidades: [], cursos: [] })
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  // Carrega as opções dos filtros uma vez
  useEffect(function () {
    listarFiltros()
      .then(setOpcoes)
      .catch(function (e) {
        setErro(e.message)
      })
  }, [])

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

  // Busca na API sempre que um filtro muda
  useEffect(function () {
    var cancelado = false
    setCarregando(true)
    var espera = setTimeout(function () {
      listarUniversidades({
        busca: busca,
        pais: pais,
        curso: curso,
        idioma: idioma,
        modalidade: modalidade,
      })
        .then(function (lista) {
          if (cancelado) return
          setUniversidades(lista)
          setErro('')
          setCarregando(false)
        })
        .catch(function (e) {
          if (cancelado) return
          setErro(e.message)
          setCarregando(false)
        })
    }, 250)
    return function () {
      cancelado = true
      clearTimeout(espera)
    }
  }, [busca, pais, curso, idioma, modalidade])

  var universidadesFiltradas = universidades

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
              placeholder="Buscar por nome da universidade..."
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
              {opcoes.paises.map(function (item) {
                return <option key={item.nome} value={item.nome}>{item.nome}</option>
              })}
            </select>

            <select value={curso} onChange={function (evento) {
              setCurso(evento.target.value)
            }}>
              <option value="">Curso ou Área</option>
              {opcoes.cursos.map(function (item) {
                return <option key={item.id_curso} value={item.id_curso}>{item.nome}</option>
              })}
            </select>

            <select value={idioma} onChange={function (evento) {
              setIdioma(evento.target.value)
            }}>
              <option value="">Idioma</option>
              {opcoes.idiomas.map(function (item) {
                return <option key={item.id_idioma} value={item.id_idioma}>{item.nome}</option>
              })}
            </select>

            <select value={modalidade} onChange={function (evento) {
              setModalidade(evento.target.value)
            }}>
              <option value="">Modalidade</option>
              {opcoes.modalidades.map(function (item) {
                return <option key={item.id_modalidade} value={item.id_modalidade}>{item.tipo}</option>
              })}
            </select>
          </div>
        </section>

        <section className="resultados-catalogo" id="universidades">
          <div className="grade-catalogo">
            {universidadesFiltradas.map(function (u) {
              var universidade = {
                slug: String(u.id_universidade),
                nome: u.nome,
                cidade: u.cidade + ', ' + u.pais,
                etiquetas: u.modalidades.concat(u.idiomas),
              }
              return (
                <article className="card-catalogo" key={u.id_universidade}>
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

          {erro && <p className="sem-resultados" role="alert">{erro}</p>}

          {carregando && !erro && <p className="sem-resultados">Carregando...</p>}

          {!carregando && !erro && universidadesFiltradas.length === 0 && (
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

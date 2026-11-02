import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { buscarPais } from '../services/api'
import './Pais.css'

// bandeiras desenhadas em CSS (Pais.css); os outros países usam um símbolo genérico
var BANDEIRAS = ['portugal', 'franca', 'irlanda', 'belgica']

function semAcento(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// junta os valores sem repetir (ex.: idiomas de todas as universidades do país)
function juntarSemRepetir(universidades, campo) {
  var lista = []
  universidades.forEach(function (u) {
    u[campo].forEach(function (valor) {
      if (!lista.includes(valor)) lista.push(valor)
    })
  })
  return lista
}

function Pais() {
  var navegar = useNavigate()
  var { nomePais } = useParams()
  var [pais, setPais] = useState(null)
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    setCarregando(true)
    setErro('')
    buscarPais(nomePais)
      .then(function (dados) {
        setPais(dados)
        setCarregando(false)
      })
      .catch(function (e) {
        setPais(null)
        setErro(e.message)
        setCarregando(false)
      })
  }, [nomePais])

  if (carregando || !pais) {
    return (
      <>
        <Header />
        <main className="pagina-pais">
          <section className="lista-universidades-pais">
            {carregando ? (
              <p className="aviso-pais">Carregando país...</p>
            ) : (
              <div className="aviso-pais">
                <h1>{erro || 'País não encontrado.'}</h1>
                <Link to="/mapa">Voltar ao mapa</Link>
              </div>
            )}
          </section>
        </main>
      </>
    )
  }

  var slug = semAcento(pais.nome)
  var classeBandeira = BANDEIRAS.includes(slug) ? 'bandeira-' + slug : 'bandeira-generica'
  var idiomas = juntarSemRepetir(pais.universidades, 'idiomas')
  var modalidades = juntarSemRepetir(pais.universidades, 'modalidades')

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
            <span className={classeBandeira} aria-hidden="true"></span>
            <div>
              <h1>{pais.nome}</h1>
              <p>{pais.nome_oficial}</p>
            </div>
          </div>

          {pais.descricao && <p className="descricao-pais">{pais.descricao}</p>}

          <div className="informacoes-pais">
            <div className="info-pais">
              <span>Continente</span>
              <strong>{pais.continente}</strong>
            </div>

            <div className="info-pais">
              <span>Universidades conveniadas</span>
              <strong>{pais.universidades.length}</strong>
            </div>

            <div className="info-pais">
              <span>Idiomas</span>
              <strong>{idiomas.join(', ') || 'A consultar'}</strong>
            </div>

            <div className="info-pais">
              <span>Modalidades</span>
              <strong>{modalidades.join(', ') || 'A consultar'}</strong>
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

          {pais.universidades.length === 0 ? (
            <p className="aviso-pais">
              Ainda não há universidades conveniadas cadastradas neste país.
            </p>
          ) : (
            <div className="grade-universidades-pais">
              {pais.universidades.map(function (universidade) {
                return (
                  <article className="card-universidade-pais" key={universidade.id_universidade}>
                    <div className="imagem-universidade-pais">
                      <span className="simbolo-universidade-pais"></span>
                      <span className="localizacao-universidade-pais">⌖</span>
                    </div>

                    <div className="conteudo-card-pais">
                      <h3>{universidade.nome}</h3>
                      <p>{universidade.cidade}, {universidade.pais}</p>

                      <div className="etiquetas-universidade-pais">
                        {universidade.modalidades.concat(universidade.idiomas).map(function (etiqueta) {
                          return <span key={etiqueta}>{etiqueta}</span>
                        })}
                      </div>

                      <Link to={'/universidades/' + universidade.id_universidade}>
                        Ver detalhes →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
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

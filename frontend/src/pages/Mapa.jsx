import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { listarPaises } from '../services/api'
import { coordenadasDoPais } from '../utils/coordenadas'
import './Mapa.css'

function Mapa() {
  var navegar = useNavigate()
  var [paises, setPaises] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    listarPaises()
      .then(function (lista) {
        setPaises(lista)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  function abrirPais(nome) {
    navegar('/pais/' + encodeURIComponent(nome))
  }

  // só entram no mapa os países com universidade e com posição conhecida
  var paisesNoMapa = paises.filter(function (pais) {
    return pais.total_universidades > 0 && coordenadasDoPais(pais.nome)
  })

  return (
    <>
      <Header />

      <main className="pagina-mapa">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar"
        >
          ←
        </button>
        <section className="introducao-mapa">
          <h1>Explore os destinos no mapa interativo</h1>

          <p>
            Passe o mouse (ou toque) sobre um país para ver quantas universidades
            conveniadas ele tem, e clique para conhecer os destinos.
          </p>
        </section>

        {erro && <p className="aviso-mapa" role="alert">{erro}</p>}
        {carregando && <p className="aviso-mapa">Carregando países...</p>}

        <section className="area-mapa">
          <MapContainer
            center={[25, 0]}
            zoom={2}
            minZoom={1}
            scrollWheelZoom={false}
            className="mapa-interativo"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CircleMarker
              center={coordenadasDoPais('Brasil')}
              radius={7}
              pathOptions={{ color: '#fba234', fillColor: '#fba234', fillOpacity: 0.9 }}
            >
              <Tooltip>Você está aqui (Brasil)</Tooltip>
            </CircleMarker>

            {paisesNoMapa.map(function (pais) {
              return (
                <CircleMarker
                  key={pais.nome_oficial}
                  center={coordenadasDoPais(pais.nome)}
                  radius={7 + pais.total_universidades * 2}
                  pathOptions={{ color: '#004af7', fillColor: '#004af7', fillOpacity: 0.65 }}
                  eventHandlers={{
                    click: function () {
                      abrirPais(pais.nome)
                    },
                  }}
                >
                  <Tooltip>
                    <strong>{pais.nome}</strong>
                    <br />
                    {pais.total_universidades}{' '}
                    {pais.total_universidades === 1 ? 'universidade conveniada' : 'universidades conveniadas'}
                  </Tooltip>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </section>

        <section className="legenda-mapa">
          <span><span className="ponto-legenda ponto-azul"></span> Países com universidades conveniadas</span>
          <span><span className="ponto-legenda ponto-laranja"></span> Você está aqui (Brasil)</span>
        </section>

        {!carregando && !erro && (
          <section className="lista-paises-mapa">
            <h2>Todos os países</h2>
            {paises.length === 0 ? (
              <p className="aviso-mapa">Nenhum país cadastrado ainda.</p>
            ) : (
              <div className="grade-paises-mapa">
                {paises.map(function (pais) {
                  return (
                    <Link key={pais.nome_oficial} to={'/pais/' + encodeURIComponent(pais.nome)} className="card-pais-mapa">
                      <strong>{pais.nome}</strong>
                      <span>{pais.continente}</span>
                      <span>
                        {pais.total_universidades}{' '}
                        {pais.total_universidades === 1 ? 'universidade' : 'universidades'}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        )}

        <section className="continue-explorando">
          <h2>Continue explorando</h2>

          <div className="cards-exploracao">
            <div className="card-exploracao">
              <h3>Quiz de Perfil</h3>
              <p>
                Responda algumas perguntas e descubra destinos compatíveis
                com seu perfil.
              </p>
              <Link to="/quiz">Fazer o quiz →</Link>
            </div>

            <div className="card-exploracao">
              <h3>Catálogo de Universidades</h3>
              <p>
                Pesquise instituições por país, curso, idioma e modalidade.
              </p>
              <Link to="/universidades">Ver universidades →</Link>
            </div>

            <div className="card-exploracao">
              <h3>Oportunidades Abertas</h3>
              <p>
                Confira intercâmbios, editais e programas com inscrições abertas.
              </p>
              <Link to="/oportunidades">Ver oportunidades →</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Mapa


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Mapa.css'

function Mapa() {
  var destinos = [
    {
      nome: 'Portugal',
      posicao: [39.3999, -8.2245],
      universidades: 12,
    },
    {
      nome: 'França',
      posicao: [46.2276, 2.2137],
      universidades: 8,
    },
    {
      nome: 'Irlanda',
      posicao: [53.1424, -7.6921],
      universidades: 5,
    },
    {
      nome: 'Bélgica',
      posicao: [50.5039, 4.4699],
      universidades: 6,
    },
  ]

  return (
    <main className="pagina-mapa">
      <section className="introducao-mapa">
        <h1>Explore os destinos no mapa interativo</h1>

        <p>
          Passe o mouse sobre um país para conhecer os destinos
          disponíveis e descobrir universidades conveniadas.
        </p>
      </section>

      <section className="area-mapa">
        <MapContainer
          center={[25, 0]}
          zoom={2}
          scrollWheelZoom={false}
          className="mapa-interativo"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {destinos.map(function (destino) {
            return (
              <Marker key={destino.nome} position={destino.posicao}>
                <Popup>
                  <strong>{destino.nome}</strong>
                  <br />
                  {destino.universidades} universidades conveniadas
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </section>

      <section className="legenda-mapa">
        <span>🔵 Países com universidades conveniadas</span>
        <span>🟠 Você está aqui (Brasil)</span>
      </section>

      <section className="continue-explorando">
        <h2>Continue explorando</h2>

        <div className="cards-exploracao">
          <div className="card-exploracao">
            <h3>Quiz de Perfil</h3>
            <p>Responda algumas perguntas e descubra destinos compatíveis com seu perfil.</p>
            <a href="#quiz">Fazer o quiz →</a>
          </div>

          <div className="card-exploracao">
            <h3>Catálogo de Universidades</h3>
            <p>Pesquise instituições por país, curso, idioma e modalidade.</p>
            <a href="#universidades">Ver universidades →</a>
          </div>

          <div className="card-exploracao">
            <h3>Oportunidades Abertas</h3>
            <p>Confira intercâmbios, editais e programas com inscrições abertas.</p>
            <a href="#oportunidades">Ver oportunidades →</a>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Mapa

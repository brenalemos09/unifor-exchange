
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import './Home.css'

function Home() {
  return (
    <div className="home-original">
      <Header />

      <main>
        <section className="home-banner">
          <div className="home-flags">
            <span className="flag flag-portugal"></span>
            <span className="flag flag-france"></span>
            <span className="flag flag-italy"></span>
            <span className="flag flag-germany"></span>
            <span className="flag flag-ireland"></span>
          </div>

          <h1>
            Descubra o seu intercâmbio ideal com
            <br />
            o UNIFOR Exchange
          </h1>

          <p>
            Explore universidades conveniadas, oportunidades de mobilidade acadêmica e{' '}
            <br className="desktop-break" />
            descubra o destino mais compatível com o seu perfil — tudo em um só lugar.
          </p>

          <div className="home-actions">
            <Link to="/mapa" className="home-action-primary">
              Explorar destinos no mapa
            </Link>

            <Link to="/quiz" className="home-action-secondary">
              Fazer o quiz de perfil
            </Link>
          </div>
        </section>

        <section className="home-stats">
          <div className="home-stat">
            <strong>140+</strong>
            <span>Instituições parceiras</span>
          </div>

          <div className="home-stat">
            <strong>30</strong>
            <span>Países com convênio ativo</span>
          </div>

          <div className="home-stat">
            <strong>120</strong>
            <span>Alunos da UNIFOR em<br /> intercâmbio por ano</span>
          </div>

          <div className="home-stat">
            <strong>15</strong>
            <span>Programas de dupla titulação</span>
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  )
}

export default Home

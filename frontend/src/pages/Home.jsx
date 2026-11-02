
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-original">
      <header className="home-header">
        <Link to="/" className="home-logo">
          <span className="home-logo-circle"></span>
          <strong>UNIFOR Exchange</strong>
        </Link>

        <nav className="home-nav">
          <Link to="/mapa">Mapa</Link>
          <Link to="/universidades">Universidades</Link>
          <Link to="/quiz">Quiz de Perfil</Link>
          <Link to="/oportunidades">Oportunidades</Link>
          <Link to="/minha-jornada">Minha Jornada</Link>
        </nav>

        <Link to="/login" className="home-login">Entrar</Link>
      </header>

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
            Explore universidades conveniadas, oportunidades de mobilidade acadêmica e
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
    </div>
  )
}

export default Home

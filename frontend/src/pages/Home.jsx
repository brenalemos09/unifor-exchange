
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  listarUniversidades,
  listarPaises,
  listarOportunidades,
  listarRelatos,
} from '../services/api'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import './Home.css'

function Home() {
  // números reais vindos do banco (null = ainda carregando ou API fora do ar)
  var [numeros, setNumeros] = useState({
    universidades: null,
    paises: null,
    oportunidades: null,
    relatos: null,
  })

  useEffect(function () {
    var ativo = true
    function contar(promessa) {
      return promessa.then(
        function (lista) {
          return Array.isArray(lista) ? lista.length : null
        },
        function () {
          return null
        }
      )
    }
    Promise.all([
      contar(listarUniversidades()),
      contar(listarPaises()),
      contar(listarOportunidades()),
      contar(listarRelatos()),
    ]).then(function (r) {
      if (ativo) {
        setNumeros({ universidades: r[0], paises: r[1], oportunidades: r[2], relatos: r[3] })
      }
    })
    return function () {
      ativo = false
    }
  }, [])

  function mostrar(valor) {
    return valor === null ? '—' : valor
  }

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
            <strong>{mostrar(numeros.universidades)}</strong>
            <span>Universidades parceiras</span>
          </div>

          <div className="home-stat">
            <strong>{mostrar(numeros.paises)}</strong>
            <span>Países de destino</span>
          </div>

          <div className="home-stat">
            <strong>{mostrar(numeros.oportunidades)}</strong>
            <span>Oportunidades cadastradas</span>
          </div>

          <div className="home-stat">
            <strong>{mostrar(numeros.relatos)}</strong>
            <span>Experiências de estudantes</span>
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  )
}

export default Home

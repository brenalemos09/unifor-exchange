import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import AdminUniversidades from '../components/admin/AdminUniversidades'
import AdminPaises from '../components/admin/AdminPaises'
import AdminOportunidades from '../components/admin/AdminOportunidades'
import AdminConteudo from '../components/admin/AdminConteudo'
import { ehAdministrador } from '../services/api'
import './Administrativo.css'

var SECOES = ['Universidades', 'Países', 'Oportunidades', 'Conteúdo institucional']

function Administrativo() {
  var navegar = useNavigate()
  var [secao, setSecao] = useState('Universidades')

  if (!ehAdministrador()) {
    return (
      <main className="pagina-administrativo">
        <Header />
        <div className="conteudo-administrativo">
          <section className="area-administrativa">
            <h1>Área restrita</h1>
            <p>Esta área é exclusiva para administradores.</p>
            <Link to="/login">Entrar como administrador</Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-administrativo">
      <Header />
      <button
        className="botao-voltar"
        onClick={function () {
          navegar(-1)
        }}
        aria-label="Voltar"
      >
        ←
      </button>

      <div className="conteudo-administrativo">
        <aside className="menu-administrativo">
          <nav aria-label="Seções da administração">
            {SECOES.map(function (item) {
              return (
                <button
                  type="button"
                  key={item}
                  aria-current={secao === item ? 'page' : undefined}
                  className={secao === item ? 'item-menu-admin ativo' : 'item-menu-admin'}
                  onClick={function () {
                    setSecao(item)
                  }}
                >
                  {item}
                </button>
              )
            })}
          </nav>
          <p className="dica-menu-admin">
            Relatos de estudantes são moderados na própria tela de{' '}
            <Link to="/relatos">Experiências</Link>.
          </p>
        </aside>

        <section className="area-administrativa">
          {secao === 'Universidades' && <AdminUniversidades />}
          {secao === 'Países' && <AdminPaises />}
          {secao === 'Oportunidades' && <AdminOportunidades />}
          {secao === 'Conteúdo institucional' && <AdminConteudo />}
        </section>
      </div>
    </main>
  )
}

export default Administrativo

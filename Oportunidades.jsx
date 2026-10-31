
import { useState } from 'react'
import './Oportunidades.css'

function Oportunidades() {
  var oportunidades = [
    {
      categoria: 'INTERCÂMBIO',
      tipo: 'Intercâmbio',
      titulo: 'Programa de Mobilidade Acadêmica — 2027.1',
      descricao: 'Experiência acadêmica internacional em universidade parceira.',
      status: 'Inscrições abertas',
      aberto: true,
    },
    {
      categoria: 'BUDDY PROGRAM',
      tipo: 'Buddy Program',
      titulo: 'Buddy Program 2026.2 — Conectando estudantes estrangeiros na UNIFOR',
      descricao: 'Participe da integração e acolhimento de estudantes internacionais.',
      status: 'Inscrições abertas',
      aberto: true,
    },
    {
      categoria: 'DUPLA TITULAÇÃO',
      tipo: 'Dupla titulação',
      titulo: 'Dupla titulação internacional',
      descricao: 'Instituição parceira: Universidade de Lisboa (ISCTE).',
      status: 'Em breve',
      aberto: false,
    },
    {
      categoria: 'ESTÁGIO EUA',
      tipo: 'Estágio EUA',
      titulo: 'Orientação para estágio em universidades dos Estados Unidos',
      descricao: 'Oportunidade de experiência acadêmica e profissional internacional.',
      status: 'Inscrições abertas',
      aberto: true,
    },
  ]

  var filtros = [
    'Todos',
    'Intercâmbio',
    'Dupla titulação',
    'Buddy Program',
    'Estágio EUA',
    'TOP Espanha',
  ]

  var [filtroAtivo, setFiltroAtivo] = useState('Todos')

  var oportunidadesFiltradas = oportunidades.filter(function (oportunidade) {
    return filtroAtivo === 'Todos' || oportunidade.tipo === filtroAtivo
  })

  return (
    <>
      <header className="topo-oportunidades">
        <a href="/" className="marca-oportunidades">
          <span className="simbolo-oportunidades"></span>
          <strong>UNIFOR Exchange</strong>
        </a>

        <nav className="menu-oportunidades">
          <a href="#mapa">Mapa</a>
          <a href="#universidades">Universidades</a>
          <a href="#quiz">Quiz de Perfil</a>
          <a href="#oportunidades">Oportunidades</a>
          <a href="#jornada">Minha Jornada</a>
        </nav>

        <a href="#login" className="botao-entrar-oportunidades">Entrar</a>
      </header>

      <main className="pagina-oportunidades">
        <section className="cabecalho-oportunidades">
          <h1>Oportunidades Abertas</h1>
          <p>
            Confira oportunidades, editais e programas com inscrições em andamento.
          </p>

          <div className="filtros-oportunidades">
            {filtros.map(function (filtro) {
              return (
                <button
                  type="button"
                  key={filtro}
                  className={
                    filtroAtivo === filtro
                      ? 'filtro-oportunidade ativo'
                      : 'filtro-oportunidade'
                  }
                  onClick={function () {
                    setFiltroAtivo(filtro)
                  }}
                >
                  {filtro}
                </button>
              )
            })}
          </div>
        </section>

        <section className="lista-oportunidades">
          {oportunidadesFiltradas.length > 0 ? (
            oportunidadesFiltradas.map(function (oportunidade) {
              return (
                <article className="card-oportunidade" key={oportunidade.categoria}>
                  <div className="texto-oportunidade">
                    <span className="categoria-oportunidade">
                      {oportunidade.categoria}
                    </span>
                    <h2>{oportunidade.titulo}</h2>
                    <p>{oportunidade.descricao}</p>
                  </div>

                  <span
                    className={
                      oportunidade.aberto
                        ? 'status-oportunidade aberto'
                        : 'status-oportunidade em-breve'
                    }
                  >
                    {oportunidade.status}
                  </span>
                </article>
              )
            })
          ) : (
            <p className="sem-oportunidades">
              Nenhuma oportunidade encontrada nesta categoria.
            </p>
          )}
        </section>
      </main>

      <footer className="rodape-oportunidades">
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

export default Oportunidades


import { useState } from 'react'
import './MinhaJornada.css'

function MinhaJornada() {
  var universidades = [
    {
      nome: 'Universidade de Lisboa',
      cidade: 'Lisboa, Portugal',
    },
    {
      nome: 'Sorbonne Université',
      cidade: 'Paris, França',
    },
    {
      nome: 'University of Toronto',
      cidade: 'Toronto, Canadá',
    },
  ]

  var etapas = [
    'Passaporte válido emitido',
    'Cópia do histórico escolar',
    'Comprovante de proficiência no idioma',
    'Carta de motivação enviada',
  ]

  var [concluidas, setConcluidas] = useState([true, true, false, false])

  function alterarEtapa(indice) {
    var novasEtapas = [...concluidas]
    novasEtapas[indice] = !novasEtapas[indice]
    setConcluidas(novasEtapas)
  }

  return (
    <>
      <header className="topo-jornada">
        <a href="/" className="marca-jornada">
          <span className="simbolo-jornada"></span>
          <strong>UNIFOR Exchange</strong>
        </a>

        <nav className="menu-jornada">
          <a href="#mapa">Mapa</a>
          <a href="#universidades">Universidades</a>
          <a href="#quiz">Quiz de Perfil</a>
          <a href="#oportunidades">Oportunidades</a>
          <a href="#jornada">Minha Jornada</a>
        </nav>

        <a href="#login" className="botao-entrar-jornada">Entrar</a>
      </header>

      <main className="pagina-jornada">
        <section className="boas-vindas-jornada">
          <div className="avatar-jornada">M</div>
          <div>
            <h1>Olá, Maria!</h1>
            <p>Acompanhe sua jornada de intercâmbio</p>
          </div>
        </section>

        <section className="favoritas-jornada">
          <h2>Suas universidades favoritas</h2>

          <div className="grade-favoritas">
            {universidades.map(function (universidade) {
              return (
                <article className="card-favorita" key={universidade.nome}>
                  <div className="imagem-favorita">
                    <span className="icone-favorita">♡</span>
                  </div>

                  <div className="conteudo-favorita">
                    <h3>{universidade.nome}</h3>
                    <p>{universidade.cidade}</p>

                    <div className="etiquetas-favorita">
                      <span>Presencial</span>
                      <span>Intercâmbio</span>
                    </div>

                    <a href="#detalhes">Ver detalhes →</a>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="resumo-jornada">
          <article className="resultado-perfil-jornada">
            <h2>Resultado do seu quiz de perfil</h2>

            <div className="resultado-perfil-conteudo">
              <div>
                <strong>Universidade de Lisboa</strong>
                <p>Maior compatibilidade com seu perfil</p>
                <a href="#resultado">Ver todas as recomendações →</a>
              </div>

              <strong className="porcentagem-jornada">94%</strong>
            </div>
          </article>

          <article className="checklist-jornada">
            <h2>Sua jornada de intercâmbio</h2>

            <div className="lista-etapas-jornada">
              {etapas.map(function (etapa, indice) {
                return (
                  <label className="item-etapa-jornada" key={etapa}>
                    <input
                      type="checkbox"
                      checked={concluidas[indice]}
                      onChange={function () {
                        alterarEtapa(indice)
                      }}
                    />
                    <span>{etapa}</span>
                  </label>
                )
              })}
            </div>
          </article>
        </section>
      </main>

      <footer className="rodape-jornada">
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

export default MinhaJornada

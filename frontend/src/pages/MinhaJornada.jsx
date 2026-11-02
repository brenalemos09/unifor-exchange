import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { obterFavoritos } from '../utils/favoritos'
import './MinhaJornada.css'

function MinhaJornada() {
  var navegar = useNavigate()
  var universidades = obterFavoritos()
  var resultadosQuiz = JSON.parse(localStorage.getItem('resultadoQuiz') || '[]')
  var melhorResultado = resultadosQuiz[0]

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
      <Header />

      <main className="pagina-jornada">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar"
        >
          ←
        </button>
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
            {universidades.length > 0 ? (
              universidades.map(function (universidade) {
                return (
                  <article className="card-favorita" key={universidade.slug}>
                    <div className="imagem-favorita">
                      <span className="icone-favorita">♥</span>
                    </div>

                    <div className="conteudo-favorita">
                      <h3>{universidade.nome}</h3>
                      <p>{universidade.cidade}</p>

                      <div className="etiquetas-favorita">
                        {universidade.etiquetas
                          ? universidade.etiquetas.map(function (etiqueta) {
                            return <span key={etiqueta}>{etiqueta}</span>
                          })
                          : (
                            <>
                              <span>{universidade.modalidade}</span>
                              <span>{universidade.idioma}</span>
                            </>
                          )}
                      </div>

                      <Link to={'/universidades/' + universidade.slug}>
                        Ver detalhes →
                      </Link>
                    </div>
                  </article>
                )
              })
            ) : (
              <p>Você ainda não favoritou nenhuma universidade.</p>
            )}
          </div>
        </section>

        <section className="resumo-jornada">
          <article className="resultado-perfil-jornada">
            <h2>Resultado do seu quiz de perfil</h2>

            {melhorResultado ? (
              <div className="resultado-perfil-conteudo">
                <div>
                  <strong>{melhorResultado.nome}</strong>
                  <p>{melhorResultado.cidade}</p>
                  <p>Maior compatibilidade com seu perfil</p>
                  <Link to="/resultado-quiz">
                    Ver todas as recomendações →
                  </Link>
                </div>

                <strong className="porcentagem-jornada">
                  {melhorResultado.compatibilidade}%
                </strong>
              </div>
            ) : (
              <div className="resultado-perfil-conteudo">
                <div>
                  <strong>Você ainda não realizou o quiz.</strong>
                  <p>Descubra quais universidades combinam com seu perfil.</p>
                  <Link to="/quiz">Fazer o quiz →</Link>
                </div>
              </div>
            )}
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
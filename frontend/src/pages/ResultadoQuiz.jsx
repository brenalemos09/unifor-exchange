import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import { listarResultadosQuiz, listarUniversidades } from '../services/api'
import './ResultadoQuiz.css'

function formatarDataHora(texto) {
  return new Date(texto).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ResultadoQuiz() {
  var navegar = useNavigate()
  var localizacao = useLocation()
  // resultado que acabou de ser calculado (vem do Quiz) — já traz o id de cada universidade
  var resultadoNovo = localizacao.state && localizacao.state.resultado

  var [historico, setHistorico] = useState([])
  var [universidades, setUniversidades] = useState([])
  var [selecionado, setSelecionado] = useState(null)
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    Promise.all([listarResultadosQuiz(), listarUniversidades({})])
      .then(function (respostas) {
        setHistorico(respostas[0])
        setUniversidades(respostas[1])
        if (!resultadoNovo && respostas[0].length > 0) setSelecionado(respostas[0][0].id_resultado)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  // O histórico guarda só o nome da universidade; o id e a cidade vêm do catálogo.
  function dadosDaUniversidade(nome, id) {
    return universidades.find(function (u) {
      return id ? u.id_universidade === id : u.nome === nome
    })
  }

  // monta a lista a mostrar, no mesmo formato para resultado novo ou do histórico
  var resultado = null
  if (resultadoNovo && selecionado === null) {
    resultado = {
      data: null,
      perfil: resultadoNovo.perfil,
      descricao: resultadoNovo.descricao,
      recomendacoes: resultadoNovo.recomendacoes.map(function (r) {
        return {
          id_universidade: r.id_universidade,
          nome: r.universidade,
          indice: r.indice_compatibilidade,
          justificativa: r.justificativa,
        }
      }),
    }
  } else {
    var doHistorico = historico.find(function (h) {
      return h.id_resultado === selecionado
    })
    if (doHistorico) {
      resultado = {
        data: doHistorico.data_realizacao,
        perfil: doHistorico.perfil,
        descricao: doHistorico.descricao,
        recomendacoes: doHistorico.recomendacoes_universidades.map(function (r) {
          var u = dadosDaUniversidade(r.universidade)
          return {
            id_universidade: u ? u.id_universidade : null,
            nome: r.universidade,
            indice: r.indice_compatibilidade,
            justificativa: r.justificativa,
          }
        }),
      }
    }
  }

  if (resultado) {
    resultado.recomendacoes.sort(function (a, b) {
      // maior índice primeiro; em empate, ordem alfabética (para não mudar a cada carregamento)
      return b.indice - a.indice || a.nome.localeCompare(b.nome)
    })
  }

  return (
    <>
      <Header />

      <main className="pagina-resultado">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar à página anterior"
        >
          ←
        </button>
        <section className="introducao-resultado">
          <span className="etiqueta-resultado">
            Resultado do seu quiz de perfil
          </span>

          <h1>Estes são os destinos mais compatíveis com você!</h1>

          <p>
            Comparamos suas respostas com os cursos, idiomas, regiões e
            programas disponíveis em cada universidade conveniada.
          </p>
        </section>

        <section className="aviso-oficial-resultado" role="note">
          <strong>Recomendação orientativa.</strong> Este resultado é apenas uma
          sugestão calculada a partir das suas respostas e <strong>não é uma decisão
          oficial da UNIFOR</strong>. A seleção depende do edital e da coordenação de
          intercâmbio (DRI).
        </section>

        {erro && <p className="aviso-resultado" role="alert">{erro}</p>}
        {carregando && <p className="aviso-resultado">Carregando resultado...</p>}

        {!carregando && !erro && !resultado && (
          <div className="aviso-resultado">
            <p>Você ainda não fez o quiz de perfil.</p>
            <Link to="/quiz" className="botao-refazer-resultado">Fazer o quiz →</Link>
          </div>
        )}

        {!carregando && !erro && resultado && (
          <>
            <div className="perfil-resultado">
              {resultado.perfil && <p><strong>Seu perfil:</strong> {resultado.perfil}</p>}
              {resultado.data && <p>Quiz feito em {formatarDataHora(resultado.data)}</p>}
            </div>

            <section className="lista-resultados">
              {resultado.recomendacoes.length === 0 && (
                <p className="aviso-resultado">
                  Nenhuma universidade teve pontos em comum com suas respostas.
                  Tente refazer o quiz escolhendo “Sem preferência” em algumas perguntas.
                </p>
              )}

              {resultado.recomendacoes.map(function (recomendacao, indice) {
                var u = dadosDaUniversidade(recomendacao.nome, recomendacao.id_universidade)
                return (
                  <article className="card-resultado" key={recomendacao.nome}>
                    <span className="posicao-resultado">{indice + 1}º</span>

                    <div className="informacoes-resultado">
                      <h2>{recomendacao.nome}</h2>
                      {u && <p>{u.cidade}, {u.pais}</p>}
                      {recomendacao.justificativa && (
                        <p className="justificativa-resultado">{recomendacao.justificativa}</p>
                      )}

                      {u && (
                        <div className="etiquetas-resultado">
                          {u.modalidades.concat(u.idiomas).map(function (etiqueta) {
                            return <span key={etiqueta}>{etiqueta}</span>
                          })}
                        </div>
                      )}

                      {recomendacao.id_universidade ? (
                        <Link to={'/universidades/' + recomendacao.id_universidade}>
                          Ver universidade →
                        </Link>
                      ) : (
                        <span className="sem-link-resultado">Universidade não está mais no catálogo</span>
                      )}
                    </div>

                    <div className="porcentagem-resultado">
                      <strong>{recomendacao.indice}%</strong>
                      <span>compatibilidade</span>
                    </div>
                  </article>
                )
              })}
            </section>

            <div className="acoes-resultado">
              <Link to="/quiz" className="botao-refazer-resultado">Refazer o quiz</Link>
            </div>
          </>
        )}

        {!carregando && historico.length > 1 && (
          <section className="historico-resultado">
            <h2>Seus quizzes anteriores</h2>
            <ul>
              {historico.map(function (h) {
                var ativo = selecionado === h.id_resultado ||
                  (selecionado === null && resultadoNovo && resultadoNovo.id_resultado === h.id_resultado)
                return (
                  <li key={h.id_resultado}>
                    <button
                      type="button"
                      className={ativo ? 'ativo' : ''}
                      onClick={function () {
                        setSelecionado(h.id_resultado)
                      }}
                    >
                      {formatarDataHora(h.data_realizacao)} — {h.perfil || 'Perfil aberto'}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </main>

      <Rodape />
    </>
  )
}

export default ResultadoQuiz

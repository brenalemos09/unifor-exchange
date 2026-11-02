import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { obterQuiz, responderQuiz, estaLogado } from '../services/api'
import './Quiz.css'

// respostas guardadas enquanto a pessoa faz login (só nesta aba do navegador)
var CHAVE_PENDENTE = 'unifor-exchange-quiz-pendente'

function lerPendente() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_PENDENTE)) || null
  } catch (e) {
    return null
  }
}

function Quiz() {
  var navigate = useNavigate()
  var logado = estaLogado()

  var [perguntas, setPerguntas] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')
  var [enviando, setEnviando] = useState(false)

  var pendente = lerPendente()
  var [etapa, setEtapa] = useState(pendente ? pendente.etapa : 0)
  // { id_pergunta: texto da opção escolhida }
  var [respostas, setRespostas] = useState(pendente ? pendente.respostas : {})

  useEffect(function () {
    obterQuiz()
      .then(function (quiz) {
        setPerguntas(quiz.perguntas)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  var total = perguntas.length
  var perguntaAtual = perguntas[etapa]
  var progresso = total ? Math.round(((etapa + 1) / total) * 100) : 0
  var respostaAtual = perguntaAtual ? respostas[perguntaAtual.id_pergunta] : undefined
  var ultima = etapa === total - 1

  function selecionarResposta(opcao) {
    setRespostas({ ...respostas, [perguntaAtual.id_pergunta]: opcao })
  }

  async function enviar() {
    if (!estaLogado()) {
      sessionStorage.setItem(CHAVE_PENDENTE, JSON.stringify({ etapa: etapa, respostas: respostas }))
      navigate('/login', { state: { de: '/quiz' } })
      return
    }

    setEnviando(true)
    setErro('')
    try {
      var lista = perguntas
        .filter(function (p) {
          return respostas[p.id_pergunta]
        })
        .map(function (p) {
          return { id_pergunta: p.id_pergunta, texto: respostas[p.id_pergunta] }
        })
      var resultado = await responderQuiz(lista)
      sessionStorage.removeItem(CHAVE_PENDENTE)
      navigate('/resultado-quiz', { state: { resultado: resultado } })
    } catch (e) {
      setErro(e.message)
      setEnviando(false)
    }
  }

  function avancar() {
    if (!respostaAtual) return
    if (ultima) enviar()
    else setEtapa(etapa + 1)
  }

  function voltar() {
    if (etapa > 0) setEtapa(etapa - 1)
  }

  return (
    <>
      <Header />

      <main className="pagina-quiz">
        <button
          className="botao-voltar"
          onClick={function () {
            navigate(-1)
          }}
          aria-label="Voltar à página anterior"
        >
          ←
        </button>
        <section className="cartao-quiz">
          {!logado && (
            <p className="aviso-quiz">
              Você pode responder agora, mas precisa <Link to="/login" state={{ de: '/quiz' }}>entrar</Link> para
              ver e salvar suas recomendações.
            </p>
          )}

          {carregando && <p className="aviso-quiz">Carregando perguntas...</p>}

          {!carregando && !perguntaAtual && !erro && (
            <p className="aviso-quiz">Nenhuma pergunta cadastrada no quiz ainda.</p>
          )}

          {perguntaAtual && (
            <>
              <div className="progresso-quiz">
                <div className="texto-progresso">
                  <span>Progresso: {etapa + 1} de {total}</span>
                  <strong>{progresso}%</strong>
                </div>

                <div className="barra-progresso">
                  <div
                    className="preenchimento-progresso"
                    style={{ width: progresso + '%' }}
                  ></div>
                </div>
              </div>

              <div className="pergunta-quiz">
                <h1>{perguntaAtual.enunciado}</h1>
                <p>Escolha a alternativa que melhor representa sua preferência.</p>
              </div>

              <div className="opcoes-quiz" role="radiogroup" aria-label={perguntaAtual.enunciado}>
                {perguntaAtual.opcoes.map(function (opcao) {
                  var marcada = respostaAtual === opcao
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={marcada}
                      key={opcao}
                      className={marcada ? 'opcao-quiz selecionada' : 'opcao-quiz'}
                      onClick={function () {
                        selecionarResposta(opcao)
                      }}
                    >
                      <span className="radio-quiz">
                        {marcada && <span className="radio-preenchido"></span>}
                      </span>
                      {opcao}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {erro && <p className="erro-quiz" role="alert">{erro}</p>}

          {perguntaAtual && (
            <div className="botoes-quiz">
              <button
                type="button"
                className="botao-voltar-quiz"
                onClick={voltar}
                disabled={etapa === 0 || enviando}
              >
                ← Voltar
              </button>

              <button
                type="button"
                className="botao-proxima-quiz"
                onClick={avancar}
                disabled={!respostaAtual || enviando}
              >
                {!ultima
                  ? 'Próxima →'
                  : enviando
                    ? 'Calculando...'
                    : logado
                      ? 'Ver resultado →'
                      : 'Entrar para ver o resultado →'}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default Quiz

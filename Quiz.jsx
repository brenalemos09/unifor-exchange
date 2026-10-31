
import { useState } from 'react'
import './Quiz.css'

function Quiz() {
  var perguntas = [
    {
      pergunta: 'O que mais te interessa em uma experiência de intercâmbio?',
      descricao: 'Escolha a alternativa que melhor representa sua preferência.',
      opcoes: [
        'Vivência de país e oportunidade de praticar uma língua estrangeira',
        'Quero conhecer uma nova cultura e explorar diferentes costumes',
        'Experiência acadêmica e instituições parceiras',
        'Proximidade cultural com o Brasil',
      ],
    },
    {
      pergunta: 'Qual ambiente você prefere para estudar?',
      descricao: 'Pense no tipo de experiência acadêmica que mais combina com você.',
      opcoes: [
        'Universidades tradicionais e reconhecidas',
        'Ambientes modernos e inovadores',
        'Instituições com foco em pesquisa',
        'Universidades com forte integração cultural',
      ],
    },
    {
      pergunta: 'Qual idioma você prefere utilizar durante o intercâmbio?',
      descricao: 'Escolha o idioma com o qual você se sente mais confortável.',
      opcoes: [
        'Inglês',
        'Espanhol',
        'Português',
        'Estou aberto(a) a aprender outro idioma',
      ],
    },
  ]

  var [etapa, setEtapa] = useState(0)
  var [respostas, setRespostas] = useState({})

  var perguntaAtual = perguntas[etapa]
  var progresso = Math.round(((etapa + 1) / 8) * 100)

  function selecionarResposta(opcao) {
    setRespostas({
      ...respostas,
      [etapa]: opcao,
    })
  }

  function avancar() {
    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1)
    }
  }

  function voltar() {
    if (etapa > 0) {
      setEtapa(etapa - 1)
    }
  }

  return (
    <>
      <header className="topo-quiz">
        <a href="/" className="marca-quiz">
          <span className="simbolo-quiz"></span>
          <strong>UNIFOR Exchange</strong>
        </a>

        <nav className="menu-quiz">
          <a href="#mapa">Mapa</a>
          <a href="#universidades">Universidades</a>
          <a href="#quiz">Quiz de Perfil</a>
          <a href="#oportunidades">Oportunidades</a>
          <a href="#jornada">Minha Jornada</a>
        </nav>

        <a href="#login" className="botao-entrar-quiz">Entrar</a>
      </header>

      <main className="pagina-quiz">
        <section className="cartao-quiz">
          <div className="progresso-quiz">
            <div className="texto-progresso">
              <span>Progresso: {etapa + 1} de 8</span>
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
            <h1>{perguntaAtual.pergunta}</h1>
            <p>{perguntaAtual.descricao}</p>
          </div>

          <div className="opcoes-quiz">
            {perguntaAtual.opcoes.map(function (opcao, indice) {
              return (
                <button
                  type="button"
                  key={indice}
                  className={
                    respostas[etapa] === opcao
                      ? 'opcao-quiz selecionada'
                      : 'opcao-quiz'
                  }
                  onClick={function () {
                    selecionarResposta(opcao)
                  }}
                >
                  <span className="radio-quiz">
                    {respostas[etapa] === opcao && (
                      <span className="radio-preenchido"></span>
                    )}
                  </span>
                  {opcao}
                </button>
              )
            })}
          </div>

          <div className="botoes-quiz">
            <button
              type="button"
              className="botao-voltar-quiz"
              onClick={voltar}
              disabled={etapa === 0}
            >
              ← Voltar
            </button>

            <button
              type="button"
              className="botao-proxima-quiz"
              onClick={avancar}
              disabled={!respostas[etapa]}
            >
              Próxima →
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default Quiz

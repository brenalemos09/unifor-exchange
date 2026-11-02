import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Quiz.css'

function Quiz() {
  var navigate = useNavigate()

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
    {
      pergunta: 'Qual clima combina mais com você?',
      descricao: 'Pense no clima em que você gostaria de viver.',
      opcoes: [
        'Clima frio, com inverno rigoroso e possibilidade de neve.',
        'Clima ameno, com estações do ano bem definidas.',
        'Clima quente, com bastante sol durante o ano.',
        'Não tenho preferência, consigo me adaptar a diferentes climas.',
      ],
    },
    {
      pergunta: 'Em que tipo de cidade você gostaria de morar?',
      descricao: 'Escolha o ambiente urbano que mais combina com seu estilo.',
      opcoes: [
        'Uma grande metrópole, movimentada e cheia de possibilidades.',
        'Uma cidade de médio porte, com equilíbrio entre movimento e tranquilidade.',
        'Uma cidade pequena, tranquila e com ritmo de vida mais lento.',
        'Uma cidade universitária, com bastante presença de estudantes e vida acadêmica.',
      ],
    },
    {
      pergunta: 'Qual é a sua principal preocupação ao escolher um destino?',
      descricao: 'O que mais pesa na sua decisão?',
      opcoes: [
        'Custo de vida e possibilidade de economizar.',
        'Segurança e qualidade de vida.',
        'Qualidade e reputação da universidade.',
        'Oportunidades de viajar e conhecer novos lugares.',
      ],
    },
    {
      pergunta: 'Como você gostaria que fosse sua experiência cultural?',
      descricao: 'Pense no tipo de vivência cultural que deseja ter.',
      opcoes: [
        'Conhecer uma cultura muito diferente da brasileira e sair completamente da minha zona de conforto.',
        'Viver uma cultura diferente, mas com algumas semelhanças com a minha.',
        'Estar em um ambiente internacional, com pessoas de várias nacionalidades.',
        'Viver em um lugar com costumes e estilo de vida mais próximos dos que já conheço.',
      ],
    },
    {
      pergunta: 'Como você imagina sua rotina fora do horário das aulas?',
      descricao: 'Escolha o que mais combina com seu tempo livre.',
      opcoes: [
        'Aproveitando festas, eventos e uma vida noturna agitada.',
        'Explorando a cidade, fazendo passeios e viajando.',
        'Participando de atividades culturais, esportivas e projetos universitários.',
        'Aproveitando uma rotina mais tranquila, com tempo para estudar e descansar.',
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
    if (!respostas[etapa]) {
      return
    }

    if (etapa < perguntas.length - 1) {
      setEtapa(etapa + 1)
    } else {
      localStorage.setItem('respostasQuiz', JSON.stringify(respostas))
      localStorage.setItem('perguntasQuiz', JSON.stringify(perguntas))
      navigate('/resultado-quiz')
    }
  }

  function voltar() {
    if (etapa > 0) {
      setEtapa(etapa - 1)
    }
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
              {etapa === perguntas.length - 1 ? 'Ver resultado →' : 'Próxima →'}
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default Quiz

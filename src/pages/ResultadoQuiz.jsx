import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import './ResultadoQuiz.css'

function ResultadoQuiz() {
  var navegar = useNavigate()
  var respostas = JSON.parse(localStorage.getItem('respostasQuiz') || '{}')

  var universidades = [
    {
      slug: 'berlin-school',
      nome: 'Berlin School of Economics and Law',
      cidade: 'Berlin, Alemanha',
      pais: 'Alemanha',
      idioma: 'Inglês',
      clima: 'frio',
      tamanho: 'metropole',
      academico: 'tradicional',
      custo: 'alto',
      cultura: 'diferente',
      rotina: 'agitada',
    },
    {
      slug: 'santiago-compostela',
      nome: 'Universidad de Santiago de Compostela',
      cidade: 'Santiago de Compostela, Espanha',
      pais: 'Espanha',
      idioma: 'Espanhol',
      clima: 'ameno',
      tamanho: 'media',
      academico: 'tradicional',
      custo: 'medio',
      cultura: 'proxima',
      rotina: 'cultural',
    },
    {
      slug: 'universite-rouen',
      nome: 'Université de Rouen',
      cidade: 'Rouen, França',
      pais: 'França',
      idioma: 'Francês',
      clima: 'frio',
      tamanho: 'media',
      academico: 'pesquisa',
      custo: 'medio',
      cultura: 'diferente',
      rotina: 'tranquila',
    },
    {
      slug: 'xiamen-university',
      nome: 'Xiamen University',
      cidade: 'Xiamen, China',
      pais: 'China',
      idioma: 'Inglês',
      clima: 'quente',
      tamanho: 'media',
      academico: 'pesquisa',
      custo: 'medio',
      cultura: 'diferente',
      rotina: 'cultural',
    },
    {
      slug: 'universidade-minho',
      nome: 'Universidade do Minho',
      cidade: 'Braga, Portugal',
      pais: 'Portugal',
      idioma: 'Português',
      clima: 'ameno',
      tamanho: 'media',
      academico: 'moderno',
      custo: 'baixo',
      cultura: 'proxima',
      rotina: 'tranquila',
    },
    {
      slug: 'ben-gurion',
      nome: 'Ben-Gurion University of the Negev',
      cidade: 'Beer-Sheva, Israel',
      pais: 'Israel',
      idioma: 'Inglês',
      clima: 'quente',
      tamanho: 'media',
      academico: 'pesquisa',
      custo: 'medio',
      cultura: 'diferente',
      rotina: 'cultural',
    },
    {
      slug: 'diego-portales',
      nome: 'Universidad Diego Portales',
      cidade: 'Santiago, Chile',
      pais: 'Chile',
      idioma: 'Espanhol',
      clima: 'ameno',
      tamanho: 'metropole',
      academico: 'moderno',
      custo: 'medio',
      cultura: 'proxima',
      rotina: 'agitada',
    },
    {
      slug: 'rotterdam-university',
      nome: 'Rotterdam University of Applied Sciences',
      cidade: 'Rotterdam, Holanda',
      pais: 'Holanda',
      idioma: 'Inglês',
      clima: 'frio',
      tamanho: 'metropole',
      academico: 'moderno',
      custo: 'alto',
      cultura: 'internacional',
      rotina: 'agitada',
    },
    {
      slug: 'kyonggi-university',
      nome: 'Kyonggi University',
      cidade: 'Suwon, Coreia do Sul',
      pais: 'Coreia do Sul',
      idioma: 'Inglês',
      clima: 'frio',
      tamanho: 'media',
      academico: 'tradicional',
      custo: 'medio',
      cultura: 'diferente',
      rotina: 'cultural',
    },
  ]

  // Peso de cada pergunta no resultado final
  var pesos = [15, 10, 20, 10, 10, 10, 15, 10]

  var resultados = universidades.map(function (universidade) {
    var pontos = 0
    var pesoRespondido = 0
    var etiquetas = []

    function avaliar(indice, nota, etiqueta) {
      if (respostas[indice] !== undefined) {
        pontos += nota * pesos[indice]
        pesoRespondido += pesos[indice]

        if (nota >= 0.65 && etiqueta) {
          etiquetas.push(etiqueta)
        }
      }
    }

    // Pergunta 1: interesse no intercâmbio
    var interesse = respostas[0]
    var notaInteresse = 0.5
    var etiquetaInteresse = 'Experiência internacional'

    if (interesse === 'Vivência de país e oportunidade de praticar uma língua estrangeira') {
      notaInteresse = universidade.idioma === 'Português' ? 0.3 : 1
      etiquetaInteresse = 'Oportunidade de praticar outro idioma'
    } else if (interesse === 'Quero conhecer uma nova cultura e explorar diferentes costumes') {
      notaInteresse = universidade.cultura === 'diferente' ? 1 : 0.5
      etiquetaInteresse = 'Experiência cultural'
    } else if (interesse === 'Experiência acadêmica e instituições parceiras') {
      notaInteresse = 1
      etiquetaInteresse = 'Foco na experiência acadêmica'
    } else if (interesse === 'Proximidade cultural com o Brasil') {
      notaInteresse = universidade.cultura === 'proxima' ? 1 : 0.3
      etiquetaInteresse = 'Proximidade cultural'
    }

    avaliar(0, notaInteresse, etiquetaInteresse)

    // Pergunta 2: ambiente de estudo
    var ambiente = respostas[1]
    var notaAmbiente = 0.5

    if (ambiente === 'Universidades tradicionais e reconhecidas') {
      notaAmbiente = universidade.academico === 'tradicional' ? 1 : 0.5
    } else if (ambiente === 'Ambientes modernos e inovadores') {
      notaAmbiente = universidade.academico === 'moderno' ? 1 : 0.5
    } else if (ambiente === 'Instituições com foco em pesquisa') {
      notaAmbiente = universidade.academico === 'pesquisa' ? 1 : 0.5
    } else if (ambiente === 'Universidades com forte integração cultural') {
      notaAmbiente = universidade.cultura === 'internacional' ? 1 : 0.6
    }

    avaliar(1, notaAmbiente, 'Perfil acadêmico compatível')

    // Pergunta 3: idioma
    var idioma = respostas[2]
    var notaIdioma = 0.5
    var etiquetaIdioma = 'Idioma diferente do preferido'

    if (idioma === 'Estou aberto(a) a aprender outro idioma') {
      notaIdioma = 1
      etiquetaIdioma = 'Aberto a novos idiomas'
    } else if (universidade.idioma === idioma) {
      notaIdioma = 1
      etiquetaIdioma = 'Idioma compatível'
    } else if (
      (idioma === 'Espanhol' && universidade.idioma === 'Português') ||
      (idioma === 'Português' && universidade.idioma === 'Espanhol')
    ) {
      notaIdioma = 0.7
      etiquetaIdioma = 'Idioma próximo ao preferido'
    }

    avaliar(2, notaIdioma, etiquetaIdioma)

    // Pergunta 4: clima
    var clima = respostas[3]
    var notaClima = 0.5

    if (clima && clima.startsWith('Clima frio')) {
      notaClima = universidade.clima === 'frio' ? 1 : 0.3
    } else if (clima && clima.startsWith('Clima ameno')) {
      notaClima = universidade.clima === 'ameno' ? 1 : 0.5
    } else if (clima && clima.startsWith('Clima quente')) {
      notaClima = universidade.clima === 'quente' ? 1 : 0.3
    } else if (clima && clima.startsWith('Não tenho preferência')) {
      notaClima = 1
    }

    avaliar(3, notaClima, 'Clima compatível')

    // Pergunta 5: tamanho da cidade
    var cidade = respostas[4]
    var notaCidade = 0.5

    if (cidade && cidade.startsWith('Uma grande metrópole')) {
      notaCidade = universidade.tamanho === 'metropole' ? 1 : 0.4
    } else if (cidade && cidade.startsWith('Uma cidade de médio porte')) {
      notaCidade = universidade.tamanho === 'media' ? 1 : 0.5
    } else if (cidade && cidade.startsWith('Uma cidade pequena')) {
      notaCidade = universidade.tamanho === 'pequena' ? 1 : 0.4
    } else if (cidade && cidade.startsWith('Uma cidade universitária')) {
      notaCidade = 1
    }

    avaliar(4, notaCidade, 'Perfil de cidade compatível')

    // Pergunta 6: principal preocupação
    var preocupacao = respostas[5]
    var notaPreocupacao = 0.5

    if (preocupacao === 'Custo de vida e possibilidade de economizar') {
      notaPreocupacao = universidade.custo === 'baixo' ? 1 : universidade.custo === 'medio' ? 0.7 : 0.3
    } else if (preocupacao === 'Segurança e qualidade de vida') {
      notaPreocupacao = 0.8
    } else if (preocupacao === 'Qualidade e reputação da universidade') {
      notaPreocupacao = universidade.academico === 'tradicional' || universidade.academico === 'pesquisa' ? 1 : 0.7
    } else if (preocupacao === 'Oportunidades de viajar e conhecer novos lugares') {
      notaPreocupacao = universidade.tamanho === 'metropole' ? 1 : 0.7
    }

    avaliar(5, notaPreocupacao, 'Prioridade considerada')

    // Pergunta 7: experiência cultural
    var cultura = respostas[6]
    var notaCultura = 0.5

    if (cultura && cultura.startsWith('Conhecer uma cultura muito diferente')) {
      notaCultura = universidade.cultura === 'diferente' ? 1 : 0.4
    } else if (cultura && cultura.startsWith('Viver uma cultura diferente, mas com algumas semelhanças')) {
      notaCultura = 1
    } else if (cultura && cultura.startsWith('Estar em um ambiente internacional')) {
      notaCultura = universidade.cultura === 'internacional' ? 1 : 0.7
    } else if (cultura && cultura.startsWith('Viver em um lugar com costumes')) {
      notaCultura = universidade.cultura === 'proxima' ? 1 : 0.4
    }

    avaliar(6, notaCultura, 'Experiência cultural compatível')

    // Pergunta 8: rotina fora das aulas
    var rotina = respostas[7]
    var notaRotina = 0.5

    if (rotina && rotina.startsWith('Aproveitando festas')) {
      notaRotina = universidade.rotina === 'agitada' ? 1 : 0.5
    } else if (rotina && rotina.startsWith('Explorando a cidade')) {
      notaRotina = universidade.tamanho === 'metropole' ? 1 : 0.7
    } else if (rotina && rotina.startsWith('Participando de atividades culturais')) {
      notaRotina = universidade.rotina === 'cultural' ? 1 : 0.7
    } else if (rotina && rotina.startsWith('Aproveitando uma rotina mais tranquila')) {
      notaRotina = universidade.rotina === 'tranquila' ? 1 : 0.5
    }

    avaliar(7, notaRotina, 'Rotina compatível')

    var compatibilidade =
      pesoRespondido > 0
        ? Math.round((pontos / pesoRespondido) * 100)
        : 0

    return {
      ...universidade,
      compatibilidade: compatibilidade,
      etiquetas: etiquetas,
    }
  })

  resultados.sort(function (a, b) {
    return b.compatibilidade - a.compatibilidade
  })
  localStorage.setItem('resultadoQuiz', JSON.stringify(resultados))

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
            Analisamos suas respostas e comparamos suas preferências
            com as informações disponíveis das universidades.
          </p>
        </section>

        <section className="lista-resultados">
          {resultados.map(function (universidade, indice) {
            return (
              <article className="card-resultado" key={universidade.slug}>
                <span className="posicao-resultado">{indice + 1}º</span>

                <div className="informacoes-resultado">
                  <h2>{universidade.nome}</h2>
                  <p>{universidade.cidade}</p>

                  <div className="etiquetas-resultado">
                    {universidade.etiquetas.map(function (etiqueta, i) {
                      return <span key={i}>{etiqueta}</span>
                    })}
                  </div>

                  <Link to={'/universidades/' + universidade.slug}>
                    Ver universidade →
                  </Link>
                </div>

                <div className="porcentagem-resultado">
                  <strong>{universidade.compatibilidade}%</strong>
                  <span>compatibilidade</span>
                </div>
              </article>
            )
          })}
        </section>
      </main>

      <footer className="rodape-resultado">
        <p>
          UNIFOR Exchange — plataforma de apoio à orientação.
          Não substitui os processos oficiais da UNIFOR.
        </p>

        <nav>
          <Link to="/universidades">Perguntas</Link>
          <Link to="/universidades">Contato e Suporte</Link>
          <Link to="/universidades">Experiências de Estudantes</Link>
        </nav>
      </footer>
    </>
  )
}

export default ResultadoQuiz

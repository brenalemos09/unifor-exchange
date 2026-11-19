import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import './Conteudo.css'
import './Tutorial.css'

// Passo a passo de como o estudante usa a plataforma.
// Cada passo leva direto para a tela correspondente.
var passos = [
  {
    titulo: 'Crie sua conta ou entre',
    texto:
      'Clique em "Entrar", no canto superior direito. Se for seu primeiro acesso, escolha "Criar conta" e informe nome completo, matrícula, e-mail institucional (@edu.unifor.br) e uma senha. Depois, entre com sua matrícula ou e-mail e a senha.',
    dica: 'Você pode explorar o mapa, o catálogo e as oportunidades sem conta. O login só é necessário para salvar favoritos, ver o resultado do quiz, usar a Minha Jornada e publicar relatos.',
    link: '/cadastro',
    textoLink: 'Criar minha conta',
  },
  {
    titulo: 'Explore os destinos no mapa',
    texto:
      'Na tela "Mapa", veja os países que têm universidades conveniadas com a UNIFOR. Clique em um país para abrir a página dele, com informações gerais e a lista de universidades parceiras naquele lugar.',
    link: '/mapa',
    textoLink: 'Abrir o mapa',
  },
  {
    titulo: 'Pesquise no catálogo de universidades',
    texto:
      'Em "Universidades", busque pelo nome da instituição ou use os filtros de país, curso ou área, idioma e modalidade. Clique em uma universidade para ver os detalhes: cursos, oportunidades disponíveis, relatos de estudantes e o link para o site oficial.',
    dica: 'Gostou de uma universidade? Clique em "♡ Favoritar" para guardá-la na sua Minha Jornada.',
    link: '/universidades',
    textoLink: 'Ver o catálogo',
  },
  {
    titulo: 'Faça o quiz de perfil',
    texto:
      'O "Quiz de Perfil" tem perguntas rápidas sobre seus interesses, idioma e preferências. Ao final, você recebe universidades recomendadas, cada uma com um índice de compatibilidade e a explicação do porquê da sugestão.',
    dica: 'As recomendações são orientativas: use-as como ponto de partida, não como decisão final.',
    link: '/quiz',
    textoLink: 'Começar o quiz',
  },
  {
    titulo: 'Confira as oportunidades',
    texto:
      'Em "Oportunidades", veja os programas e editais cadastrados (intercâmbio, dupla titulação e outros). Use os filtros para encontrar as oportunidades que combinam com você e confira prazos e detalhes de cada uma.',
    link: '/oportunidades',
    textoLink: 'Ver oportunidades',
  },
  {
    titulo: 'Veja os requisitos e verifique sua elegibilidade',
    texto:
      'A página "Requisitos" reúne os critérios gerais para participar dos programas. Em "Elegibilidade", marque os critérios que você já cumpre e veja, de forma orientativa, o que ainda falta.',
    dica: 'Cada edital pode ter exigências próprias. Confira sempre o edital oficial do programa.',
    link: '/requisitos',
    textoLink: 'Ver requisitos',
  },
  {
    titulo: 'Organize sua preparação na Minha Jornada',
    texto:
      'A "Minha Jornada" é sua área pessoal. Lá ficam suas universidades favoritas, o resultado do seu último quiz e um checklist com as etapas da preparação para o intercâmbio. Marque cada etapa concluída e acompanhe seu progresso pela barra de porcentagem.',
    link: '/minha-jornada',
    textoLink: 'Abrir Minha Jornada',
  },
  {
    titulo: 'Leia e compartilhe experiências',
    texto:
      'Em "Experiências de Estudantes", leia relatos de quem já fez intercâmbio. Depois de entrar na sua conta, você também pode publicar o seu relato para ajudar outros alunos.',
    link: '/relatos',
    textoLink: 'Ver experiências',
  },
  {
    titulo: 'Tire suas dúvidas com a DRI',
    texto:
      'Em "Contato e Suporte", estão os canais da Diretoria de Relações Internacionais (DRI) da UNIFOR. Inscrições, documentos e decisões sobre os programas são sempre feitos pelos canais oficiais da DRI.',
    link: '/contatos',
    textoLink: 'Ver contatos',
  },
]

var perguntas = [
  {
    pergunta: 'Preciso de conta para usar a plataforma?',
    resposta:
      'Não para consultar. Mapa, catálogo, oportunidades, requisitos, relatos e contatos são abertos. A conta é necessária para favoritos, resultado do quiz, Minha Jornada e para publicar relatos.',
  },
  {
    pergunta: 'Esqueci minha senha. E agora?',
    resposta:
      'Na tela de login, clique em "Esqueceu a senha?", informe sua matrícula ou e-mail e use o código de 6 dígitos (válido por 15 minutos) para criar uma nova senha.',
  },
  {
    pergunta: 'Posso me inscrever em um intercâmbio por aqui?',
    resposta:
      'Não. O UNIFOR Exchange é informativo e orientativo. As inscrições e decisões são feitas pelos canais oficiais da DRI da UNIFOR.',
  },
  {
    pergunta: 'Funciona no celular?',
    resposta: 'Sim. A plataforma se adapta a celular, tablet e computador.',
  },
]

function Tutorial() {
  return (
    <>
      <Header />

      <main className="pagina-conteudo">
        <section className="cabecalho-conteudo">
          <h1>Como usar o UNIFOR Exchange</h1>
          <p>
            Um passo a passo para você descobrir destinos, comparar universidades e organizar
            sua preparação para o intercâmbio. Siga na ordem ou pule direto para o que precisar.
          </p>
        </section>

        <section className="corpo-conteudo">
          <p className="aviso-orientativo">
            O UNIFOR Exchange é uma ferramenta de orientação e não substitui os processos
            oficiais da Diretoria de Relações Internacionais (DRI) da UNIFOR.
          </p>

          <ol className="lista-conteudo lista-tutorial">
            {passos.map(function (passo, indice) {
              return (
                <li className="card-conteudo passo-tutorial" key={passo.titulo}>
                  <h3>
                    <span className="numero-conteudo">{indice + 1}</span>
                    {passo.titulo}
                  </h3>
                  <p>{passo.texto}</p>
                  {passo.dica && <p className="dica-tutorial">💡 {passo.dica}</p>}
                  <Link to={passo.link} className="link-tutorial">
                    {passo.textoLink} →
                  </Link>
                </li>
              )
            })}
          </ol>

          <h2>Dúvidas frequentes</h2>
          <div className="lista-conteudo">
            {perguntas.map(function (item) {
              return (
                <details className="card-conteudo pergunta-tutorial" key={item.pergunta}>
                  <summary>{item.pergunta}</summary>
                  <p>{item.resposta}</p>
                </details>
              )
            })}
          </div>

          <p>
            <Link to="/mapa" className="botao-conteudo">
              Começar a explorar →
            </Link>
          </p>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Tutorial

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
  obterUsuario,
  listarFavoritos,
  desfavoritar,
  obterChecklist,
  marcarItemChecklist,
  listarResultadosQuiz,
} from '../services/api'
import './MinhaJornada.css'

function MinhaJornada() {
  var navegar = useNavigate()
  var usuario = obterUsuario()
  var primeiroNome = usuario ? usuario.nome.split(' ')[0] : ''

  var [favoritos, setFavoritos] = useState([])
  var [checklist, setChecklist] = useState(null)
  var [ultimoResultado, setUltimoResultado] = useState(null)
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')
  var [salvandoItem, setSalvandoItem] = useState(null)

  useEffect(function () {
    Promise.all([listarFavoritos(), obterChecklist(), listarResultadosQuiz()])
      .then(function (respostas) {
        setFavoritos(respostas[0])
        setChecklist(respostas[1])
        setUltimoResultado(respostas[2][0] || null)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  async function removerFavorito(idUniversidade) {
    try {
      await desfavoritar(idUniversidade)
      setFavoritos(favoritos.filter(function (f) {
        return f.id_universidade !== idUniversidade
      }))
    } catch (e) {
      window.alert(e.message)
    }
  }

  async function alterarItem(item) {
    setSalvandoItem(item.id_conteudo)
    try {
      await marcarItemChecklist(item.id_conteudo, item.status !== 'concluido')
      setChecklist(await obterChecklist())
    } catch (e) {
      window.alert(e.message)
    }
    setSalvandoItem(null)
  }

  // recomendação com maior índice do último quiz
  var melhorRecomendacao = null
  if (ultimoResultado && ultimoResultado.recomendacoes_universidades.length > 0) {
    melhorRecomendacao = ultimoResultado.recomendacoes_universidades.slice().sort(function (a, b) {
      return b.indice_compatibilidade - a.indice_compatibilidade
    })[0]
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
          <div className="avatar-jornada">{primeiroNome.charAt(0).toUpperCase()}</div>
          <div>
            <h1>Olá, {primeiroNome}!</h1>
            <p>Acompanhe sua jornada de intercâmbio</p>
          </div>
        </section>

        {erro && <p className="aviso-jornada" role="alert">{erro}</p>}
        {carregando && <p className="aviso-jornada">Carregando sua jornada...</p>}

        {!carregando && !erro && (
          <>
            <section className="favoritas-jornada">
              <h2>Suas universidades favoritas</h2>

              <div className="grade-favoritas">
                {favoritos.length > 0 ? (
                  favoritos.map(function (favorito) {
                    var universidade = favorito.universidade
                    return (
                      <article className="card-favorita" key={favorito.id_universidade}>
                        <div className="imagem-favorita">
                          <button
                            type="button"
                            className="icone-favorita"
                            aria-label={'Remover ' + universidade.nome + ' dos favoritos'}
                            title="Remover dos favoritos"
                            onClick={function () {
                              removerFavorito(favorito.id_universidade)
                            }}
                          >
                            ♥
                          </button>
                        </div>

                        <div className="conteudo-favorita">
                          <h3>{universidade.nome}</h3>
                          <p>{universidade.cidade} · {universidade.pais_nome_oficial}</p>

                          <Link to={'/universidades/' + universidade.id_universidade}>
                            Ver detalhes →
                          </Link>
                        </div>
                      </article>
                    )
                  })
                ) : (
                  <p className="vazio-jornada">
                    Você ainda não favoritou nenhuma universidade.{' '}
                    <Link to="/universidades">Explorar o catálogo →</Link>
                  </p>
                )}
              </div>
            </section>

            <section className="resumo-jornada">
              <article className="resultado-perfil-jornada">
                <h2>Resultado do seu quiz de perfil</h2>

                {melhorRecomendacao ? (
                  <div className="resultado-perfil-conteudo">
                    <div>
                      <strong>{melhorRecomendacao.universidade}</strong>
                      <p>Maior compatibilidade com seu perfil</p>
                      {ultimoResultado.perfil && <p>Perfil: {ultimoResultado.perfil}</p>}
                      <Link to="/resultado-quiz">
                        Ver todas as recomendações →
                      </Link>
                    </div>

                    <strong className="porcentagem-jornada">
                      {melhorRecomendacao.indice_compatibilidade}%
                    </strong>
                  </div>
                ) : (
                  <div className="resultado-perfil-conteudo">
                    <div>
                      <strong>
                        {ultimoResultado
                          ? 'Seu último quiz não encontrou universidades compatíveis.'
                          : 'Você ainda não realizou o quiz.'}
                      </strong>
                      <p>Descubra quais universidades combinam com seu perfil.</p>
                      <Link to="/quiz">{ultimoResultado ? 'Refazer o quiz →' : 'Fazer o quiz →'}</Link>
                    </div>
                  </div>
                )}
              </article>

              <article className="checklist-jornada">
                <h2>Sua jornada de intercâmbio</h2>

                {checklist && checklist.total > 0 ? (
                  <>
                    <div className="progresso-jornada">
                      <div className="texto-progresso-jornada">
                        <span>{checklist.concluidos} de {checklist.total} etapas concluídas</span>
                        <strong>{checklist.progresso}%</strong>
                      </div>
                      <div
                        className="barra-progresso-jornada"
                        role="progressbar"
                        aria-valuenow={checklist.progresso}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div style={{ width: checklist.progresso + '%' }}></div>
                      </div>
                    </div>

                    <div className="lista-etapas-jornada">
                      {checklist.itens.map(function (item) {
                        return (
                          <label className="item-etapa-jornada" key={item.id_conteudo} title={item.descricao || ''}>
                            <input
                              type="checkbox"
                              checked={item.status === 'concluido'}
                              disabled={salvandoItem === item.id_conteudo}
                              onChange={function () {
                                alterarItem(item)
                              }}
                            />
                            <span>{item.titulo}</span>
                          </label>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="vazio-jornada">Nenhuma etapa cadastrada pela coordenação ainda.</p>
                )}
              </article>
            </section>
          </>
        )}
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

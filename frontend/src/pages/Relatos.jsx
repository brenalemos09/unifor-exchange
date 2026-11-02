import { useState, useEffect } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import {
  listarRelatos,
  publicarRelato,
  excluirRelato,
  listarUniversidades,
  estaLogado,
  ehAdministrador,
} from '../services/api'
import './Conteudo.css'

var FORMULARIO_VAZIO = { titulo: '', texto: '', nota: '', id_universidade: '' }

function formatarData(texto) {
  var partes = String(texto).slice(0, 10).split('-')
  return partes[2] + '/' + partes[1] + '/' + partes[0]
}

function Relatos() {
  var localizacao = useLocation()
  var [parametros, setParametros] = useSearchParams()
  var universidade = parametros.get('universidade') || ''

  var [busca, setBusca] = useState('')
  var [relatos, setRelatos] = useState([])
  var [universidades, setUniversidades] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  var [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  var [enviando, setEnviando] = useState(false)
  var [erroFormulario, setErroFormulario] = useState('')
  var [mensagem, setMensagem] = useState('')
  var [recarregar, setRecarregar] = useState(0)

  var logado = estaLogado()
  var admin = ehAdministrador()

  useEffect(function () {
    listarUniversidades({})
      .then(setUniversidades)
      .catch(function () {})
  }, [])

  useEffect(function () {
    var cancelado = false
    setCarregando(true)
    var espera = setTimeout(function () {
      listarRelatos({ universidade: universidade, busca: busca.trim() })
        .then(function (lista) {
          if (cancelado) return
          setRelatos(lista)
          setErro('')
          setCarregando(false)
        })
        .catch(function (e) {
          if (cancelado) return
          setErro(e.message)
          setCarregando(false)
        })
    }, 250)
    return function () {
      cancelado = true
      clearTimeout(espera)
    }
  }, [universidade, busca, recarregar])

  function mudarUniversidade(valor) {
    if (valor) setParametros({ universidade: valor })
    else setParametros({})
  }

  async function publicar(evento) {
    evento.preventDefault()
    setErroFormulario('')
    setMensagem('')
    if (formulario.nota !== '' && (Number(formulario.nota) < 0 || Number(formulario.nota) > 10)) {
      setErroFormulario('A nota deve ser de 0 a 10.')
      return
    }
    setEnviando(true)
    try {
      await publicarRelato({
        titulo: formulario.titulo.trim(),
        texto: formulario.texto.trim(),
        nota: formulario.nota === '' ? null : Number(formulario.nota),
        id_universidade: formulario.id_universidade ? Number(formulario.id_universidade) : null,
      })
      setFormulario(FORMULARIO_VAZIO)
      setMensagem('Relato publicado. Obrigado por compartilhar sua experiência!')
      setRecarregar(recarregar + 1)
    } catch (e) {
      setErroFormulario(e.message)
    }
    setEnviando(false)
  }

  async function excluir(relato) {
    if (!window.confirm('Excluir o relato "' + relato.titulo + '"?')) return
    try {
      await excluirRelato(relato.id_experiencia)
      setRecarregar(recarregar + 1)
    } catch (e) {
      window.alert(e.message)
    }
  }

  return (
    <>
      <Header />

      <main className="pagina-conteudo">
        <section className="cabecalho-conteudo">
          <h1>Experiências de estudantes</h1>
          <p>
            Relatos de quem já fez intercâmbio pela UNIFOR. As opiniões são pessoais
            e não representam a posição oficial da universidade.
          </p>
        </section>

        <section className="corpo-conteudo">
          <div className="filtros-conteudo">
            <input
              type="search"
              placeholder="Buscar nos relatos..."
              aria-label="Buscar nos relatos"
              value={busca}
              onChange={function (evento) {
                setBusca(evento.target.value)
              }}
            />
            <select
              aria-label="Filtrar por universidade"
              value={universidade}
              onChange={function (evento) {
                mudarUniversidade(evento.target.value)
              }}
            >
              <option value="">Todas as universidades</option>
              {universidades.map(function (u) {
                return <option key={u.id_universidade} value={u.id_universidade}>{u.nome}</option>
              })}
            </select>
          </div>

          {erro && <p className="aviso-conteudo" role="alert">{erro}</p>}
          {carregando && !erro && <p className="aviso-conteudo">Carregando relatos...</p>}
          {!carregando && !erro && relatos.length === 0 && (
            <p className="aviso-conteudo">Nenhum relato encontrado.</p>
          )}

          {!carregando && !erro && relatos.length > 0 && (
            <ul className="lista-conteudo">
              {relatos.map(function (relato) {
                return (
                  <li className="card-conteudo" key={relato.id_experiencia}>
                    <h3>{relato.titulo}</h3>
                    <p>{relato.texto}</p>
                    <div className="meta-conteudo">
                      {relato.nota !== null && <span className="nota-conteudo">Nota {relato.nota}</span>}
                      <span>Por {relato.autor || 'Anônimo'} em {formatarData(relato.data_publicacao)}</span>
                      {relato.universidade && (
                        <Link to={'/universidades/' + relato.universidade.id_universidade}>
                          {relato.universidade.nome}
                        </Link>
                      )}
                      {admin && (
                        <button
                          type="button"
                          className="botao-secundario-conteudo"
                          onClick={function () {
                            excluir(relato)
                          }}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <h2>Compartilhe sua experiência</h2>

          {!logado ? (
            <p className="card-conteudo">
              <Link to="/login" state={{ de: localizacao.pathname + localizacao.search }}>Entre na sua conta</Link>{' '}
              para publicar um relato.
            </p>
          ) : (
            <form className="formulario-conteudo" onSubmit={publicar}>
              <label>
                Título
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formulario.titulo}
                  onChange={function (evento) {
                    setFormulario({ ...formulario, titulo: evento.target.value })
                  }}
                />
              </label>

              <label>
                Seu relato
                <textarea
                  required
                  value={formulario.texto}
                  onChange={function (evento) {
                    setFormulario({ ...formulario, texto: evento.target.value })
                  }}
                />
              </label>

              <div className="linha-formulario-conteudo">
                <label>
                  Universidade (opcional)
                  <select
                    value={formulario.id_universidade}
                    onChange={function (evento) {
                      setFormulario({ ...formulario, id_universidade: evento.target.value })
                    }}
                  >
                    <option value="">Relato geral</option>
                    {universidades.map(function (u) {
                      return <option key={u.id_universidade} value={u.id_universidade}>{u.nome}</option>
                    })}
                  </select>
                </label>

                <label>
                  Nota de 0 a 10 (opcional)
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={formulario.nota}
                    onChange={function (evento) {
                      setFormulario({ ...formulario, nota: evento.target.value })
                    }}
                  />
                </label>
              </div>

              {erroFormulario && <p className="erro-conteudo" role="alert">{erroFormulario}</p>}
              {mensagem && <p className="sucesso-conteudo" role="status">{mensagem}</p>}

              <div>
                <button type="submit" className="botao-conteudo" disabled={enviando}>
                  {enviando ? 'Publicando...' : 'Publicar relato'}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Relatos

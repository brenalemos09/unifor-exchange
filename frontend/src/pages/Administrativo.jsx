import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import {
  obterUsuario,
  listarUniversidades,
  listarFiltros,
  listarPaises,
  criarUniversidade,
  editarUniversidade,
  excluirUniversidade,
} from '../services/api'
import './Administrativo.css'

var FORMULARIO_VAZIO = { nome: '', cidade: '', pais_nome_oficial: '', modalidade: '' }

function Administrativo() {
  var navegar = useNavigate()
  var usuario = obterUsuario()
  var ehAdmin = usuario && usuario.tipo === 'administrador'

  var [secao, setSecao] = useState('Universidades')
  var [busca, setBusca] = useState('')
  var [universidadeEditando, setUniversidadeEditando] = useState(null)
  var [mostrarFormulario, setMostrarFormulario] = useState(false)
  var [universidades, setUniversidades] = useState([])
  var [paises, setPaises] = useState([])
  var [modalidades, setModalidades] = useState([])
  var [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  var [erro, setErro] = useState('')
  var [carregando, setCarregando] = useState(true)

  function carregarUniversidades() {
    return listarUniversidades({})
      .then(function (lista) {
        setUniversidades(lista)
        setErro('')
      })
      .catch(function (e) {
        setErro(e.message)
      })
  }

  useEffect(function () {
    if (!ehAdmin) return
    Promise.all([
      carregarUniversidades(),
      listarPaises().then(setPaises),
      listarFiltros().then(function (f) {
        setModalidades(f.modalidades)
      }),
    ])
      .catch(function (e) {
        setErro(e.message)
      })
      .then(function () {
        setCarregando(false)
      })
  }, [])

  var universidadesFiltradas = universidades.filter(function (universidade) {
    var texto = (
      universidade.nome + ' ' +
      universidade.pais + ' ' +
      universidade.modalidades.join(' ')
    ).toLowerCase()

    return texto.includes(busca.toLowerCase())
  })

  function abrirNovoCadastro() {
    setFormulario(FORMULARIO_VAZIO)
    setUniversidadeEditando(null)
    setMostrarFormulario(true)
  }

  function abrirEdicao(universidade) {
    var paisEncontrado = paises.find(function (p) {
      return p.nome === universidade.pais
    })
    var modalidadeEncontrada = modalidades.find(function (m) {
      return m.tipo === universidade.modalidades[0]
    })
    setFormulario({
      nome: universidade.nome,
      cidade: universidade.cidade,
      pais_nome_oficial: paisEncontrado ? paisEncontrado.nome_oficial : '',
      modalidade: modalidadeEncontrada ? String(modalidadeEncontrada.id_modalidade) : '',
    })
    setUniversidadeEditando(universidade.id_universidade)
    setMostrarFormulario(true)
  }

  async function salvarUniversidade(evento) {
    evento.preventDefault()

    var dados = {
      nome: formulario.nome,
      cidade: formulario.cidade,
      pais_nome_oficial: formulario.pais_nome_oficial,
      modalidades: formulario.modalidade ? [Number(formulario.modalidade)] : [],
    }

    try {
      if (universidadeEditando !== null) {
        await editarUniversidade(universidadeEditando, dados)
      } else {
        await criarUniversidade(dados)
      }
      setMostrarFormulario(false)
      await carregarUniversidades()
    } catch (e) {
      window.alert(e.message)
    }
  }

  async function excluir(id) {
    var confirmar = window.confirm('Deseja realmente excluir esta universidade?')

    if (confirmar) {
      try {
        await excluirUniversidade(id)
        await carregarUniversidades()
      } catch (e) {
        window.alert(e.message)
      }
    }
  }

  if (!ehAdmin) {
    return (
      <main className="pagina-administrativo">
        <Header />
        <div className="conteudo-administrativo">
          <section className="area-administrativa">
            <h1>Área restrita</h1>
            <p>Esta área é exclusiva para administradores.</p>
            <Link to="/login">Entrar como administrador</Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="pagina-administrativo">
      <Header />
      <button
        className="botao-voltar"
        onClick={function () {
          navegar(-1)
        }}
        aria-label="Voltar"
      >
        ←
      </button>

      <div className="conteudo-administrativo">
        <aside className="menu-administrativo">
          <nav>
            {[
              'Geral',
              'Universidades',
              'Países',
              'Oportunidades',
              'Convênios Institucionais',
            ].map(function (item) {
              return (
                <button
                  type="button"
                  key={item}
                  className={secao === item ? 'item-menu-admin ativo' : 'item-menu-admin'}
                  onClick={function () {
                    setSecao(item)
                  }}
                >
                  {item}
                </button>
              )
            })}
          </nav>
        </aside>

        <section className="area-administrativa">
          <div className="cabecalho-admin">
            <h1>Gerenciar {secao.toLowerCase()}</h1>

            <button
              type="button"
              className="botao-nova-universidade"
              onClick={abrirNovoCadastro}
            >
              + Nova Universidade
            </button>
          </div>

          <div className="busca-admin">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Buscar universidade..."
              value={busca}
              onChange={function (evento) {
                setBusca(evento.target.value)
              }}
            />
          </div>

          <div className="tabela-admin">
            <table>
              <thead>
                <tr>
                  <th>Universidade</th>
                  <th>País</th>
                  <th>Modalidade</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {universidadesFiltradas.map(function (universidade) {
                  return (
                    <tr key={universidade.id_universidade}>
                      <td>{universidade.nome}</td>
                      <td>{universidade.pais}</td>
                      <td>{universidade.modalidades.join(', ') || '—'}</td>
                      <td className="acoes-admin">
                        <button
                          type="button"
                          onClick={function () {
                            abrirEdicao(universidade)
                          }}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={function () {
                            excluir(universidade.id_universidade)
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {erro && <p className="sem-universidades-admin" role="alert">{erro}</p>}

            {!erro && !carregando && universidadesFiltradas.length === 0 && (
              <p className="sem-universidades-admin">
                Nenhuma universidade encontrada.
              </p>
            )}
          </div>
        </section>
      </div>

      {mostrarFormulario && (
        <div className="fundo-modal-admin">
          <form className="modal-admin" onSubmit={salvarUniversidade}>
            <h2>
              {universidadeEditando !== null
                ? 'Editar universidade'
                : 'Nova universidade'}
            </h2>

            <label>
              Nome da universidade
              <input
                type="text"
                required
                value={formulario.nome}
                onChange={function (evento) {
                  setFormulario({ ...formulario, nome: evento.target.value })
                }}
              />
            </label>

            <label>
              Cidade
              <input
                type="text"
                required
                value={formulario.cidade}
                onChange={function (evento) {
                  setFormulario({ ...formulario, cidade: evento.target.value })
                }}
              />
            </label>

            <label>
              País
              <select
                value={formulario.pais_nome_oficial}
                onChange={function (evento) {
                  setFormulario({ ...formulario, pais_nome_oficial: evento.target.value })
                }}
                required
              >
                <option value="">Selecione</option>
                {paises.map(function (p) {
                  return (
                    <option key={p.nome_oficial} value={p.nome_oficial}>
                      {p.nome}
                    </option>
                  )
                })}
              </select>
            </label>

            <label>
              Modalidade
              <select
                value={formulario.modalidade}
                onChange={function (evento) {
                  setFormulario({ ...formulario, modalidade: evento.target.value })
                }}
                required
              >
                <option value="">Selecione</option>
                {modalidades.map(function (m) {
                  return (
                    <option key={m.id_modalidade} value={m.id_modalidade}>
                      {m.tipo}
                    </option>
                  )
                })}
              </select>
            </label>

            <div className="botoes-modal-admin">
              <button
                type="button"
                className="cancelar-admin"
                onClick={function () {
                  setMostrarFormulario(false)
                }}
              >
                Cancelar
              </button>

              <button type="submit" className="salvar-admin">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default Administrativo


import { useState } from 'react'
import './Administrativo.css'

function Administrativo() {
  var [secao, setSecao] = useState('Universidades')
  var [busca, setBusca] = useState('')
  var [universidadeEditando, setUniversidadeEditando] = useState(null)
  var [mostrarFormulario, setMostrarFormulario] = useState(false)

  var [universidades, setUniversidades] = useState([
    {
      id: 1,
      nome: 'Universidade de Lisboa',
      pais: 'Portugal',
      modalidade: 'Intercâmbio',
      status: 'Ativo',
    },
    {
      id: 2,
      nome: 'Bordeaux University',
      pais: 'França',
      modalidade: 'Intercâmbio',
      status: 'Ativo',
    },
    {
      id: 3,
      nome: 'University of Toronto',
      pais: 'Canadá',
      modalidade: 'Dupla titulação',
      status: 'Ativo',
    },
    {
      id: 4,
      nome: 'Technical University of Munich',
      pais: 'Alemanha',
      modalidade: 'Pesquisa',
      status: 'Inativo',
    },
  ])

  var [formulario, setFormulario] = useState({
    nome: '',
    pais: '',
    modalidade: '',
    status: 'Ativo',
  })

  var universidadesFiltradas = universidades.filter(function (universidade) {
    var texto = (
      universidade.nome + ' ' +
      universidade.pais + ' ' +
      universidade.modalidade
    ).toLowerCase()

    return texto.includes(busca.toLowerCase())
  })

  function abrirNovoCadastro() {
    setFormulario({
      nome: '',
      pais: '',
      modalidade: '',
      status: 'Ativo',
    })
    setUniversidadeEditando(null)
    setMostrarFormulario(true)
  }

  function abrirEdicao(universidade) {
    setFormulario({
      nome: universidade.nome,
      pais: universidade.pais,
      modalidade: universidade.modalidade,
      status: universidade.status,
    })
    setUniversidadeEditando(universidade.id)
    setMostrarFormulario(true)
  }

  function salvarUniversidade(evento) {
    evento.preventDefault()

    if (universidadeEditando !== null) {
      setUniversidades(universidades.map(function (universidade) {
        if (universidade.id === universidadeEditando) {
          return {
            ...universidade,
            ...formulario,
          }
        }
        return universidade
      }))
    } else {
      setUniversidades([
        ...universidades,
        {
          id: Date.now(),
          ...formulario,
        },
      ])
    }

    setMostrarFormulario(false)
  }

  function excluirUniversidade(id) {
    var confirmar = window.confirm('Deseja realmente excluir esta universidade?')

    if (confirmar) {
      setUniversidades(universidades.filter(function (universidade) {
        return universidade.id !== id
      }))
    }
  }

  return (
    <main className="pagina-administrativo">
      <header className="topo-administrativo">
        <div className="marca-administrativo">
          <span className="simbolo-administrativo">●</span>
          <strong>UNIFOR Exchange · Painel Administrativo</strong>
        </div>
        <div className="perfil-administrativo"></div>
      </header>

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
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {universidadesFiltradas.map(function (universidade) {
                  return (
                    <tr key={universidade.id}>
                      <td>{universidade.nome}</td>
                      <td>{universidade.pais}</td>
                      <td>{universidade.modalidade}</td>
                      <td>
                        <span className={
                          universidade.status === 'Ativo'
                            ? 'status-admin ativo'
                            : 'status-admin inativo'
                        }>
                          {universidade.status}
                        </span>
                      </td>
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
                            excluirUniversidade(universidade.id)
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

            {universidadesFiltradas.length === 0 && (
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
              País
              <input
                type="text"
                required
                value={formulario.pais}
                onChange={function (evento) {
                  setFormulario({ ...formulario, pais: evento.target.value })
                }}
              />
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
                <option>Intercâmbio</option>
                <option>Dupla titulação</option>
                <option>Pesquisa</option>
              </select>
            </label>

            <label>
              Status
              <select
                value={formulario.status}
                onChange={function (evento) {
                  setFormulario({ ...formulario, status: evento.target.value })
                }}
              >
                <option>Ativo</option>
                <option>Inativo</option>
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

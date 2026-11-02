import { useState, useEffect } from 'react'
import { listarPaises, criarPais, editarPais, excluirPais } from '../../services/api'
import { coordenadasDoPais } from '../../utils/coordenadas'

var FORMULARIO_VAZIO = { nome_oficial: '', nome: '', continente: '', descricao: '' }
var CONTINENTES = ['África', 'América Central', 'América do Norte', 'América do Sul', 'Ásia', 'Europa', 'Oceania']

function AdminPaises() {
  var [paises, setPaises] = useState([])
  var [busca, setBusca] = useState('')
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')
  var [mensagem, setMensagem] = useState('')

  var [mostrarFormulario, setMostrarFormulario] = useState(false)
  var [editando, setEditando] = useState(null) // nome_oficial do país em edição
  var [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  var [erroFormulario, setErroFormulario] = useState('')
  var [salvando, setSalvando] = useState(false)

  function carregar() {
    return listarPaises()
      .then(function (lista) {
        setPaises(lista)
        setErro('')
      })
      .catch(function (e) {
        setErro(e.message)
      })
      .then(function () {
        setCarregando(false)
      })
  }

  useEffect(function () {
    carregar()
  }, [])

  function abrirNovo() {
    setFormulario(FORMULARIO_VAZIO)
    setEditando(null)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function abrirEdicao(p) {
    setFormulario({
      nome_oficial: p.nome_oficial,
      nome: p.nome,
      continente: p.continente,
      descricao: p.descricao || '',
    })
    setEditando(p.nome_oficial)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function mudar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function salvar(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErroFormulario('')
    try {
      if (editando !== null) {
        await editarPais(editando, {
          nome: formulario.nome,
          continente: formulario.continente,
          descricao: formulario.descricao,
        })
      } else {
        await criarPais(formulario)
      }
      setMostrarFormulario(false)
      setMensagem(editando !== null ? 'País atualizado.' : 'País cadastrado.')
      await carregar()
    } catch (e) {
      setErroFormulario(e.message)
    }
    setSalvando(false)
  }

  async function excluir(p) {
    if (p.total_universidades > 0) {
      window.alert('Não é possível excluir ' + p.nome + ': há ' + p.total_universidades +
        ' universidade(s) cadastrada(s) nele. Exclua ou mude essas universidades de país antes.')
      return
    }
    if (!window.confirm('Excluir o país "' + p.nome + '"?')) return
    try {
      await excluirPais(p.nome_oficial)
      setMensagem('País excluído.')
      await carregar()
    } catch (e) {
      window.alert(e.message)
    }
  }

  var filtrados = paises.filter(function (p) {
    return (p.nome + ' ' + p.nome_oficial + ' ' + p.continente).toLowerCase().includes(busca.toLowerCase())
  })

  return (
    <>
      <div className="cabecalho-admin">
        <h1>Gerenciar países</h1>
        <button type="button" className="botao-nova-universidade" onClick={abrirNovo}>
          + Novo país
        </button>
      </div>

      {mensagem && <p className="mensagem-admin" role="status">{mensagem}</p>}

      <div className="busca-admin">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Buscar país ou continente..."
          aria-label="Buscar país"
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
              <th>País</th>
              <th>Nome oficial</th>
              <th>Continente</th>
              <th>Universidades</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(function (p) {
              return (
                <tr key={p.nome_oficial}>
                  <td>
                    {p.nome}
                    {!coordenadasDoPais(p.nome) && (
                      <span className="dica-admin" title="Sem posição em utils/coordenadas.js: aparece só na lista do mapa">
                        {' '}(fora do mapa)
                      </span>
                    )}
                  </td>
                  <td>{p.nome_oficial}</td>
                  <td>{p.continente}</td>
                  <td>{p.total_universidades}</td>
                  <td className="acoes-admin">
                    <button type="button" onClick={function () { abrirEdicao(p) }}>Editar</button>
                    <button type="button" onClick={function () { excluir(p) }}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {erro && <p className="sem-universidades-admin" role="alert">{erro}</p>}
        {carregando && <p className="sem-universidades-admin">Carregando...</p>}
        {!erro && !carregando && filtrados.length === 0 && (
          <p className="sem-universidades-admin">Nenhum país encontrado.</p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="fundo-modal-admin">
          <form className="modal-admin" onSubmit={salvar}>
            <h2>{editando !== null ? 'Editar país' : 'Novo país'}</h2>

            <label>
              Nome oficial
              <input type="text" required maxLength={150} value={formulario.nome_oficial}
                disabled={editando !== null}
                placeholder="Ex.: República Portuguesa"
                onChange={function (e) { mudar('nome_oficial', e.target.value) }} />
              {editando !== null && <small>O nome oficial identifica o país e não pode ser alterado.</small>}
            </label>

            <label>
              Nome de exibição
              <input type="text" required maxLength={100} value={formulario.nome}
                placeholder="Ex.: Portugal"
                onChange={function (e) { mudar('nome', e.target.value) }} />
            </label>

            <label>
              Continente
              <select required value={formulario.continente}
                onChange={function (e) { mudar('continente', e.target.value) }}>
                <option value="">Selecione</option>
                {CONTINENTES.concat(CONTINENTES.includes(formulario.continente) || !formulario.continente ? [] : [formulario.continente])
                  .map(function (c) {
                    return <option key={c} value={c}>{c}</option>
                  })}
              </select>
            </label>

            <label>
              Descrição
              <textarea value={formulario.descricao}
                onChange={function (e) { mudar('descricao', e.target.value) }} />
            </label>

            {erroFormulario && <p className="erro-admin" role="alert">{erroFormulario}</p>}

            <div className="botoes-modal-admin">
              <button type="button" className="cancelar-admin" onClick={function () { setMostrarFormulario(false) }}>
                Cancelar
              </button>
              <button type="submit" className="salvar-admin" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default AdminPaises

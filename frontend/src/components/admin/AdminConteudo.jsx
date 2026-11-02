import { useState, useEffect } from 'react'
import {
  listarConteudoPorTipo,
  criarConteudo,
  editarConteudo,
  excluirConteudo,
} from '../../services/api'

var TIPOS = [
  { valor: 'requisito', nome: 'Requisitos' },
  { valor: 'contato', nome: 'Contatos' },
  { valor: 'checklist_item', nome: 'Etapas da jornada (checklist)' },
]

var FORMULARIO_VAZIO = { titulo: '', descricao: '', ordem: '', verificavel_elegibilidade: false, contato: '' }

function AdminConteudo() {
  var [tipo, setTipo] = useState('requisito')
  var [itens, setItens] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')
  var [mensagem, setMensagem] = useState('')

  var [mostrarFormulario, setMostrarFormulario] = useState(false)
  var [editando, setEditando] = useState(null)
  var [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  var [erroFormulario, setErroFormulario] = useState('')
  var [salvando, setSalvando] = useState(false)

  function carregar(tipoAtual) {
    return listarConteudoPorTipo(tipoAtual)
      .then(function (lista) {
        setItens(lista)
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
    setCarregando(true)
    setMensagem('')
    carregar(tipo)
  }, [tipo])

  function abrirNovo() {
    setFormulario(FORMULARIO_VAZIO)
    setEditando(null)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function abrirEdicao(item) {
    setFormulario({
      titulo: item.titulo,
      descricao: item.descricao || '',
      ordem: item.ordem === null ? '' : String(item.ordem),
      verificavel_elegibilidade: !!item.verificavel_elegibilidade,
      contato: item.contato || '',
    })
    setEditando(item.id_conteudo)
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
    var dados = {
      titulo: formulario.titulo,
      descricao: formulario.descricao,
      ordem: formulario.ordem === '' ? null : Number(formulario.ordem),
    }
    if (tipo === 'requisito') dados.verificavel_elegibilidade = formulario.verificavel_elegibilidade
    if (tipo === 'contato') dados.contato = formulario.contato
    try {
      if (editando !== null) await editarConteudo(editando, dados)
      else await criarConteudo({ ...dados, tipo: tipo })
      setMostrarFormulario(false)
      setMensagem(editando !== null ? 'Item atualizado.' : 'Item cadastrado.')
      await carregar(tipo)
    } catch (e) {
      setErroFormulario(e.message)
    }
    setSalvando(false)
  }

  async function excluir(item) {
    var extra = tipo === 'checklist_item' ? ' O progresso dos estudantes nesta etapa também será apagado.' : ''
    if (!window.confirm('Excluir "' + item.titulo + '"?' + extra)) return
    try {
      await excluirConteudo(item.id_conteudo)
      setMensagem('Item excluído.')
      await carregar(tipo)
    } catch (e) {
      window.alert(e.message)
    }
  }

  var nomeTipo = TIPOS.find(function (t) { return t.valor === tipo }).nome

  return (
    <>
      <div className="cabecalho-admin">
        <h1>Conteúdo institucional</h1>
        <button type="button" className="botao-nova-universidade" onClick={abrirNovo}>
          + Novo item
        </button>
      </div>

      <div className="abas-admin" role="tablist" aria-label="Tipo de conteúdo">
        {TIPOS.map(function (t) {
          return (
            <button
              type="button"
              role="tab"
              aria-selected={tipo === t.valor}
              key={t.valor}
              className={tipo === t.valor ? 'aba-admin ativa' : 'aba-admin'}
              onClick={function () {
                setTipo(t.valor)
              }}
            >
              {t.nome}
            </button>
          )
        })}
      </div>

      {mensagem && <p className="mensagem-admin" role="status">{mensagem}</p>}

      <div className="tabela-admin">
        <table>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Título</th>
              <th>{tipo === 'contato' ? 'Contato' : tipo === 'requisito' ? 'Na elegibilidade?' : 'Descrição'}</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {itens.map(function (item) {
              return (
                <tr key={item.id_conteudo}>
                  <td>{item.ordem === null ? '—' : item.ordem}</td>
                  <td>{item.titulo}</td>
                  <td>
                    {tipo === 'contato' && (item.contato || '—')}
                    {tipo === 'requisito' && (item.verificavel_elegibilidade ? 'Sim' : 'Não')}
                    {tipo === 'checklist_item' && (item.descricao || '—')}
                  </td>
                  <td className="acoes-admin">
                    <button type="button" onClick={function () { abrirEdicao(item) }}>Editar</button>
                    <button type="button" onClick={function () { excluir(item) }}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {erro && <p className="sem-universidades-admin" role="alert">{erro}</p>}
        {carregando && <p className="sem-universidades-admin">Carregando...</p>}
        {!erro && !carregando && itens.length === 0 && (
          <p className="sem-universidades-admin">Nenhum item cadastrado.</p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="fundo-modal-admin">
          <form className="modal-admin" onSubmit={salvar}>
            <h2>{editando !== null ? 'Editar item' : 'Novo item'} — {nomeTipo}</h2>

            <label>
              Título
              <input type="text" required maxLength={200} value={formulario.titulo}
                onChange={function (e) { mudar('titulo', e.target.value) }} />
            </label>

            <label>
              Descrição
              <textarea value={formulario.descricao}
                onChange={function (e) { mudar('descricao', e.target.value) }} />
            </label>

            {tipo === 'contato' && (
              <label>
                Contato (e-mail, telefone, endereço ou site)
                <input type="text" maxLength={255} value={formulario.contato}
                  onChange={function (e) { mudar('contato', e.target.value) }} />
              </label>
            )}

            <label>
              Ordem de exibição
              <input type="number" min="1" step="1" value={formulario.ordem}
                onChange={function (e) { mudar('ordem', e.target.value) }} />
            </label>

            {tipo === 'requisito' && (
              <label className="marcador-linha-admin">
                <input type="checkbox" checked={formulario.verificavel_elegibilidade}
                  onChange={function (e) { mudar('verificavel_elegibilidade', e.target.checked) }} />
                Aparece na verificação de elegibilidade
              </label>
            )}

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

export default AdminConteudo

import { useState, useEffect } from 'react'
import {
  listarOportunidades,
  listarUniversidades,
  criarOportunidade,
  editarOportunidade,
  excluirOportunidade,
} from '../../services/api'

var CATEGORIAS = {
  intercambio_academico: 'Intercâmbio acadêmico',
  dupla_titulacao: 'Dupla titulação',
  programa_internacional: 'Programa internacional',
}
var STATUS = { aberta: 'Aberta', em_breve: 'Em breve', encerrada: 'Encerrada' }

var FORMULARIO_VAZIO = {
  titulo: '',
  categoria: '',
  descricao: '',
  requisitos: '',
  fonte_oficial: '',
  data_inicio: '',
  data_fim: '',
  id_universidade: '',
}

function paraDataBR(texto) {
  var partes = String(texto).slice(0, 10).split('-')
  return partes[2] + '/' + partes[1] + '/' + partes[0]
}

function AdminOportunidades() {
  var [oportunidades, setOportunidades] = useState([])
  var [universidades, setUniversidades] = useState([])
  var [busca, setBusca] = useState('')
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')
  var [mensagem, setMensagem] = useState('')

  var [mostrarFormulario, setMostrarFormulario] = useState(false)
  var [editando, setEditando] = useState(null)
  var [formulario, setFormulario] = useState(FORMULARIO_VAZIO)
  var [erroFormulario, setErroFormulario] = useState('')
  var [salvando, setSalvando] = useState(false)

  function carregar() {
    return listarOportunidades({})
      .then(function (lista) {
        setOportunidades(lista)
        setErro('')
      })
      .catch(function (e) {
        setErro(e.message)
      })
  }

  useEffect(function () {
    Promise.all([carregar(), listarUniversidades({}).then(setUniversidades)])
      .catch(function (e) {
        setErro(e.message)
      })
      .then(function () {
        setCarregando(false)
      })
  }, [])

  function abrirNovo() {
    setFormulario(FORMULARIO_VAZIO)
    setEditando(null)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function abrirEdicao(o) {
    setFormulario({
      titulo: o.titulo,
      categoria: o.categoria,
      descricao: o.descricao,
      requisitos: o.requisitos || '',
      fonte_oficial: o.fonte_oficial || '',
      data_inicio: o.data_inicio.slice(0, 10),
      data_fim: o.data_fim.slice(0, 10),
      id_universidade: o.id_universidade ? String(o.id_universidade) : '',
    })
    setEditando(o.id_oportunidade)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function mudar(campo, valor) {
    setFormulario({ ...formulario, [campo]: valor })
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErroFormulario('')
    if (formulario.data_fim < formulario.data_inicio) {
      setErroFormulario('A data de fim não pode ser anterior à data de início.')
      return
    }
    setSalvando(true)
    var dados = {
      ...formulario,
      id_universidade: formulario.id_universidade ? Number(formulario.id_universidade) : null,
    }
    try {
      if (editando !== null) await editarOportunidade(editando, dados)
      else await criarOportunidade(dados)
      setMostrarFormulario(false)
      setMensagem(editando !== null ? 'Oportunidade atualizada.' : 'Oportunidade cadastrada.')
      await carregar()
    } catch (e) {
      setErroFormulario(e.message)
    }
    setSalvando(false)
  }

  async function excluir(o) {
    if (!window.confirm('Excluir a oportunidade "' + o.titulo + '"?')) return
    try {
      await excluirOportunidade(o.id_oportunidade)
      setMensagem('Oportunidade excluída.')
      await carregar()
    } catch (e) {
      window.alert(e.message)
    }
  }

  var filtradas = oportunidades.filter(function (o) {
    var texto = (o.titulo + ' ' + CATEGORIAS[o.categoria] + ' ' + (o.universidade ? o.universidade.nome : '')).toLowerCase()
    return texto.includes(busca.toLowerCase())
  })

  return (
    <>
      <div className="cabecalho-admin">
        <h1>Gerenciar oportunidades</h1>
        <button type="button" className="botao-nova-universidade" onClick={abrirNovo}>
          + Nova oportunidade
        </button>
      </div>

      {mensagem && <p className="mensagem-admin" role="status">{mensagem}</p>}

      <div className="busca-admin">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Buscar por título, categoria ou universidade..."
          aria-label="Buscar oportunidade"
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
              <th>Título</th>
              <th>Categoria</th>
              <th>Inscrições</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(function (o) {
              return (
                <tr key={o.id_oportunidade}>
                  <td>
                    {o.titulo}
                    {o.universidade && <span className="dica-admin"><br />{o.universidade.nome}</span>}
                  </td>
                  <td>{CATEGORIAS[o.categoria]}</td>
                  <td>{paraDataBR(o.data_inicio)} a {paraDataBR(o.data_fim)}</td>
                  <td><span className={'situacao-admin ' + o.status}>{STATUS[o.status]}</span></td>
                  <td className="acoes-admin">
                    <button type="button" onClick={function () { abrirEdicao(o) }}>Editar</button>
                    <button type="button" onClick={function () { excluir(o) }}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {erro && <p className="sem-universidades-admin" role="alert">{erro}</p>}
        {carregando && <p className="sem-universidades-admin">Carregando...</p>}
        {!erro && !carregando && filtradas.length === 0 && (
          <p className="sem-universidades-admin">Nenhuma oportunidade encontrada.</p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="fundo-modal-admin">
          <form className="modal-admin modal-admin-largo" onSubmit={salvar}>
            <h2>{editando !== null ? 'Editar oportunidade' : 'Nova oportunidade'}</h2>

            <label>
              Título
              <input type="text" required maxLength={200} value={formulario.titulo}
                onChange={function (e) { mudar('titulo', e.target.value) }} />
            </label>

            <div className="linha-modal-admin">
              <label>
                Categoria
                <select required value={formulario.categoria}
                  onChange={function (e) { mudar('categoria', e.target.value) }}>
                  <option value="">Selecione</option>
                  {Object.keys(CATEGORIAS).map(function (c) {
                    return <option key={c} value={c}>{CATEGORIAS[c]}</option>
                  })}
                </select>
              </label>

              <label>
                Universidade (opcional)
                <select value={formulario.id_universidade}
                  onChange={function (e) { mudar('id_universidade', e.target.value) }}>
                  <option value="">Nenhuma (programa geral)</option>
                  {universidades.map(function (u) {
                    return <option key={u.id_universidade} value={u.id_universidade}>{u.nome}</option>
                  })}
                </select>
              </label>
            </div>

            <div className="linha-modal-admin">
              <label>
                Início das inscrições
                <input type="date" required value={formulario.data_inicio}
                  onChange={function (e) { mudar('data_inicio', e.target.value) }} />
              </label>
              <label>
                Fim das inscrições
                <input type="date" required value={formulario.data_fim}
                  onChange={function (e) { mudar('data_fim', e.target.value) }} />
              </label>
            </div>

            <label>
              Descrição
              <textarea required value={formulario.descricao}
                onChange={function (e) { mudar('descricao', e.target.value) }} />
            </label>

            <label>
              Requisitos
              <textarea value={formulario.requisitos}
                onChange={function (e) { mudar('requisitos', e.target.value) }} />
            </label>

            <label>
              Fonte oficial
              <input type="url" maxLength={255} placeholder="https://" value={formulario.fonte_oficial}
                onChange={function (e) { mudar('fonte_oficial', e.target.value) }} />
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

export default AdminOportunidades

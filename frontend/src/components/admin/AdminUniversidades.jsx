import { useState, useEffect } from 'react'
import {
  listarUniversidades,
  listarFiltros,
  listarPaises,
  criarUniversidade,
  editarUniversidade,
  excluirUniversidade,
} from '../../services/api'

var FORMULARIO_VAZIO = {
  nome: '',
  cidade: '',
  pais_nome_oficial: '',
  descricao: '',
  informacoes_convenio: '',
  fonte_oficial: '',
  idiomas: [],
  modalidades: [],
  cursos: [],
}

// Lista de caixas de seleção (idiomas, modalidades, cursos)
function Marcadores(props) {
  return (
    <fieldset className="marcadores-admin">
      <legend>{props.titulo}</legend>
      <div>
        {props.opcoes.map(function (opcao) {
          var id = opcao[props.campoId]
          return (
            <label key={id}>
              <input
                type="checkbox"
                checked={props.marcados.includes(id)}
                onChange={function () {
                  props.aoMudar(props.marcados.includes(id)
                    ? props.marcados.filter(function (m) { return m !== id })
                    : props.marcados.concat(id))
                }}
              />
              {opcao[props.campoNome]}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function AdminUniversidades() {
  var [universidades, setUniversidades] = useState([])
  var [paises, setPaises] = useState([])
  var [opcoes, setOpcoes] = useState({ idiomas: [], modalidades: [], cursos: [] })
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
    Promise.all([carregar(), listarPaises().then(setPaises), listarFiltros().then(setOpcoes)])
      .catch(function (e) {
        setErro(e.message)
      })
      .then(function () {
        setCarregando(false)
      })
  }, [])

  // a lista pública traz nomes; o formulário precisa dos ids
  function idsPorNome(nomes, lista, campoId, campoNome) {
    return lista
      .filter(function (item) {
        return nomes.includes(item[campoNome])
      })
      .map(function (item) {
        return item[campoId]
      })
  }

  function abrirNovo() {
    setFormulario(FORMULARIO_VAZIO)
    setEditando(null)
    setErroFormulario('')
    setMostrarFormulario(true)
  }

  function abrirEdicao(u) {
    var pais = paises.find(function (p) {
      return p.nome === u.pais
    })
    setFormulario({
      nome: u.nome,
      cidade: u.cidade,
      pais_nome_oficial: pais ? pais.nome_oficial : '',
      descricao: u.descricao || '',
      informacoes_convenio: u.informacoes_convenio || '',
      fonte_oficial: u.fonte_oficial || '',
      idiomas: idsPorNome(u.idiomas, opcoes.idiomas, 'id_idioma', 'nome'),
      modalidades: idsPorNome(u.modalidades, opcoes.modalidades, 'id_modalidade', 'tipo'),
      cursos: idsPorNome(u.cursos, opcoes.cursos, 'id_curso', 'nome'),
    })
    setEditando(u.id_universidade)
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
      if (editando !== null) await editarUniversidade(editando, formulario)
      else await criarUniversidade(formulario)
      setMostrarFormulario(false)
      setMensagem(editando !== null ? 'Universidade atualizada.' : 'Universidade cadastrada.')
      await carregar()
    } catch (e) {
      setErroFormulario(e.message)
    }
    setSalvando(false)
  }

  async function excluir(u) {
    if (!window.confirm('Excluir "' + u.nome + '"? Os favoritos dela também serão apagados.')) return
    try {
      await excluirUniversidade(u.id_universidade)
      setMensagem('Universidade excluída.')
      await carregar()
    } catch (e) {
      window.alert(e.message)
    }
  }

  var filtradas = universidades.filter(function (u) {
    var texto = (u.nome + ' ' + u.cidade + ' ' + u.pais + ' ' + u.modalidades.join(' ')).toLowerCase()
    return texto.includes(busca.toLowerCase())
  })

  return (
    <>
      <div className="cabecalho-admin">
        <h1>Gerenciar universidades</h1>
        <button type="button" className="botao-nova-universidade" onClick={abrirNovo}>
          + Nova universidade
        </button>
      </div>

      {mensagem && <p className="mensagem-admin" role="status">{mensagem}</p>}

      <div className="busca-admin">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Buscar por nome, cidade, país ou modalidade..."
          aria-label="Buscar universidade"
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
              <th>Cidade / País</th>
              <th>Modalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(function (u) {
              return (
                <tr key={u.id_universidade}>
                  <td>{u.nome}</td>
                  <td>{u.cidade}, {u.pais}</td>
                  <td>{u.modalidades.join(', ') || '—'}</td>
                  <td className="acoes-admin">
                    <button type="button" onClick={function () { abrirEdicao(u) }}>Editar</button>
                    <button type="button" onClick={function () { excluir(u) }}>Excluir</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {erro && <p className="sem-universidades-admin" role="alert">{erro}</p>}
        {carregando && <p className="sem-universidades-admin">Carregando...</p>}
        {!erro && !carregando && filtradas.length === 0 && (
          <p className="sem-universidades-admin">Nenhuma universidade encontrada.</p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="fundo-modal-admin">
          <form className="modal-admin modal-admin-largo" onSubmit={salvar}>
            <h2>{editando !== null ? 'Editar universidade' : 'Nova universidade'}</h2>

            <label>
              Nome da universidade
              <input type="text" required maxLength={200} value={formulario.nome}
                onChange={function (e) { mudar('nome', e.target.value) }} />
            </label>

            <div className="linha-modal-admin">
              <label>
                Cidade
                <input type="text" required maxLength={100} value={formulario.cidade}
                  onChange={function (e) { mudar('cidade', e.target.value) }} />
              </label>

              <label>
                País
                <select required value={formulario.pais_nome_oficial}
                  onChange={function (e) { mudar('pais_nome_oficial', e.target.value) }}>
                  <option value="">Selecione</option>
                  {paises.map(function (p) {
                    return <option key={p.nome_oficial} value={p.nome_oficial}>{p.nome}</option>
                  })}
                </select>
              </label>
            </div>

            <label>
              Descrição
              <textarea value={formulario.descricao}
                onChange={function (e) { mudar('descricao', e.target.value) }} />
            </label>

            <label>
              Informações do convênio
              <textarea value={formulario.informacoes_convenio}
                onChange={function (e) { mudar('informacoes_convenio', e.target.value) }} />
            </label>

            <label>
              Site oficial
              <input type="url" maxLength={255} placeholder="https://" value={formulario.fonte_oficial}
                onChange={function (e) { mudar('fonte_oficial', e.target.value) }} />
            </label>

            <Marcadores titulo="Modalidades" opcoes={opcoes.modalidades} campoId="id_modalidade" campoNome="tipo"
              marcados={formulario.modalidades} aoMudar={function (v) { mudar('modalidades', v) }} />
            <Marcadores titulo="Idiomas" opcoes={opcoes.idiomas} campoId="id_idioma" campoNome="nome"
              marcados={formulario.idiomas} aoMudar={function (v) { mudar('idiomas', v) }} />
            <Marcadores titulo="Cursos" opcoes={opcoes.cursos} campoId="id_curso" campoNome="nome"
              marcados={formulario.cursos} aoMudar={function (v) { mudar('cursos', v) }} />

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

export default AdminUniversidades

// Comunicação do front-end com a API (back-end).
// Todas as telas usam estas funções, assim o endereço da API fica em um só lugar.

var URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

var CHAVE_TOKEN = 'unifor-exchange-token'
var CHAVE_USUARIO = 'unifor-exchange-usuario'

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuario() {
  var salvo = localStorage.getItem(CHAVE_USUARIO)
  return salvo ? JSON.parse(salvo) : null
}

export function sair() {
  localStorage.removeItem(CHAVE_TOKEN)
  localStorage.removeItem(CHAVE_USUARIO)
}

export function estaLogado() {
  return !!obterToken() && !!obterUsuario()
}

export function ehAdministrador() {
  var usuario = obterUsuario()
  return !!usuario && usuario.tipo === 'administrador'
}

function guardarSessao(dados) {
  localStorage.setItem(CHAVE_TOKEN, dados.token)
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados.usuario))
}

async function chamar(caminho, opcoes) {
  opcoes = opcoes || {}
  var cabecalhos = { 'Content-Type': 'application/json' }
  var token = obterToken()
  if (token) cabecalhos.Authorization = 'Bearer ' + token

  var resposta
  try {
    resposta = await fetch(URL_API + caminho, {
      method: opcoes.metodo || 'GET',
      headers: cabecalhos,
      body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
    })
  } catch (erro) {
    throw new Error('Não foi possível conectar à API. Verifique se ela está rodando.')
  }

  if (resposta.status === 204) return null

  var dados = await resposta.json().catch(function () {
    return {}
  })
  if (!resposta.ok) {
    // token vencido ou inválido: limpa a sessão para a pessoa entrar de novo
    if (resposta.status === 401 && token) sair()
    throw new Error(dados.erro || 'Erro ao falar com a API.')
  }
  return dados
}

/* ---------- login, cadastro e recuperação de senha ---------- */
export async function entrar(login, senha) {
  var dados = await chamar('/auth/login', { metodo: 'POST', corpo: { login: login, senha: senha } })
  guardarSessao(dados)
  return dados.usuario
}

export async function cadastrar(dados) {
  var resposta = await chamar('/auth/cadastro', { metodo: 'POST', corpo: dados })
  guardarSessao(resposta)
  return resposta.usuario
}

export function pedirCodigoRecuperacao(login) {
  return chamar('/auth/recuperar', { metodo: 'POST', corpo: { login: login } })
}

export function redefinirSenha(login, codigo, novaSenha) {
  return chamar('/auth/redefinir', {
    metodo: 'POST',
    corpo: { login: login, codigo: Number(codigo), nova_senha: novaSenha },
  })
}

/* ---------- catálogo (público) ---------- */
export function listarFiltros() {
  return chamar('/filtros')
}

export function listarUniversidades(filtros) {
  var parametros = new URLSearchParams()
  Object.keys(filtros || {}).forEach(function (chave) {
    if (filtros[chave]) parametros.set(chave, filtros[chave])
  })
  var texto = parametros.toString()
  return chamar('/universidades' + (texto ? '?' + texto : ''))
}

export function buscarUniversidade(id) {
  return chamar('/universidades/' + id)
}

/* ---------- área administrativa (precisa ser administrador) ---------- */
export function criarUniversidade(dados) {
  return chamar('/admin/universidades', { metodo: 'POST', corpo: dados })
}

export function editarUniversidade(id, dados) {
  return chamar('/admin/universidades/' + id, { metodo: 'PUT', corpo: dados })
}

export function excluirUniversidade(id) {
  return chamar('/admin/universidades/' + id, { metodo: 'DELETE' })
}

export function listarPaises() {
  return chamar('/paises')
}

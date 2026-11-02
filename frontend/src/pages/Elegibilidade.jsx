import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import { listarPerguntasElegibilidade, verificarElegibilidade } from '../services/api'
import './Conteudo.css'

function Elegibilidade() {
  var [perguntas, setPerguntas] = useState([])
  var [marcados, setMarcados] = useState([])
  var [resultado, setResultado] = useState(null)
  var [carregando, setCarregando] = useState(true)
  var [enviando, setEnviando] = useState(false)
  var [erro, setErro] = useState('')

  useEffect(function () {
    listarPerguntasElegibilidade()
      .then(function (lista) {
        setPerguntas(lista)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  function alternar(id) {
    setResultado(null)
    setMarcados(marcados.includes(id)
      ? marcados.filter(function (m) { return m !== id })
      : marcados.concat(id))
  }

  async function verificar(evento) {
    evento.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      setResultado(await verificarElegibilidade(marcados))
    } catch (e) {
      setErro(e.message)
    }
    setEnviando(false)
  }

  return (
    <>
      <Header />

      <main className="pagina-conteudo">
        <section className="cabecalho-conteudo">
          <h1>Verificação de elegibilidade</h1>
          <p>
            Marque os requisitos que você já cumpre para ter uma ideia se está apto
            a participar dos programas de mobilidade.
          </p>
        </section>

        <section className="corpo-conteudo">
          <p className="aviso-orientativo" role="note">
            <strong>Resultado orientativo.</strong> Esta verificação não é oficial: a
            confirmação da elegibilidade depende do edital e da coordenação de intercâmbio.
          </p>

          {carregando && <p className="aviso-conteudo">Carregando requisitos...</p>}
          {!carregando && !erro && perguntas.length === 0 && (
            <p className="aviso-conteudo">Nenhum requisito verificável cadastrado ainda.</p>
          )}

          {perguntas.length > 0 && (
            <form onSubmit={verificar}>
              <ul className="lista-conteudo">
                {perguntas.map(function (pergunta) {
                  return (
                    <li className="card-conteudo" key={pergunta.id_conteudo}>
                      <label className="item-elegibilidade">
                        <input
                          type="checkbox"
                          checked={marcados.includes(pergunta.id_conteudo)}
                          onChange={function () {
                            alternar(pergunta.id_conteudo)
                          }}
                        />
                        <span className="texto-elegibilidade">
                          <strong>{pergunta.titulo}</strong>
                          {pergunta.descricao && <span>{pergunta.descricao}</span>}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>

              <button type="submit" className="botao-conteudo" disabled={enviando}>
                {enviando ? 'Verificando...' : 'Verificar elegibilidade'}
              </button>
            </form>
          )}

          {erro && <p className="erro-conteudo" role="alert">{erro}</p>}

          {resultado && (
            <section
              className={'resultado-elegibilidade ' + (resultado.elegivel ? 'elegivel' : 'pendente')}
              aria-live="polite"
            >
              <h2>
                {resultado.elegivel
                  ? 'Você atende aos requisitos gerais!'
                  : 'Ainda faltam alguns requisitos'}
              </h2>
              <p>
                Você marcou {resultado.atendidos} de {resultado.total} requisitos.
              </p>

              {resultado.pendentes.length > 0 && (
                <>
                  <p><strong>Pendentes:</strong></p>
                  <ul>
                    {resultado.pendentes.map(function (p) {
                      return <li key={p.id_conteudo}>{p.titulo}</li>
                    })}
                  </ul>
                </>
              )}

              <p>{resultado.aviso}</p>
              <p className="meta-conteudo">
                <Link to="/oportunidades">Ver oportunidades abertas</Link>
                <Link to="/contatos">Falar com a coordenação</Link>
              </p>
            </section>
          )}
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Elegibilidade

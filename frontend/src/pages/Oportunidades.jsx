import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import { listarOportunidades } from '../services/api'
import './Oportunidades.css'

// valores aceitos pela API em /oportunidades
var CATEGORIAS = [
  { valor: '', nome: 'Todas' },
  { valor: 'intercambio_academico', nome: 'Intercâmbio acadêmico' },
  { valor: 'dupla_titulacao', nome: 'Dupla titulação' },
  { valor: 'programa_internacional', nome: 'Programa internacional' },
]

var STATUS = [
  { valor: '', nome: 'Todos' },
  { valor: 'aberta', nome: 'Inscrições abertas' },
  { valor: 'em_breve', nome: 'Em breve' },
  { valor: 'encerrada', nome: 'Encerradas' },
]

var NOME_STATUS = { aberta: 'Inscrições abertas', em_breve: 'Em breve', encerrada: 'Encerrada' }
var CLASSE_STATUS = { aberta: 'aberto', em_breve: 'em-breve', encerrada: 'encerrado' }

function nomeCategoria(valor) {
  var achada = CATEGORIAS.find(function (c) {
    return c.valor === valor
  })
  return achada ? achada.nome : valor
}

// a API devolve "2026-10-01T00:00:00.000Z"; mostra 01/10/2026 sem mexer no fuso
function formatarData(texto) {
  var partes = String(texto).slice(0, 10).split('-')
  return partes[2] + '/' + partes[1] + '/' + partes[0]
}

function Oportunidades() {
  var navegar = useNavigate()
  var [categoria, setCategoria] = useState('')
  var [status, setStatus] = useState('')
  var [oportunidades, setOportunidades] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    var cancelado = false
    setCarregando(true)
    setErro('')
    listarOportunidades({ categoria: categoria, status: status })
      .then(function (lista) {
        if (cancelado) return
        // abertas primeiro, depois em breve e por último as encerradas (dentro de cada grupo, por data)
        var ordem = { aberta: 0, em_breve: 1, encerrada: 2 }
        lista.sort(function (a, b) {
          return ordem[a.status] - ordem[b.status]
        })
        setOportunidades(lista)
        setCarregando(false)
      })
      .catch(function (e) {
        if (cancelado) return
        setErro(e.message)
        setCarregando(false)
      })
    return function () {
      cancelado = true
    }
  }, [categoria, status])

  return (
    <>
      <Header />

      <main className="pagina-oportunidades">
        <button
          className="botao-voltar"
          onClick={function () {
            navegar(-1)
          }}
          aria-label="Voltar"
        >
          ←
        </button>
        <section className="cabecalho-oportunidades">
          <h1>Oportunidades e editais</h1>
          <p>
            Confira intercâmbios, programas de dupla titulação e programas
            internacionais, com o período de inscrição de cada um.
          </p>

          <div className="grupo-filtros-oportunidades">
            <span className="rotulo-filtro-oportunidades">Categoria</span>
            <div className="filtros-oportunidades" role="group" aria-label="Filtrar por categoria">
              {CATEGORIAS.map(function (item) {
                return (
                  <button
                    type="button"
                    key={item.valor}
                    aria-pressed={categoria === item.valor}
                    className={categoria === item.valor ? 'filtro-oportunidade ativo' : 'filtro-oportunidade'}
                    onClick={function () {
                      setCategoria(item.valor)
                    }}
                  >
                    {item.nome}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grupo-filtros-oportunidades">
            <span className="rotulo-filtro-oportunidades">Situação</span>
            <div className="filtros-oportunidades" role="group" aria-label="Filtrar por situação">
              {STATUS.map(function (item) {
                return (
                  <button
                    type="button"
                    key={item.valor}
                    aria-pressed={status === item.valor}
                    className={status === item.valor ? 'filtro-oportunidade ativo' : 'filtro-oportunidade'}
                    onClick={function () {
                      setStatus(item.valor)
                    }}
                  >
                    {item.nome}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="lista-oportunidades" aria-live="polite">
          {erro && <p className="sem-oportunidades" role="alert">{erro}</p>}

          {carregando && !erro && <p className="sem-oportunidades">Carregando oportunidades...</p>}

          {!carregando && !erro && oportunidades.length === 0 && (
            <p className="sem-oportunidades">
              Nenhuma oportunidade encontrada com esses filtros.
            </p>
          )}

          {!carregando && !erro && oportunidades.length > 0 && (
            <p className="contagem-oportunidades">
              {oportunidades.length} {oportunidades.length === 1 ? 'oportunidade encontrada' : 'oportunidades encontradas'}
            </p>
          )}

          {!carregando && !erro && oportunidades.map(function (oportunidade) {
            return (
              <article className="card-oportunidade" key={oportunidade.id_oportunidade}>
                <div className="texto-oportunidade">
                  <span className="categoria-oportunidade">
                    {nomeCategoria(oportunidade.categoria).toUpperCase()}
                  </span>
                  <h2>{oportunidade.titulo}</h2>
                  <p>{oportunidade.descricao}</p>

                  {oportunidade.requisitos && (
                    <p className="requisitos-oportunidade">
                      <strong>Requisitos:</strong> {oportunidade.requisitos}
                    </p>
                  )}

                  <div className="detalhes-oportunidade">
                    <span>
                      Inscrições: {formatarData(oportunidade.data_inicio)} a {formatarData(oportunidade.data_fim)}
                    </span>
                    {oportunidade.universidade && (
                      <Link to={'/universidades/' + oportunidade.universidade.id_universidade}>
                        {oportunidade.universidade.nome}
                      </Link>
                    )}
                    {oportunidade.fonte_oficial && (
                      <a href={oportunidade.fonte_oficial} target="_blank" rel="noopener noreferrer">
                        Fonte oficial ↗
                      </a>
                    )}
                  </div>
                </div>

                <span className={'status-oportunidade ' + CLASSE_STATUS[oportunidade.status]}>
                  {NOME_STATUS[oportunidade.status]}
                </span>
              </article>
            )
          })}
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Oportunidades

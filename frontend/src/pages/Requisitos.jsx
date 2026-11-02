import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import { listarRequisitos } from '../services/api'
import './Conteudo.css'

function Requisitos() {
  var [requisitos, setRequisitos] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    listarRequisitos()
      .then(function (lista) {
        setRequisitos(lista)
        setCarregando(false)
      })
      .catch(function (e) {
        setErro(e.message)
        setCarregando(false)
      })
  }, [])

  return (
    <>
      <Header />

      <main className="pagina-conteudo">
        <section className="cabecalho-conteudo">
          <h1>Requisitos para participar</h1>
          <p>
            Critérios gerais para participar dos programas de mobilidade acadêmica.
            Cada edital pode ter exigências próprias: confira sempre o edital do programa.
          </p>
        </section>

        <section className="corpo-conteudo">
          {erro && <p className="aviso-conteudo" role="alert">{erro}</p>}
          {carregando && <p className="aviso-conteudo">Carregando requisitos...</p>}
          {!carregando && !erro && requisitos.length === 0 && (
            <p className="aviso-conteudo">Nenhum requisito cadastrado ainda.</p>
          )}

          {requisitos.length > 0 && (
            <ol className="lista-conteudo">
              {requisitos.map(function (requisito, indice) {
                return (
                  <li className="card-conteudo" key={requisito.id_conteudo}>
                    <h3>
                      <span className="numero-conteudo">{indice + 1}</span>
                      {requisito.titulo}
                    </h3>
                    {requisito.descricao && <p>{requisito.descricao}</p>}
                  </li>
                )
              })}
            </ol>
          )}

          <p>
            <Link to="/elegibilidade" className="botao-conteudo">
              Verificar minha elegibilidade →
            </Link>
          </p>
          <p className="meta-conteudo">
            Ficou com dúvida? <Link to="/contatos">Fale com a coordenação de intercâmbio</Link>
          </p>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Requisitos

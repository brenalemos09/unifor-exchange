import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
import { listarContatos } from '../services/api'
import './Conteudo.css'

// transforma o contato em link: e-mail, telefone ou site
function linkDoContato(contato) {
  if (contato.includes('@')) return 'mailto:' + contato
  if (/^https?:\/\//.test(contato)) return contato
  if (/^[\d\s()+-]+$/.test(contato)) return 'tel:' + contato.replace(/[^\d+]/g, '')
  return null
}

function Contatos() {
  var [contatos, setContatos] = useState([])
  var [carregando, setCarregando] = useState(true)
  var [erro, setErro] = useState('')

  useEffect(function () {
    listarContatos()
      .then(function (lista) {
        setContatos(lista)
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
          <h1>Contato e suporte</h1>
          <p>
            Canais oficiais da UNIFOR para tirar dúvidas sobre programas,
            prazos e documentação de intercâmbio.
          </p>
        </section>

        <section className="corpo-conteudo">
          {erro && <p className="aviso-conteudo" role="alert">{erro}</p>}
          {carregando && <p className="aviso-conteudo">Carregando contatos...</p>}
          {!carregando && !erro && contatos.length === 0 && (
            <p className="aviso-conteudo">Nenhum contato cadastrado ainda.</p>
          )}

          <div className="grade-contatos">
            {contatos.map(function (contato) {
              var link = contato.contato ? linkDoContato(contato.contato) : null
              return (
                <article className="card-conteudo" key={contato.id_conteudo}>
                  <h3>{contato.titulo}</h3>
                  {contato.descricao && <p>{contato.descricao}</p>}
                  {contato.contato && (link ? (
                    <a
                      className="contato-conteudo"
                      href={link}
                      {...(link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {contato.contato}
                    </a>
                  ) : (
                    <span className="contato-conteudo">{contato.contato}</span>
                  ))}
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}

export default Contatos

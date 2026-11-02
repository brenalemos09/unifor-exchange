import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/Header'
import {
    alternarFavorito,
    verificarFavorito,
} from '../utils/favoritos'
import './DetalhesUniversidade.css'

function DetalhesUniversidade() {
    var { slug } = useParams()
    var navegar = useNavigate()
    var [favorita, setFavorita] = useState(verificarFavorito(slug))

    var universidades = {
        'berlin-school': {
            nome: 'Berlin School of Economics and Law',
            cidade: 'Berlin, Alemanha',
            pais: 'Alemanha',
            idioma: 'Inglês',
            modalidade: 'Presencial',
        },
        'santiago-compostela': {
            nome: 'Universidad de Santiago de Compostela',
            cidade: 'Santiago de Compostela, Espanha',
            pais: 'Espanha',
            idioma: 'Espanhol',
            modalidade: 'Presencial',
        },
        'universite-rouen': {
            nome: 'Université de Rouen',
            cidade: 'Rouen, França',
            pais: 'França',
            idioma: 'Francês',
            modalidade: 'Presencial',
        },
        'xiamen-university': {
            nome: 'Xiamen University',
            cidade: 'Xiamen, China',
            pais: 'China',
            idioma: 'Inglês',
            modalidade: 'Presencial',
        },
        'universidade-minho': {
            nome: 'Universidade do Minho',
            cidade: 'Braga, Portugal',
            pais: 'Portugal',
            idioma: 'Português',
            modalidade: 'Presencial',
        },
        'ben-gurion': {
            nome: 'Ben-Gurion University of the Negev',
            cidade: 'Beer-Sheva, Israel',
            pais: 'Israel',
            idioma: 'Inglês',
            modalidade: 'Presencial',
        },
        'diego-portales': {
            nome: 'Universidad Diego Portales',
            cidade: 'Santiago, Chile',
            pais: 'Chile',
            idioma: 'Espanhol',
            modalidade: 'Presencial',
        },
        'rotterdam-university': {
            nome: 'Rotterdam University of Applied Sciences',
            cidade: 'Rotterdam, Holanda',
            pais: 'Holanda',
            idioma: 'Inglês',
            modalidade: 'Presencial',
        },
        'kyonggi-university': {
            nome: 'Kyonggi University',
            cidade: 'Suwon, Coreia do Sul',
            pais: 'Coreia do Sul',
            idioma: 'Inglês',
            modalidade: 'Presencial',
        },
    }

    var universidade = universidades[slug]

    if (!universidade) {
        return (
            <main className="detalhes-universidade">
                <h1>Universidade não encontrada</h1>
                <Link to="/universidades">Voltar ao catálogo</Link>
            </main>
        )
    }

    return (
        <>
            <Header />

            <button
                className="botao-voltar"
                onClick={function () {
                    navegar(-1)
                }}
                aria-label="Voltar"
            >
                ←
            </button>

            <div className="caminho-detalhes">
                <Link to="/universidades">Universidades</Link>
                <span>/</span>
                <span>{universidade.nome}</span>
            </div>

            <div className="banner-detalhes"></div>

            <main className="pagina-detalhes">
                <section className="conteudo-detalhes">
                    <div className="identificacao-detalhes">
                        <h1>{universidade.nome}</h1>
                        <p>{universidade.cidade}</p>

                        <div className="etiquetas-detalhes">
                            <span>{universidade.pais}</span>
                            <span>{universidade.modalidade}</span>
                            <span>{universidade.idioma}</span>
                        </div>

                        <div className="acoes-detalhes">
                            <button
                                type="button"
                                className="botao-favoritar"
                                onClick={function () {
                                    alternarFavorito({
                                        ...universidade,
                                        slug: slug,
                                    })

                                    setFavorita(verificarFavorito(slug))
                                }}
                            >
                                {favorita ? '♥ Favoritado' : '♡ Favoritar'}
                            </button>

                            <button
                                type="button"
                                className="botao-site-oficial"
                                disabled
                                title="O endereço oficial ainda não foi cadastrado"
                            >
                                Ver site oficial ↗
                            </button>
                        </div>
                    </div>

                    <section className="secao-sobre">
                        <h2>Sobre a universidade</h2>
                        <p>
                            Conheça a instituição, sua localização e as possibilidades
                            de intercâmbio disponíveis por meio do convênio com a UNIFOR.
                        </p>
                    </section>

                    <section className="secao-cursos">
                        <h2>Cursos e áreas de interesse</h2>
                        <p>
                            Consulte as áreas e os cursos disponíveis para esta instituição
                            de acordo com o convênio vigente.
                        </p>
                    </section>

                    <section className="secao-requisitos">
                        <h2>Requisitos para candidatura</h2>
                        <ul>
                            <li>Verificar os critérios de participação no edital.</li>
                            <li>Conferir os requisitos acadêmicos da instituição.</li>
                            <li>Observar as exigências de proficiência no idioma.</li>
                            <li>Consultar os prazos e documentos necessários.</li>
                        </ul>
                    </section>
                </section>

                <aside className="resumo-detalhes">
                    <h2>Resumo rápido</h2>

                    <div className="item-resumo">
                        <span>Universidade</span>
                        <strong>{universidade.nome}</strong>
                    </div>

                    <div className="item-resumo">
                        <span>País</span>
                        <strong>{universidade.pais}</strong>
                    </div>

                    <div className="item-resumo">
                        <span>Idioma</span>
                        <strong>{universidade.idioma}</strong>
                    </div>

                    <div className="item-resumo">
                        <span>Modalidade</span>
                        <strong>{universidade.modalidade}</strong>
                    </div>

                    <div className="item-resumo">
                        <span>Duração</span>
                        <strong>A consultar</strong>
                    </div>
                </aside>
            </main>

            <footer className="rodape-detalhes">
                <p>
                    UNIFOR Exchange — plataforma de apoio à orientação.
                    Não substitui os processos oficiais da UNIFOR.
                </p>

                <nav>
                    <Link to="/universidades">Perguntas</Link>
                    <Link to="/universidades">Contato e Suporte</Link>
                    <Link to="/universidades">Experiências de Estudantes</Link>
                </nav>
            </footer>
        </>
    )
}

export default DetalhesUniversidade
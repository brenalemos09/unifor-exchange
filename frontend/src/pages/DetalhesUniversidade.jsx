import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import {
    buscarUniversidade,
    estaLogado,
    listarFavoritos,
    favoritar,
    desfavoritar,
} from '../services/api'
import './DetalhesUniversidade.css'

function DetalhesUniversidade() {
    var { id } = useParams()
    var navegar = useNavigate()
    var localizacao = useLocation()
    var [favorita, setFavorita] = useState(false)
    var [salvandoFavorito, setSalvandoFavorito] = useState(false)
    var [dados, setDados] = useState(null)
    var [carregando, setCarregando] = useState(true)

    useEffect(function () {
        setCarregando(true)
        buscarUniversidade(id)
            .then(function (u) {
                setDados(u)
                setCarregando(false)
            })
            .catch(function () {
                setDados(null)
                setCarregando(false)
            })
    }, [id])

    useEffect(function () {
        if (!estaLogado()) return
        listarFavoritos()
            .then(function (lista) {
                setFavorita(lista.some(function (f) {
                    return String(f.id_universidade) === String(id)
                }))
            })
            .catch(function () {})
    }, [id])

    async function clicarFavorito() {
        if (!estaLogado()) {
            navegar('/login', { state: { de: localizacao.pathname } })
            return
        }
        setSalvandoFavorito(true)
        try {
            if (favorita) await desfavoritar(id)
            else await favoritar(id)
            setFavorita(!favorita)
        } catch (e) {
            window.alert(e.message)
        }
        setSalvandoFavorito(false)
    }

    if (carregando) {
        return (
            <main className="detalhes-universidade">
                <p>Carregando...</p>
            </main>
        )
    }

    if (!dados) {
        return (
            <main className="detalhes-universidade">
                <h1>Universidade não encontrada</h1>
                <Link to="/universidades">Voltar ao catálogo</Link>
            </main>
        )
    }

    var universidade = {
        nome: dados.nome,
        cidade: dados.cidade + ', ' + dados.pais,
        pais: dados.pais,
        idioma: dados.idiomas.join(', ') || 'A consultar',
        modalidade: dados.modalidades.join(', ') || 'A consultar',
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
                                onClick={clicarFavorito}
                                disabled={salvandoFavorito}
                                aria-pressed={favorita}
                                title={estaLogado() ? '' : 'Entre para salvar favoritos'}
                            >
                                {favorita ? '♥ Favoritado' : '♡ Favoritar'}
                            </button>

                            <button
                                type="button"
                                className="botao-site-oficial"
                                disabled={!dados.fonte_oficial}
                                title={dados.fonte_oficial ? 'Abrir fonte oficial' : 'O endereço oficial ainda não foi cadastrado'}
                                onClick={function () {
                                    if (dados.fonte_oficial) window.open(dados.fonte_oficial, '_blank', 'noopener')
                                }}
                            >
                                Ver site oficial ↗
                            </button>
                        </div>
                    </div>

                    <section className="secao-sobre">
                        <h2>Sobre a universidade</h2>
                        <p>
                            {dados.descricao ||
                                'Conheça a instituição, sua localização e as possibilidades de intercâmbio disponíveis por meio do convênio com a UNIFOR.'}
                        </p>
                        {dados.informacoes_convenio && <p>{dados.informacoes_convenio}</p>}
                    </section>

                    <section className="secao-cursos">
                        <h2>Cursos e áreas de interesse</h2>
                        {dados.cursos.length > 0 ? (
                            <ul>
                                {dados.cursos.map(function (curso) {
                                    return <li key={curso}>{curso}</li>
                                })}
                            </ul>
                        ) : (
                            <p>
                                Consulte as áreas e os cursos disponíveis para esta instituição
                                de acordo com o convênio vigente.
                            </p>
                        )}
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
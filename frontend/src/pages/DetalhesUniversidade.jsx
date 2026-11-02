import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Rodape from '../components/Rodape'
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
    var [erro, setErro] = useState('')

    useEffect(function () {
        setCarregando(true)
        setErro('')
        buscarUniversidade(id)
            .then(function (u) {
                setDados(u)
                setCarregando(false)
            })
            .catch(function (e) {
                setDados(null)
                setErro(e.message)
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

    if (carregando || !dados) {
        return (
            <>
                <Header />
                <main className="pagina-detalhes estado-detalhes">
                    {carregando ? (
                        <p>Carregando universidade...</p>
                    ) : (
                        <div>
                            <h1>{erro || 'Universidade não encontrada.'}</h1>
                            <Link to="/universidades">Voltar ao catálogo</Link>
                        </div>
                    )}
                </main>
                <Rodape />
            </>
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
                        <h2>Oportunidades nesta universidade</h2>
                        {dados.oportunidades.length > 0 ? (
                            <ul>
                                {dados.oportunidades.map(function (o) {
                                    return (
                                        <li key={o.id_oportunidade}>
                                            {o.titulo}{' '}
                                            <span className={'situacao-detalhes ' + o.status}>
                                                {{ aberta: 'Inscrições abertas', em_breve: 'Em breve', encerrada: 'Encerrada' }[o.status]}
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <p>Nenhuma oportunidade cadastrada para esta universidade no momento.</p>
                        )}
                        <p>
                            <Link to="/oportunidades">Ver todas as oportunidades</Link>
                            {' · '}
                            <Link to="/requisitos">Requisitos para candidatura</Link>
                            {' · '}
                            <Link to="/elegibilidade">Verificar elegibilidade</Link>
                        </p>
                    </section>

                    <section className="secao-relatos-detalhes">
                        <h2>
                            Experiências de estudantes
                            {dados.nota_media !== null && (
                                <span className="nota-media-detalhes">Nota média {dados.nota_media}</span>
                            )}
                        </h2>
                        {dados.relatos.length > 0 ? (
                            dados.relatos.slice(0, 3).map(function (relato) {
                                return (
                                    <article className="relato-detalhes" key={relato.id_experiencia}>
                                        <strong>{relato.titulo}</strong>
                                        <p>{relato.texto}</p>
                                        <span>
                                            Por {relato.autor}
                                            {relato.nota !== null && ' · nota ' + relato.nota}
                                        </span>
                                    </article>
                                )
                            })
                        ) : (
                            <p>Ainda não há relatos sobre esta universidade.</p>
                        )}
                        <p>
                            <Link to={'/relatos?universidade=' + id}>
                                {dados.relatos.length > 3 ? 'Ver todos os relatos' : 'Ver relatos e compartilhar o seu'} →
                            </Link>
                        </p>
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

            <Rodape />
        </>
    )
}

export default DetalhesUniversidade
import React, { useState } from "react";
import './css/vigilanciaMeioAmbiente.css';

function VigilanciaMeioAmbiente() {

    const [showNotificacoesInfo, setShowNotificacoesInfo] = useState(false);
    const [showMortalidadeInfo, setShowMortalidadeInfo] = useState(false);

    const [viewAtiva, setViewAtiva] = useState('lista');

    const toggleNotificacoesInfo = () => {
        setShowNotificacoesInfo(!showNotificacoesInfo);
    };

    const toggleMortalidadeInfo = () => {
        setShowMortalidadeInfo(!showMortalidadeInfo);
    }

    return (

        <div className="container my-3">

            <h1>Vigilância e Meio Ambiente</h1>

            <hr />

            {viewAtiva === 'lista' && (

                <div>

                    <h5>Informações que podem ser consultadas nesta aba: </h5>
                    
                    <ul>
                        <li>

                            <a
                            href=""
                            onClick={(e) => {
                                    e.preventDefault();
                                    setViewAtiva('graficoNotificacoes')    
                                }}
                            className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                                Notificações de Síndrome Gripal Leve (2020 - 2024)
                            </a>
                            
                            <i
                            className="bi bi-caret-down ms-1"
                            id="notificacoes-sindrome-gripal-leve-desc-btn"
                            onClick={toggleNotificacoesInfo}
                            ></i>
                            
                            <br />

                            <p
                            className={`p-2 mt-2 rounded border border-2 bg-secondary-subtle ${showNotificacoesInfo ? "" : "d-none"}`}
                            id="notificacoes-sindrome-gripal-leve-info">
                                Base de dados de SG de casos leves e moderados suspeitos de covid-19, a partir da incorporação do sistema e-SUS Notifica de 2020 a 2024
                                <br />

                                <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    setViewAtiva('graficoNotificacoes')    
                                }}
                                >Visualizar Gráficos.</a>

                            </p>
                            
                        </li>
                        <li>
                            <a
                            href=""
                            onClick={(e) => {
                                e.preventDefault();
                                setViewAtiva('graficoMortalidade')    
                            }}
                            className="link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
                                Informações sobre Mortalidade
                            </a>
                            <i
                            className="bi bi-caret-down ms-1"
                            id="mortalidade-desc-btn"
                            onClick={toggleMortalidadeInfo}
                            >
                            </i>

                            <br />

                            <p className={`p-2 mt-2 rounded border border-2 bg-secondary-subtle ${showMortalidadeInfo ? "" : "d-none"}`}>
                                O Sistema de Informação sobre Mortalidade (SIM), desenvolvido pelo Ministério da Saúde em 1975, é produto da unificação de mais de quarenta modelos de Declaração de Óbito utilizados ao longo dos anos, para coletar dados sobre mortalidade no país
                                <br />
                                
                                <a
                                href=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    setViewAtiva('graficoMortalidade')    
                                }}
                                >Visualizar Gráficos.</a>

                            </p>
                        </li>   
                    </ul>
                </div>

            )}

            {/* VISUALIZACAO DE GRAFICO DE NOTIFICACOES DE SINDROME GRIPAL LEVE */}
            {viewAtiva === 'graficoNotificacoes' && (
                <div>

                    {/* BACK BUTTON */}
                    <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        setViewAtiva('lista');
                    }}
                    className="btn btn-outline-light btn-sm mb-3"
                    >
                        <i className="bi bi-arrow-left me-2"></i>Voltar
                    </a>

                    <h4>Gráfico de Notificações de Síndrome Gripal Leve (2020 - 2024)</h4>
                    <p>Gráfico</p>
                    
                </div>
            )}

            {/* VISUALIZACAO DE GRAFICO DE MORTALIDADE */}
            {viewAtiva === 'graficoMortalidade' && (
                <div>

                    {/* BACK BUTTON */}
                    <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        setViewAtiva('lista');
                    }}
                    className="btn btn-outline-light btn-sm mb-3"
                    >
                        <i className="bi bi-arrow-left me-2"></i>Voltar
                    </a>

                    <h4>Gráfico de Sistema de Informação sobre Mortalidade</h4>
                    <p>Gráfico</p>
                    
                </div>
            )}

        </div>
    );

}

export default VigilanciaMeioAmbiente;
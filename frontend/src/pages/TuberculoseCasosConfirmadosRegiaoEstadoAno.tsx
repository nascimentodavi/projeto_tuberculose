import { useState, useEffect, useMemo } from "react";
import Plot from "react-plotly.js";
import type { Data, Layout } from "plotly.js";

interface TuberculoseData {
  regiao: string;
  uf: string;
  ano: number;
  casos: number;
}

function TuberculoseCasosConfirmadosRegiaoEstadoAno() {
  const [allData, setAllData] = useState<TuberculoseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FILTROS
  const [filterRegiao, setFilterRegiao] = useState<string>("Todas");
  const [filterUF, setFilterUF] = useState<string>("Todas");
  const [anoInicio, setAnoInicio] = useState<string>("Todos");
  const [anoFim, setAnoFim] = useState<string>("Todos");
  const [agrupamento, setAgrupamento] = useState<"uf" | "regiao">("uf");
  const [tipoVisualizacao, setTipoVisualizacao] = useState<"acumulado" | "ano">(
    "acumulado"
  );

  // ESTADO API IA
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const CSHARP_API_BASE_URL = import.meta.env.VITE_CSHARP_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${CSHARP_API_BASE_URL}/charts/tuberculose/casos_confirmados_tuberculose_regiao_estado_ano/`
        );

        if (!response.ok)
          throw new Error(`Erro ao buscar dados (${response.status})`);

        const data: TuberculoseData[] = await response.json();
        setAllData(data);
      } catch (e) {
        console.error("Erro ao buscar dados:", e);
        setError(
          e instanceof Error ? e.message : "Ocorreu um erro ao carregar os dados."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [CSHARP_API_BASE_URL]);
  
  const { regioes, ufs, anos } = useMemo(() => {
    const regioesSet = new Set<string>();
    const ufsSet = new Set<string>();
    const anosSet = new Set<number>();
    allData.forEach((item) => {
      regioesSet.add(item.regiao);
      ufsSet.add(item.uf);
      anosSet.add(item.ano);
    });
    return {
      regioes: Array.from(regioesSet).sort(),
      ufs: Array.from(ufsSet).sort(),
      anos: Array.from(anosSet).sort((a, b) => a - b),
    };
  }, [allData]);

  const filteredUFs = useMemo(() => {
    if (filterRegiao === "Todas") return ufs;
    const ufsDaRegiao = allData
      .filter((d) => d.regiao === filterRegiao)
      .map((d) => d.uf);
    return Array.from(new Set(ufsDaRegiao)).sort();
  }, [allData, filterRegiao, ufs]);

  const filteredData = useMemo(() => {
    if (!allData.length) return [];

    let dados = [...allData];
    if (filterRegiao !== "Todas")
      dados = dados.filter((d) => d.regiao === filterRegiao);
    if (filterUF !== "Todas") dados = dados.filter((d) => d.uf === filterUF);
    if (anoInicio !== "Todos") dados = dados.filter((d) => d.ano >= +anoInicio);
    if (anoFim !== "Todos") dados = dados.filter((d) => d.ano <= +anoFim);

    return dados;
  }, [allData, filterRegiao, filterUF, anoInicio, anoFim]);

  const chartData = useMemo((): { data: Data[]; layout: Partial<Layout> } => {
    if (!filteredData.length) return { data: [], layout: {} };

    const layoutBase: Partial<Layout> = {
      title: {
        text: "Casos Confirmados de Tuberculose",
        font: { color: "#fff" },
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { color: "#f8f9fa" },
      autosize: true,
      margin: { l: 60, r: 30, b: 80, t: 60 },
      yaxis: { title: { text: "Casos" }, tickfont: { color: "#ccc" } },
    };

    if (tipoVisualizacao === "acumulado") {
      const eixoX = agrupamento === "uf" ? "Estado (UF)" : "Região";
      const agrupados = filteredData.reduce((acc, item) => {
        const chave = item[agrupamento];
        acc[chave] = (acc[chave] || 0) + item.casos;
        return acc;
      }, {} as Record<string, number>);

      const dadosGrafico = Object.entries(agrupados)
        .map(([chave, casos]) => ({ chave, casos }))
        .sort((a, b) => b.casos - a.casos);

      return {
        data: [
          {
            type: "bar",
            x: dadosGrafico.map((d) => d.chave),
            y: dadosGrafico.map((d) => d.casos),
            text: dadosGrafico.map((d) => d.casos.toLocaleString("pt-BR")),
            textposition: "outside",
            marker: { color: "#0dcaf0" },
          },
        ],
        layout: {
          ...layoutBase,
          xaxis: { title: { text: eixoX }, tickfont: { color: "#ccc" } },
          barmode: "group",
        },
      };
    } else {
      const series: Record<string, Record<string, number>> = {};
      const anosSet = new Set<string>();

      // Usamos 'filteredData' aqui
      filteredData.forEach((item) => {
        const grupoChave = item[agrupamento];
        const anoChave = item.ano.toString();

        if (!series[grupoChave]) {
          series[grupoChave] = {};
        }
        series[grupoChave][anoChave] =
          (series[grupoChave][anoChave] || 0) + item.casos;
        anosSet.add(anoChave);
      });

      const anosOrdenados = Array.from(anosSet).sort();
      const plotData: Data[] = [];

      const gruposOrdenados = Object.keys(series).sort();

      for (const grupoNome of gruposOrdenados) {
        const x_values: string[] = [];
        const y_values: number[] = [];

        for (const ano of anosOrdenados) {
          x_values.push(ano);
          y_values.push(series[grupoNome][ano] || 0);
        }

        plotData.push({
          type: "scatter",
          mode: "lines+markers",
          name: grupoNome,
          x: x_values,
          y: y_values,
          text: y_values.map((v) => v.toLocaleString("pt-BR")),
          hovertemplate: "<b>%{name}</b><br>%{x}: %{y:,.0f} casos<extra></extra>",
        });
      }

      const legendaVisivel = plotData.length <= 15;

      return {
        data: plotData,
        layout: {
          ...layoutBase,
          xaxis: { title: { text: "Ano" }, tickfont: { color: "#ccc" } },
          hovermode: "x unified",
          showlegend: legendaVisivel,
        },
      };
    }
  }, [
    filteredData,
    agrupamento,
    tipoVisualizacao,
  ]);

  const resetFilters = () => {
    setFilterRegiao("Todas");
    setFilterUF("Todas");
    setAnoInicio("Todos");
    setAnoFim("Todos");
    setAgrupamento("uf");
    setTipoVisualizacao("acumulado");
    setInsight("");
  };

  const handleExplainData = async () => {
    setLoadingInsight(true);
    setInsight("");
    try {

      // ENVIA OS DADOS FILTRADOS PARA A ANÁLISE
      const payload = {
        theme: "tuberculose",
        data: filteredData,
        question: "Explique os dados filtrados de forma simples e resumida",
      };

      const LLM_API_URL = `${CSHARP_API_BASE_URL}/charts/llm/explain`;

      const response = await fetch(LLM_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Erro LLM (${response.status})`);
      const result = await response.json();
      setInsight(result.answer || "Nenhuma resposta gerada.");
    } catch (e) {
      console.error(e);
      setInsight("Erro ao gerar insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="container py-4">
      <header className="text-center p-3 mb-4 bg-dark text-white rounded shadow-sm">
        <h1 className="h4">Dashboard Interativo de Casos de Tuberculose</h1>
      </header>

      {/* FILTROS */}
      <div className="accordion" id="accordionFilters">
        <div className="accordion-item bg-dark text-white border-secondary">
          <h2 className="accordion-header">
            <button
              className="accordion-button bg-dark text-white"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFilters"
            >
              Filtros
            </button>
          </h2>
          <div
            id="collapseFilters"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionFilters"
          >
            <div className="accordion-body">
              {/* === FILTROS EXISTENTES === */}
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">Região</label>
                  <select
                    className="form-select"
                    value={filterRegiao}
                    onChange={(e) => {
                      setFilterRegiao(e.target.value);
                      setFilterUF("Todas");
                    }}
                  >
                    <option value="Todas">Todas</option>
                    {regioes.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Estado (UF)</label>
                  <select
                    className="form-select"
                    value={filterUF}
                    onChange={(e) => setFilterUF(e.target.value)}
                  >
                    <option value="Todas">Todos</option>
                    {filteredUFs.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="my-4" />
              <h5>Filtros Avançados</h5>

              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Ano Início</label>
                  <select
                    className="form-select"
                    value={anoInicio}
                    onChange={(e) => setAnoInicio(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    {anos.map((ano) => (
                      <option key={ano} value={ano}>
                        {ano}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Ano Fim</label>
                  <select
                    className="form-select"
                    value={anoFim}
                    onChange={(e) => setAnoFim(e.target.value)}
                  >
                    <option value="Todos">Todos</option>
                    {anos.map((ano) => (
                      <option key={ano} value={ano}>
                        {ano}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Agrupar por</label>
                  <div className="form-control bg-transparent border-0">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="agrupamento"
                        id="agrupar-uf"
                        value="uf"
                        checked={agrupamento === "uf"}
                        onChange={() => setAgrupamento("uf")}
                      />
                      <label className="form-check-label" htmlFor="agrupar-uf">
                        Estado
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="agrupamento"
                        id="agrupar-regiao"
                        value="regiao"
                        checked={agrupamento === "regiao"}
                        onChange={() => setAgrupamento("regiao")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="agrupar-regiao"
                      >
                        Região
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Visualização</label>
                  <div className="form-control bg-transparent border-0">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="visualizacao"
                        value="acumulado"
                        checked={tipoVisualizacao === "acumulado"}
                        onChange={() => setTipoVisualizacao("acumulado")}
                      />
                      <label className="form-check-label">Total</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="visualizacao"
                        value="ano"
                        checked={tipoVisualizacao === "ano"}
                        onChange={() => setTipoVisualizacao("ano")}
                      />
                      <label className="form-check-label">Por Ano</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTOES */}
              <div className="d-flex justify-content-end mt-4 gap-2">
                <button className="btn btn-outline-info" onClick={resetFilters}>
                  Limpar Filtros
                </button>
                <button
                  className="btn btn-outline-warning"
                  onClick={handleExplainData}
                  disabled={loadingInsight}
                >
                  {loadingInsight ? "Gerando..." : "Gerar Insight"}
                </button>
              </div>

              {/* INSIGHT */}
              {insight && (
                <div className="alert alert-secondary mt-3" role="alert">
                  <strong>Insight:</strong> {insight}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GRÁFICO */}
      <div
        className="card bg-dark text-white shadow mt-4"
        style={{ minHeight: "36rem" }}
      >
        <div
          className="card-body d-flex justify-content-center align-items-center"
          style={{ flex: 1 }}
        >
          {loading ? (
            <div className="text-center">
              <div
                className="spinner-border text-info"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              />
              <p className="mt-2">Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              <strong>Erro:</strong> {error}
            </div>
          ) : (
            <Plot
              key={`${tipoVisualizacao}-${agrupamento}-${filterRegiao}-${filterUF}-${anoInicio}-${anoFim}`}
              data={chartData.data}
              layout={chartData.layout}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
              config={{ responsive: true, displaylogo: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TuberculoseCasosConfirmadosRegiaoEstadoAno;
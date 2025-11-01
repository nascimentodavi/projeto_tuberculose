import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

const CSHARP_API_BASE_URL = import.meta.env.VITE_CSHARP_API_BASE_URL;

interface PlotlyChart {
  data: Data[];
  layout: Partial<Layout>;
}

function CovidOcupacaoHospitalar() {
  const [chartData, setChartData] = useState<PlotlyChart | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null);

      try {
        const response = await fetch(`${CSHARP_API_BASE_URL}/charts/registro_ocupacao_hospitalar/${chartType}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha na API: ${response.status} - ${errorText}`);
        }

        const data: PlotlyChart = await response.json();
        setChartData(data);

      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chartType]);

  return (
    <div className="container py-4">
      <header className="text-center p-3 mb-4 bg-dark text-white rounded shadow-sm">
        <h1 className="h4">Dashboard de Ocupação Hospitalar (COVID-19) em 2021</h1>
      </header>

      <div className="d-flex justify-content-center gap-3 mb-4">

        {/* GRAFICO DE BARRAS */}
        <button
          className={`btn btn-outline-info ${chartType === 'bar' ? 'active' : ''}`}
          onClick={() => setChartType('bar')}
        >
          Barras
        </button>
        
        {/* GRAFICO DE LINHAS */}
        <button
          className={`btn btn-outline-info ${chartType === 'line' ? 'active' : ''}`}
          onClick={() => setChartType('line')}
        >
          Linha
        </button>
        
      </div>

      {/* Gráfico */}
      <div className="card bg-dark text-white shadow" style={{ minHeight: '36rem' }}>

        <div className="card-body d-flex justify-content-center align-items-center">

          {loading && (
            <div className="text-center">
              <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} />
              <p className="mt-2">Carregando dados...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">Erro: {error}</div>}

          {chartData && !loading && !error && (
            <Plot
              key={chartType}
              data={chartData.data}
              layout={{
                ...chartData.layout,
                autosize: true,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: { color: '#f8f9fa' },
                margin: {
                  l: 60,
                  r: 30,
                  b: 80,
                  t: 60
                },
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
              useResizeHandler
              config={{ responsive: true, displaylogo: false }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CovidOcupacaoHospitalar;

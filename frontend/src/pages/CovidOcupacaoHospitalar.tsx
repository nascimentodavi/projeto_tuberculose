import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout } from 'plotly.js';

// ROTA DO SERVIÇO DO BACKEND
const CSHARP_API_BASE_URL = import.meta.env.VITE_CSHARP_API_BASE_URL;

// INTERFACE PARA ESPECIFICAR OS TIPOS DE DADOS
interface PlotlyChart {
  data: Data[];
  layout: Partial<Layout>;
}

function CovidOcupacaoHospitalar() {
  const [chartData, setChartData] = useState<PlotlyChart | null>(null);
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null);

      try {
        const apiUrl = `${CSHARP_API_BASE_URL}/charts/registro_ocupacao_hospitalar/${chartType}`;
        const response = await fetch(apiUrl, {
          method: 'GET'
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha na API: ${response.status} - ${errorText}`);
        }

        const data: PlotlyChart = await response.json();
        setChartData(data);

      } catch (e) {
        console.error("Erro ao buscar dados do gráfico:", e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Ocorreu um erro desconhecido.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [chartType]);

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <header className="text-center p-6 bg-slate-800 shadow-lg">
        <h1 className="text-3xl font-bold text-sky-400">
          Dashboard de Ocupação Hospitalar (COVID-19)
        </h1>
      </header>

      <nav className="flex justify-center items-center gap-4 p-4 mt-4">
        <h2 className="text-lg mr-4">Selecione o tipo de Gráfico:</h2>
        
        <button
          onClick={() => setChartType('bar')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors ${
            chartType === 'bar' ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          Barras
        </button>
      </nav>

      <main className="container mx-  auto p-4">
        <div className="flex justify-center items-center h-[32rem] mt-4">
          {loading && <p className="text-xl text-gray-400">Carregando gráfico...</p>}
          {error && <p className="text-xl text-red-400 bg-red-900/50 p-4 rounded-md">Erro: {error}</p>}

          {chartData && !loading && (
            <div className="bg-white p-2 rounded-lg shadow-xl w-full h-full">
              <Plot
                data={chartData.data}
                layout={{ ...chartData.layout, autosize: true, paper_bgcolor: 'transparent' }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CovidOcupacaoHospitalar;
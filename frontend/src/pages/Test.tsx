import { useEffect, useState } from "react";
import ChartComponent from "../components/ChartComponent";

export default function Test() {

    const CSHARP_API_BASE_URL = import.meta.env.VITE_CSHARP_API_BASE_URL;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${CSHARP_API_BASE_URL}/tuberculose/casos_confirmados_tuberculose_regiao_estado_ano/`);

                if(!response.ok) {
                    throw new Error("Erro ao buscar dados");
                }

                const json = await response.json();

                setData(json);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if(loading) {
        return <p className="text-center mt-3">Carregando gráfico...</p>;
    }

    return (

        <ChartComponent
            data={data}
            xKey={}
            yKey={}
        ></ChartComponent>

    );

}
from fastapi import FastAPI, Response
from typing import Optional
import plotly.io as pio
from google import genai
from dotenv import load_dotenv
import os

from services.covid_service import registro_ocupacao_hospitalar_covid19
from services.covid_service import notificacoes_sindrome_gripal_leve
from services.tuberculose_service import casos_confirmados_tuberculose_regiao_estado_ano
from charts.bar_chart import *

load_dotenv()

client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

app = FastAPI()

@app.get("/generate-chart/covid/{theme}/{chart_type}")
async def generate_chart(chart_type: str, theme: str = "default", x_column: Optional[str] = 'estado'):
    try:

        # TIPO DE INFORMACAO

        # REGISTRO DE OCUPAÇÃO HOSPITALAR POR COVID-19
        if theme == "registro_ocupacao_hospitalar":
            df = registro_ocupacao_hospitalar_covid19()
            title = "Ocupação de Leitos de UTI (COVID-19) por Estado"
            if chart_type == "bar":
                fig = registro_ocupacao_hospitalar_bar_chart(df, title)

        # REGISTRO DE NOTIFICAÇÕES DE SÍNDROME GRIPAL LEVE
        elif theme == "notificacoes_sindrome_gripal_leve":
            df = notificacoes_sindrome_gripal_leve('2020')
            title = "Base de dados de SG de casos leves e moderados suspeitos de Covid-19"
            if chart_type == "bar":
                fig = notificacoes_sindrome_gripal_leve_bar_chart(df, title, x_column)

        else:
            return Response(content=f'{{"error": "Tema inválido: {theme}"}}', media_type="application/json", status_code=400)

        # CONVERTE PARA JSON E RETORNA
        chart_json = pio.to_json(fig)
        return Response(content=chart_json, media_type="application/json")

    except Exception as e:
        return Response(content=f'{{"error": "{str(e)}"}}', media_type="application/json", status_code=500)
    
@app.get("/generate-chart/tuberculose/{theme}")
async def generate_chart(theme: str = "default"):
    try:

        if theme == "casos_confirmados_tuberculose_regiao_estado_ano":
            df = casos_confirmados_tuberculose_regiao_estado_ano()
            data_json = df.to_json(orient="records")
            return Response(content=data_json, media_type="application/json")
            
        else:
            return Response(content=f'{{"error": "Tema inválido: {theme}"}}', media_type="application/json", status_code=400)
        
    except Exception as e:
        return Response(content=f'{{"error": "{str(e)}"}}', media_type="application/json", status_code=500)

@app.post("/llm/explain")
async def explain_data(payload: dict):
    theme = payload.get("theme", "")
    data = payload.get("data", {})
    question = payload.get("question", "Explique os dados em poucas palavras")

    prompt = f"""
    Você é um especialista em saúde pública.
    Analise os dados a seguir do tema {theme} e responda à pergunta do usuário:
    Dados: {data}
    Pergunta: {question}
    Responda de forma clara e simples.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {"answer": response.text}
from fastapi import FastAPI, Response
from typing import Optional
import plotly.io as pio

from services.covid_service import registro_ocupacao_hospitalar_covid19
from services.covid_service import notificacoes_sindrome_gripal_leve
from charts.bar_chart import *

app = FastAPI()

# Registro de Ocupação Hospitalar
# Base de dados de SG de casos leves e moderados suspeitos de Covid-19

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
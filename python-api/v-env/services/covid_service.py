import requests
import pandas as pd

# Registro de Ocupação Hospitalar
# Base de dados de SG de casos leves e moderados suspeitos de Covid-19

def registro_ocupacao_hospitalar_covid19():

    api_url = "https://apidadosabertos.saude.gov.br/assistencia-a-saude/registro-de-ocupacao-hospitalar-covid-19?limit=100&offset=0"

    response = requests.get(api_url)
    response.raise_for_status()

    data = response.json()

    # Encapsula dados dentro da array
    registros = data.get("registro_ocupacao_hospitalar_covid19", [])

    if not registros:
        raise ValueError("Nenhum registro encontroado na API de Covid-19")
    
    df = pd.DataFrame(registros)
    df['ocupacaoconfirmadouti'] = pd.to_numeric(df['ocupacaoconfirmadouti'], errors='coerce').fillna(0)
    df = df.groupby('estado')['ocupacaoconfirmadouti'].sum().reset_index() # Transforma o indice (estado) em uma coluna normal novamente ao dataframe

    return df

def notificacoes_sindrome_gripal_leve(ano):
    
    api_url = f"https://apidadosabertos.saude.gov.br/vigilancia-e-meio-ambiente/notificacoes-de-sindrome-gripal-leve-{ano}?limit=100&offset=0"

    response = requests.get(api_url)
    response.raise_for_status()

    data = response.json()

    registros = data.get("notificacoes_sindrome_gripal_leve", [])
        
    if not registros:
        raise ValueError("Nenhum registro encontrado na API de Nortificações de Síndrome Gripal Leve")
    
    df_full = pd.DataFrame(registros)

    colunas_importantes = [
        'sexo',
        'idade',
        'raca_cor',
        'profissional_saude',
        'condicoes',
        'estado',
        'municipio',
        'data_notificacao',
        'data_inicio_sintomas',
        'data_encerramento',
        'sintomas',
        'evolucao_caso',
        'classificacao_final',
    ]

    df_selecionado= df_full[colunas_importantes].copy()

    return df_selecionado

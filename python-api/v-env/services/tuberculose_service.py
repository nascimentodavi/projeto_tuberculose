import pandas as pd

# Mapeamento de UFs para suas respectivas regiões.
REGIAO_MAP = {
    'Norte': 
    [
        'Rondônia',
        'Acre',
        'Amazonas',
        'Roraima',
        'Pará',
        'Amapá',
        'Tocantins'
    ],
    'Nordeste':
    [
        'Maranhão',
        'Piauí',
        'Ceará',
        'Rio Grande do Norte',
        'Paraíba',
        'Pernambuco',
        'Alagoas',
        'Sergipe',
        'Bahia'
    ],
    'Sudeste':
    [
        'Minas Gerais',
        'Espírito Santo',
        'Rio de Janeiro',
        'São Paulo'
    ],
    'Sul':
    [
        'Paraná',
        'Santa Catarina',
        'Rio Grande do Sul'
    ],
    'Centro-Oeste':
    [
        'Mato Grosso do Sul',
        'Mato Grosso',
        'Goiás',
        'Distrito Federal'
    ]
}

# Cria um dicionário reverso (UF -> Região) para facilitar a busca.
UF_MAP = {}
for regiao, ufs in REGIAO_MAP.items():
    for uf in ufs:
        UF_MAP[uf] = regiao

def casos_confirmados_tuberculose_regiao_estado_ano():
    df_wide = pd.read_csv('data/tuberculose/casos_confirmados_tuberculose_regiao_estado_ano.csv')

    # Remove coluna Total
    if 'Total' in df_wide.columns:
        df_wide = df_wide.drop(columns=['Total'])

    # Converte o DataFrame para o formato longo. As colunas de ano se tornarão linhas.
    df_long = pd.melt(df_wide,
                      id_vars=['localidade'],
                      var_name='ano',
                      value_name='casos'
                    )

    # Converte a coluna 'ano' para tipo numérico, tratando possíveis erros.
    df_long['ano'] = pd.to_numeric(df_long['ano'], errors='coerce') # Caso algum valor nao possa ser convertido, transforma em NaN, nulo do Pandas

    # Remove linhas onde a conversão falhou
    df_long.dropna(subset=['ano'], inplace=True)

    # Apos converter para float e remover valores invalidos (NaN), converte todos para int
    df_long['ano'] = df_long['ano'].astype(int)
    
    # Filtra apenas as linhas que correspondem a estados (UFs), descartando os totais por região do CSV.
    df_uf_only = df_long[df_long['localidade'].isin(UF_MAP.keys())].copy()

    # Adiciona as colunas 'uf' e 'regiao' com base no mapeamento.
    df_uf_only['uf'] = df_uf_only['localidade']
    df_uf_only['regiao'] = df_uf_only['uf'].map(UF_MAP)
    
    # Reordena as colunas para um formato mais limpo e retorna.
    df_final = df_uf_only[['regiao', 'uf', 'ano', 'casos']]

    return df_final
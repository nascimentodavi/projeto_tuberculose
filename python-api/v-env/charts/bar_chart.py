import plotly.express as px

def registro_ocupacao_hospitalar_bar_chart(df, title):
    return px.bar(
        df,
        x='estado',
        y=df.columns[1],
        title=title,
        labels={'estado': 'Estado', df.columns[1]: 'Total'}
    )

def notificacoes_sindrome_gripal_leve_bar_chart(df, title, x_column):
    df_contagem = df.groupby(x_column).size().reset_index(name='total_notificacoes')
    return px.bar(
        df_contagem,
        x=x_column,
        title=title,
        y='total_notificacoes',
        labels={
            x_column: x_column.replace('_', ' ').title(),
            'total_notificacoes': 'Total de Notificações'
        },
        text='total_notificacoes'
    )
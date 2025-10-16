import requests
import pandas as pd
import datasus_dbc
from dbfread import DBF
import csv
import sys

def get_tuberculose_data():

    datasus_dbc.decompress("../data/tuberculose/TUBEBR24.dbc", "../data/tuberculose/tuberculose.dbf")

    table = DBF('../data/tuberculose/tuberculose.dbf', encoding='latin-1')

    df = pd.DataFrame(iter(table))
    df.to_csv('../data/tuberculose/tuberculose.csv', index=False, encoding='utf-8')

    return df
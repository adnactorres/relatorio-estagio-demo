"""Funções para carregar e organizar o diário de estágio (dados fictícios da demo).

O notebook `analise_diario.ipynb` usa estas funções. Elas ficam num arquivo
separado para poderem ser testadas e reaproveitadas.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

import pandas as pd

PASTA = Path(__file__).resolve().parent
ARQUIVO_PADRAO = PASTA / "dados" / "diario_demo.json"

# Cores iguais às do relatório
AZUL = "#2F5BEA"
CINZA = "#56637F"
LINHA = "#DCE2F1"
VERMELHO = "#D2405A"
VERDE = "#1A9A5B"
LARANJA = "#E08A00"
CORES_TIMES = {"Onboarding": "#8A94A8", "Customização": "#7B5BE0", "Implantação": "#1A9A5B"}


def carregar(arquivo: str | Path = ARQUIVO_PADRAO) -> dict:
    """Lê o JSON exportado da demo."""
    with open(arquivo, encoding="utf-8") as f:
        return json.load(f)


def tabela_dias(bruto: dict) -> pd.DataFrame:
    """Uma linha por dia registrado."""
    times = bruto["times"]
    linhas = []
    for d in bruto["dias"]:
        linhas.append({
            "data": pd.Timestamp(d["d"]),
            "time": times.get(d["p"], d["p"]),
            "clientes": [c for c in d["os"]],
            "tipos": [bruto["tipos"].get(t, t) for t in d["tags"]],
            "atividades": len(d["txt"]),
            "erros": len(d["err"]),
            "melhorias": len(d["mel"]),
            "pendencias": len(d["pend"]),
        })
    df = pd.DataFrame(linhas).sort_values("data").reset_index(drop=True)
    df["mes"] = df["data"].dt.to_period("M")
    df["semana"] = df["data"].dt.to_period("W-SUN").dt.start_time
    return df


def tabela_erros(bruto: dict) -> pd.DataFrame:
    """Uma linha por erro encontrado, com o dia e os clientes do dia."""
    times = bruto["times"]
    linhas = []
    for d in bruto["dias"]:
        for e in d["err"]:
            linhas.append({
                "data": pd.Timestamp(d["d"]),
                "time": times.get(d["p"], d["p"]),
                "cliente": d["os"][0] if d["os"] else "(sem OS)",
                "erro": e,
                "categoria": categorizar_erro(e),
            })
    return pd.DataFrame(linhas)


def _sem_acento(texto: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", texto.lower()) if unicodedata.category(c) != "Mn")


# Regras simples, em ordem: a primeira que bate define a categoria.
REGRAS = [
    ("Texto e rótulos", r"legenda|frase|titulo|cpf's|nome de outra|cabecalho"),
    ("Obrigatoriedade de campo", r"obrigatori|em branco|opcional"),
    ("Validação de dados", r"negativo|duplicad|aceit"),
]


def categorizar_erro(texto: str) -> str:
    """Classifica um erro por palavras-chave. Sem regra que bata: 'Outros'."""
    t = _sem_acento(texto)
    for categoria, padrao in REGRAS:
        if re.search(padrao, t):
            return categoria
    return "Outros"


def explodir(df: pd.DataFrame, coluna: str) -> pd.DataFrame:
    """Uma linha por item da lista em `coluna` (ex.: um dia com 2 clientes vira 2 linhas)."""
    return df.explode(coluna).dropna(subset=[coluna])

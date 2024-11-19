import requests
import os
import time
from dotenv import load_dotenv

load_dotenv()

def get_env_variable(var_name):
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"A variável de ambiente '{var_name}' não está definida.")
    return value

CLIENT_ID =         get_env_variable("APP_ID")
TENANT_ID =         get_env_variable("TENANT_ID")
RESOURCE_ID =       get_env_variable("RESOURCE_ID")
CLIENT_SECRET =     get_env_variable("PASSWORD")
SUBSCRIPTION_ID =   get_env_variable("SUBSCRIPTION_ID")

def get_token():
    """Retrieves an access token from Azure AD."""
    print("Obtendo token de acesso...")
    url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    data = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'scope': 'https://management.azure.com/.default'
    }
    response = requests.post(url, data=data)
    if response.status_code != 200:
        print("Erro ao obter token:", response.text)
        response.raise_for_status()
    print("Token obtido com sucesso.")
    return response.json().get('access_token')

def get_metrics(resource_id, token):
    """Retrieves metric definitions for a specified Azure resource."""
    url = f"https://management.azure.com{resource_id}/providers/microsoft.insights/metricDefinitions"
    params = {
        'api-version': '2017-05-01-preview'
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers, params=params)
    print(f"HTTP Status: {response.status_code}")
    if response.status_code != 200:
        print("Erro ao obter definições de métricas:", response.text)
        response.raise_for_status()
    return response.json()

def get_metric_values(resource_id, metric_name, token):
    """Retrieves metric values for a specified Azure resource."""
    url = f"https://management.azure.com{resource_id}/providers/microsoft.insights/metrics"
    params = {
        'api-version': '2018-01-01',
        'metricnames': metric_name,
        'timespan': 'PT1M',  # Últimos 1 minuto
        'interval': 'PT1M',  # Intervalo de 1 minuto
        'aggregation': 'Average',  # Tipo de agregação
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Erro ao obter valores para métrica '{metric_name}':", response.text)
        response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    try:
        token = get_token()

        metric_definitions = get_metrics(RESOURCE_ID, token)
        metrics = metric_definitions.get("value", [])

        for metric in metrics:
            metric_name = metric['name']['value']
            print(f"Obtendo valores para métrica: {metric_name}")
            try:
                metric_values = get_metric_values(RESOURCE_ID, metric_name, token)
                print(f"Valores para {metric_name}: {metric_values}")
            except Exception as e:
                print(f"Erro ao obter valores para a métrica {metric_name}: {e}")

    except Exception as e:
        print(f"Erro: {e}")

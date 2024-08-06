import requests
import json
from dotenv import load_dotenv
import os

# Carrega as variáveis do arquivo .env
load_dotenv()

# Configurações de autenticação
app_id = os.getenv("APP_ID")
password = os.getenv("PASSWORD")
tenant_id = os.getenv("TENANT_ID")
subscription_id = os.getenv("SUBSCRIPTION_ID")

# URL para obter o token
token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/token"

# Parâmetros para obter o token
token_data = {
    "grant_type": "client_credentials",
    "client_id": app_id,
    "client_secret": password,
    "resource": "https://management.azure.com/"
}

# Faz a requisição para obter o token
token_response = requests.post(token_url, data=token_data)
token_response.raise_for_status()
access_token = token_response.json().get("access_token")

# Cabeçalhos para as requisições subsequentes
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# URL base para listar recursos
base_url = f"https://management.azure.com/subscriptions/{subscription_id}/resources"

# Parâmetros para a requisição
params = {
    "api-version": "2021-04-01"
}

# Faz a requisição para listar os recursos
response = requests.get(base_url, headers=headers, params=params)
response.raise_for_status()

# Lista de recursos
resources = response.json()

# Imprime os recursos
print(json.dumps(resources, indent=2))

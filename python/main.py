import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

def get_env_variable(var_name):
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"A variável de ambiente '{var_name}' não está definida.")
    return value

app_id = get_env_variable("APP_ID")
password = get_env_variable("PASSWORD")
tenant_id = get_env_variable("TENANT_ID")
subscription_id = get_env_variable("SUBSCRIPTION_ID")

def get_access_token(app_id, password, tenant_id):
    token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/token"
    token_data = {
        "grant_type": "client_credentials",
        "client_id": app_id,
        "client_secret": password,
        "resource": "https://management.azure.com/"
    }
    try:
        response = requests.post(token_url, data=token_data)
        response.raise_for_status()
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Erro ao obter o token de acesso: {e}")

def list_resources(subscription_id, access_token):
    base_url = f"https://management.azure.com/subscriptions/{subscription_id}/resources"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    params = {"api-version": "2021-04-01"}

    try:
        response = requests.get(base_url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Erro ao listar os recursos: {e}")

if __name__ == "__main__":
    try:
        access_token = get_access_token(app_id, password, tenant_id)
        resources = list_resources(subscription_id, access_token)
        print(json.dumps(resources, indent=2))
    except Exception as e:
        print(f"Erro: {e}")

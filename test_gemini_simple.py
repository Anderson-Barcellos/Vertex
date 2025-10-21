#!/usr/bin/env python3
import requests
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Teste simples
payload = {
    "prompt": "test",
    "text": "Ultrassom de abdome total Normal"
}

print("Testando Gemini API...")
print(f"Payload: {payload}")

try:
    response = requests.post(
        "https://ultrassom.ai:8177/geminiCall",
        json=payload,
        verify=False,
        timeout=10
    )

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Sucesso!")
        print(f"Resposta: {response.text[:200]}...")
    else:
        print(f"❌ Erro: {response.text}")

except Exception as e:
    print(f"❌ Erro: {e}")
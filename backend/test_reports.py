import requests

response = requests.get(
    "http://127.0.0.1:5000/patient_reports/4"
)

print(response.json())

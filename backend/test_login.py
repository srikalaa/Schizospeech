import requests

response = requests.post(
    "http://127.0.0.1:5000/login",
    json={
        "username": "doctor",
        "password": "1234"
    }
)

print(response.json())
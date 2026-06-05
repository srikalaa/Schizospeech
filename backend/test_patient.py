import requests

response = requests.post(
    "http://127.0.0.1:5000/add_patient",
    json={
        "name": "Rahul",
        "mobile": "9876543210",
        "email": "rahul@gmail.com",
        "age": 25,
        "gender": "Male"
    }
)

print("Status:", response.status_code)
print("Response:")
print(response.text)
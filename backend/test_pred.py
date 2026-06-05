import requests

url = "http://127.0.0.1:5000/predict"
try:
    with open("temp.wav", "rb") as f:
        files = {"file": f}
        r = requests.post(url, files=files)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Exception:", e)

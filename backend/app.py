
from flask import Flask, request, jsonify
from flask_cors import CORS

import sqlite3
import torch
import os

# ==========================================
# LOAD ENVIRONMENT VARIABLES FROM .ENV
# ==========================================
if os.path.exists(".env"):
    with open(".env", "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line and not line.strip().startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key.strip()] = val.strip().strip('"').strip("'")

from model import DepressionModel
from predict import predict

# ==========================================
# DATABASE MIGRATIONS
# ==========================================
def run_migrations():
    conn = sqlite3.connect("neurovoice.db")
    cursor = conn.cursor()
    try:
        cursor.execute("PRAGMA table_info(patients)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        if "doctor_id" not in column_names:
            print("[MIGRATION] Adding doctor_id column to patients table...")
            cursor.execute("ALTER TABLE patients ADD COLUMN doctor_id INTEGER")
            conn.commit()
            print("[MIGRATION] Migration successful!")
        else:
            print("[MIGRATION] doctor_id column already exists.")
    except Exception as e:
        print("[MIGRATION ERROR]", e)
    finally:
        conn.close()

run_migrations()

# ==========================================
# FLASK APP
# ==========================================
app = Flask(__name__)

# ENABLE CORS
CORS(app)

# ==========================================
# LOGIN CREDENTIALS
# ==========================================
DOCTOR_USERNAME = "doctor"
DOCTOR_PASSWORD = "1234"


# ==========================================
# LOAD MODEL
# ==========================================
model = DepressionModel()

model.load_state_dict(
    torch.load(
        "models/best_model.pth",
        map_location=torch.device("cpu")
    )
)

model.eval()

print("[SUCCESS] Model Loaded")


# ==========================================
# HOME ROUTE
# ==========================================
@app.route("/")
def home():

    return "Backend Running Successfully!"


# ==========================================
# LOGIN ROUTE
# ==========================================
@app.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        conn = sqlite3.connect(
            "neurovoice.db"
        )

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name
            FROM doctors
            WHERE username = ?
            AND password = ?
            """,
            (
                username,
                password
            )
        )

        doctor = cursor.fetchone()

        conn.close()

        if doctor:

            return jsonify({
                "success": True,
                "doctor_id": doctor[0],
                "doctor_name": doctor[1]
            })

        return jsonify({
            "success": False,
            "message":
            "Invalid username or password"
        }), 401

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500    





@app.route("/register", methods=["POST"])
def register():

    try:

        data = request.get_json()

        name = data.get("name")
        username = data.get("username")
        password = data.get("password")

        conn = sqlite3.connect("neurovoice.db")
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO doctors
            (name, username, password)
            VALUES (?, ?, ?)
            """,
            (name, username, password)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        })
    

# ==========================================
# ADD PATIENT
# ==========================================
@app.route("/add_patient", methods=["POST"])
def add_patient():

    try:

        data = request.get_json()

        name = data.get("name")
        mobile = data.get("mobile")
        email = data.get("email")
        age = data.get("age")
        gender = data.get("gender")
        doctor_id = data.get("doctor_id")

        if not doctor_id:
            return jsonify({
                "success": False,
                "message": "doctor_id is required"
            }), 400

        conn = sqlite3.connect(
            "neurovoice.db"
        )

        cursor = conn.cursor()

        # CHECK IF PATIENT ALREADY EXISTS
        cursor.execute(
            """
            SELECT
                id,
                patient_code,
                doctor_id
            FROM patients
            WHERE mobile = ?
            """,
            (mobile,)
        )

        existing_patient = cursor.fetchone()

        if existing_patient:
            exist_id, exist_code, exist_doc_id = existing_patient
            conn.close()
            if exist_doc_id is not None and int(exist_doc_id) != int(doctor_id):
                return jsonify({
                    "success": False,
                    "exists": False,
                    "message": "Access Denied: This patient is registered under another doctor."
                }), 403
            else:
                return jsonify({
                    "success": False,
                    "exists": True,
                    "patient_id": exist_id,
                    "patient_code": exist_code,
                    "message": "Patient already exists"
                })

        # CREATE NEW PATIENT
        # CREATE NEW PATIENT

        cursor.execute(
            "SELECT MAX(id) FROM patients"
            )

        last_id = cursor.fetchone()[0]

        if last_id is None:
            last_id = 0

        patient_code = f"PT{1000 + last_id + 1}"

        cursor.execute(
            """
            INSERT INTO patients
            (
                patient_code,
                name,
                mobile,
                email,
                age,
                gender,
                doctor_id
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                patient_code,
                name,
                mobile,
                email,
                age,
                gender,
                doctor_id
            )
        )

        conn.commit()

        patient_id = cursor.lastrowid

        conn.close()

        return jsonify({
            "success": True,
            "patient_id": patient_id,
            "patient_code": patient_code
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500



@app.route("/all_doctors")
def all_doctors():

    conn = sqlite3.connect("neurovoice.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id,name,username,password
        FROM doctors
    """)

    data = cursor.fetchall()

    conn.close()

    return jsonify(data)


# ==========================================
# SAVE REPORT
# ==========================================
@app.route("/save_report", methods=["POST"])
def save_report():

    try:

        data = request.get_json()

        print("SAVE REPORT REQUEST:", data)

        patient_id = data.get("patient_id")
        doctor_id = data.get("doctor_id")
        score = data.get("score")
        severity = data.get("severity")

        print(
            patient_id,
            doctor_id,
            score,
            severity
        )

        if patient_id is None:
            return jsonify({
                "success": False,
                "message": "patient_id missing"
            }), 400

        conn = sqlite3.connect("neurovoice.db")
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO reports
            (
                patient_id,
                doctor_id,
                score,
                severity
            )
            VALUES (?, ?, ?, ?)
        """,
        (
            patient_id,
            doctor_id,
            score,
            severity
        ))

        conn.commit()

        print("REPORT SAVED")
        print("ROW ID:", cursor.lastrowid)

        conn.close()

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("SAVE REPORT ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# ==========================================
# GET REPORTS FOR PATIENT
# ==========================================
@app.route(
    "/patient_reports/<int:patient_id>",
    methods=["GET"]
)
def patient_reports(patient_id):

    try:
        doctor_id = request.args.get("doctor_id", type=int)
        if not doctor_id:
            return jsonify({
                "error": "doctor_id is required"
            }), 400

        conn = sqlite3.connect(
            "neurovoice.db"
        )

        cursor = conn.cursor()

        # Check if the patient belongs to the requesting doctor
        cursor.execute("SELECT doctor_id FROM patients WHERE id = ?", (patient_id,))
        patient_row = cursor.fetchone()
        if not patient_row:
            conn.close()
            return jsonify({
                "error": "Patient not found"
            }), 404

        if patient_row[0] is not None and int(patient_row[0]) != int(doctor_id):
            conn.close()
            return jsonify({
                "error": "Access Denied: You do not have permission to view reports for this patient."
            }), 403

        cursor.execute(
            """
            SELECT
                id,
                score,
                severity,
                created_at
            FROM reports
            WHERE patient_id = ?
            ORDER BY created_at DESC
            """,
            (patient_id,)
        )

        rows = cursor.fetchall()

        conn.close()

        reports = []

        for row in rows:

            reports.append({
                "report_id": row[0],
                "score": row[1],
                "severity": row[2],
                "date": row[3]
            })

        return jsonify(reports)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    

# ==========================================
# PREDICTION ROUTE
# ==========================================
# ==========================================
# PREDICTION ROUTE
# ==========================================
@app.route("/predict", methods=["POST"])
def run():

    try:

        # CHECK FILE
        if "file" not in request.files:
            return jsonify({
                "error": "No file uploaded"
            }), 400

        file = request.files["file"]

        temp_path = "temp.wav"

        # SAVE TEMP AUDIO
        file.save(temp_path)

        print("[SUCCESS] Audio Received")

        # PREDICTION
        print("Starting prediction...")

        try:

            score = predict(
                model,
                temp_path
            )

            print("Prediction result:", score)

        except Exception as pred_error:

            print("PREDICT ERROR:", str(pred_error))

            import traceback
            traceback.print_exc()

            return jsonify({
                "error": str(pred_error)
            }), 500

        print("RAW MODEL OUTPUT:", score)
        print("[SUCCESS] Prediction Done")

        # CONVERT TO SCALE
        final_score = round(float(score) * 10, 2)

        print("FINAL SCORE:", final_score)

        # DELETE TEMP FILE
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return jsonify({
            "score": final_score,
            "raw_score": float(score)
        })

    except Exception as e:

        import traceback
        traceback.print_exc()

        print("[ERROR]", str(e))

        return jsonify({
            "error": str(e)
        }), 500

# ==========================================
# CHATBOT ROUTE (GEMINI LINKED)
# ==========================================
@app.route("/chat", methods=["POST"])
def chat():
    try:
        import requests
        data = request.get_json()
        message = data.get("message")
        history = data.get("history", [])

        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            # Fallback to smart local keyword-based matching if no API key is set
            q = message.lower()
            if "range" in q or "score" in q or "severity" in q or "scale" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "The NeuroVoice schizophrenia severity score ranges from **0 to 10**, which maps directly to the clinical severity scale:\n"
                    "- **0 - 2.5**: Minimal severity\n"
                    "- **2.5 - 5**: Mild severity\n"
                    "- **5 - 7.5**: Moderate severity\n"
                    "- **7.5 - 10**: Severe severity"
                )
            elif "feature" in q or "mfcc" in q or "acoustic" in q or "zcr" in q or "spectr" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "The voice analysis algorithm extracts several key acoustic features from raw voice recordings:\n"
                    "- **MFCCs** (Mel-Frequency Cepstral Coefficients): Identifies changes in timbre, breathiness, and vocal tract configurations.\n"
                    "- **ZCR** (Zero Crossing Rate): Detects speech noisiness and distinguishes voiced vs. unvoiced segments.\n"
                    "- **RMS Energy**: Evaluates loudness, dynamics, and speech amplitude variability.\n"
                    "- **Spectral Characteristics**: Measures spectral centroid and flatness to capture pitch variation and flatness."
                )
            elif "model" in q or "wav2vec" in q or "predict" in q or "algorithm" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "NeuroVoice utilizes a fine-tuned **Wav2Vec 2.0** deep learning model (specifically based on `facebook/wav2vec2-base-960h`). "
                    "The model analyzes acoustic patterns in a patient's speech sample (minimum 3 seconds) to evaluate schizophrenia severity."
                )
            elif "privacy" in q or "save" in q or "store" in q or "delete" in q or "audio" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "Patient privacy is fully preserved:\n"
                    "- Voice recordings are only saved temporarily as `temp.wav` in the backend.\n"
                    "- Once the Wav2Vec2 model makes a prediction, the audio file is **immediately deleted** from disk.\n"
                    "- No patient voice data is stored long-term; only the calculated score and clinical category are saved in the reports database."
                )
            elif "dataset" in q or "train" in q or "data" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "The deep learning model is pre-trained on the large-scale LibriSpeech corpus (960 hours of speech) and fine-tuned/validated on acoustic mental health datasets, including schizophrenia clinical datasets."
                )
            elif "work" in q or "use" in q or "how to" in q or "register" in q or "patient" in q:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "Here is the workflow for using the application:\n"
                    "1. **Register Patient**: Go to the **Patients** page, input patient info, and click **Save Patient** (this generates a unique PT code).\n"
                    "2. **Record/Upload Voice**: On the **Analysis** page, select or search for the patient, click **Start Recording** (or upload a WAV file), and record speech.\n"
                    "3. **Predict Severity**: Click **Stop & Predict**. The backend uses Wav2Vec2 to analyze the voice and outputs a score.\n"
                    "4. **View & Save Results**: View recommendations in the **Results** page, and save the report to the patient's record."
                )
            else:
                ans = (
                    "Clinical Assistant: [Warning: GEMINI_API_KEY environment variable is not set. Showing local guidance.]\n\n"
                    "Welcome Doctor! I am your clinical assistant. You can ask me about:\n"
                    "- The range of severity scores\n"
                    "- Extracted acoustic features (MFCCs, ZCR, energy)\n"
                    "- The Wav2Vec2 deep learning model\n"
                    "- Patient data privacy and storage\n"
                    "- Step-by-step workflow instructions\n\n"
                    "*Note: To use advanced AI conversation, please configure your `GEMINI_API_KEY` in the `.env` file.*"
                )
            return jsonify({"response": ans})

        # Prepare contents payload including history
        contents = []
        for h in history:
            role = "user" if h.get("role") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": h.get("text", "")}]
            })
        
        # Append latest message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        system_instruction = (
            "You are NeuroVoice AI, a specialized clinical assistant designed to help doctors understand "
            "schizophrenia severity analysis, acoustic voice patterns, and the operation of the NeuroVoice application.\n\n"
            "Key information about the application:\n"
            "- Purpose: NeuroVoice analyzes acoustic patterns in a patient's voice to assess schizophrenia severity.\n"
            "- How it works: The user records a voice sample (or uploads a WAV file). The backend extracts acoustic features "
            "(including MFCCs, Zero Crossing Rate, RMS, chroma, spectral features) and passes them to a deep learning model "
            "(a fine-tuned Wav2Vec2Model).\n"
            "- Scoring: The model outputs a prediction (0-1), which is scaled to a 0-10 score (0-2.5 Minimal, 2.5-5 Mild, 5-7.5 Moderate, 7.5-10 Severe).\n"
            "- Patient Management: Doctors can register patients, track their codes, and view previous assessment reports over time "
            "(including highest/lowest scores and trend analysis: Improving, Worsening, or Stable).\n"
            "- Privacy: Audio samples are processed in memory / temporarily saved as temp.wav and immediately deleted after prediction. "
            "No patient voice data is stored on disk permanently.\n\n"
            "Your job is to answer the doctor's questions about schizophrenia, voice analysis (acoustic features, MFCCs, etc.), "
            "and how to use this NeuroVoice application. Keep your responses professional, clinical, helpful, and concise."
        )

        payload = {
            "contents": contents,
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            }
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        
        if response.status_code != 200:
            return jsonify({
                "error": f"Gemini API returned error code {response.status_code}: {response.text}"
            }), 500

        res_data = response.json()
        try:
            bot_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            bot_response = "I apologize, I received an invalid response structure from the Gemini API."

        return jsonify({
            "response": bot_response
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

@app.route("/patients", methods=["GET"])
def get_patients():

    doctor_id = request.args.get("doctor_id")

    if not doctor_id:
        return jsonify([])

    conn = sqlite3.connect("neurovoice.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            patient_code,
            name,
            mobile,
            email,
            age,
            gender
        FROM patients
        WHERE doctor_id = ?
        ORDER BY id DESC
    """, (doctor_id,))

    rows = cursor.fetchall()

    conn.close()

    patients = []

    for row in rows:
        patients.append({
            "id": row[0],
            "patient_code": row[1],
            "name": row[2],
            "mobile": row[3],
            "email": row[4],
            "age": row[5],
            "gender": row[6]
        })

    return jsonify(patients)
# ==========================================
# RUN SERVER
# ==========================================
if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )


import sqlite3

def create_database():

    conn = sqlite3.connect("neurovoice.db")

    cursor = conn.cursor()

    # DOCTORS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT
    )
    """)

    # PATIENTS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_code TEXT UNIQUE,
        name TEXT,
        mobile TEXT UNIQUE,
        email TEXT,
        age INTEGER,
        gender TEXT,
        doctor_id INTEGER
    )
    """)

    # REPORTS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        doctor_id INTEGER,
        score INTEGER,
        severity TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    conn.close()

    print("Database Created")



def create_default_doctor():

    conn = sqlite3.connect("neurovoice.db")

    cursor = conn.cursor()

    cursor.execute("""
    INSERT OR IGNORE INTO doctors
    (
        username,
        password,
        name
    )
    VALUES
    (
        ?,
        ?,
        ?
    )
    """,
    (
        "doctor",
        "1234",
        "Dr NeuroVoice"
    ))

    conn.commit()

    conn.close()

    print("Default Doctor Created")


if __name__ == "__main__":

    create_database()

    create_default_doctor()
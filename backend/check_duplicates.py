import sqlite3

conn = sqlite3.connect("neurovoice.db")

cursor = conn.cursor()

cursor.execute("""
SELECT
    id,
    patient_code,
    name,
    mobile
FROM patients
ORDER BY mobile, id
""")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
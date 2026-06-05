import sqlite3

conn = sqlite3.connect("neurovoice.db")

cursor = conn.cursor()

cursor.execute("""
SELECT
    id,
    patient_id,
    score,
    severity,
    created_at
FROM reports
ORDER BY id
""")

rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
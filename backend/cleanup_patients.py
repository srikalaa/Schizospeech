import sqlite3

conn = sqlite3.connect("neurovoice.db")

cursor = conn.cursor()

# Delete duplicate patient records
cursor.execute(
    """
    DELETE FROM patients
    WHERE id IN (2, 3)
    """
)

conn.commit()

print("Duplicate patients removed.")

cursor.execute("""
SELECT
    id,
    patient_code,
    name,
    mobile
FROM patients
ORDER BY id
""")

for row in cursor.fetchall():
    print(row)

conn.close()
import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="fbs"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT flight_number, source, destination, travel_date, departure_time FROM flight LIMIT 20;")
    rows = cursor.fetchall()
    
    print("Flight Number | Source | Destination | Travel Date | Departure Time")
    print("-" * 70)
    for row in rows:
        print(f"{row[0]} | {row[1]} | {row[2]} | {row[3]} | {row[4]}")
        
    cursor.execute("SELECT COUNT(*) FROM flight WHERE travel_date = '2026-01-30';")
    count = cursor.fetchone()[0]
    print(f"\nTotal flights on 2026-01-30: {count}")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")

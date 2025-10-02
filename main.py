import sqlite3
from fastapi import FastAPI

app = FastAPI()

# DB 연결
conn = sqlite3.connect("school.db", check_same_thread=False)  # FastAPI는 멀티스레드라 옵션 필요
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
)
""")
conn.commit()

# 학생 추가
@app.post("/students")
def create_student(student_id: int, name: str, age: int):
    try:
        cursor.execute("INSERT INTO students (id, name, age) VALUES (?, ?, ?)", (student_id, name, age))
        conn.commit()
        return {"message": f"Student {name} added."}
    except sqlite3.IntegrityError:
        return {"error": "Student ID already exists."}

# 학생 조회 (단일)
@app.get("/students/{student_id}")
def get_student(student_id: int):
    cursor.execute("SELECT * FROM students WHERE id=?", (student_id,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "name": row[1], "age": row[2]}
    return {"error": "Student not found."}

# 학생 전체 조회
@app.get("/students")
def get_all_students():
    cursor.execute("SELECT * FROM students")
    rows = cursor.fetchall()
    return [{"id": r[0], "name": r[1], "age": r[2]} for r in rows]

# 학생 수정
@app.put("/students/{student_id}")
def update_student(student_id: int, name: str = None, age: int = None):
    if name:
        cursor.execute("UPDATE students SET name=? WHERE id=?", (name, student_id))
    if age:
        cursor.execute("UPDATE students SET age=? WHERE id=?", (age, student_id))
    conn.commit()
    return {"message": "Student updated."}

# 학생 삭제
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    cursor.execute("DELETE FROM students WHERE id=?", (student_id,))
    conn.commit()
    return {"message": "Student deleted."}

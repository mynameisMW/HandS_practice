import sqlite3
import bcrypt
import jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "test"
ALGORITHM = "HS256"

conn = sqlite3.connect("school.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER
)
""")
conn.commit()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        return payload  # {"sub": "user1", "role": "user"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def _create_student(student_id, name, age):
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO students (id, name, age) VALUES (?, ?, ?)", (student_id, name, age))
        conn.commit()
        return f"Student {name} added."
    except sqlite3.IntegrityError:
        return "Student ID already exists."

def _get_student(student_id, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id=?", (student_id,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "name": row[1], "age": row[2]}
    else:
        return "Student not found."

def _update_student(student_id, name=None, age=None):
    if name:
        cursor.execute("UPDATE students SET name=? WHERE id=?", (name, student_id))
    if age:
        cursor.execute("UPDATE students SET age=? WHERE id=?", (age, student_id))
    conn.commit()
    return "Student updated."

def _delete_student(student_id):
    cursor.execute("DELETE FROM students WHERE id=?", (student_id,))
    conn.commit()
    return "Student deleted."

def cli():
    print(1)
    while True:
        print("\n--- 학생 관리 CLI (SQLite) ---")
        print("1. 학생 추가")
        print("2. 학생 조회")
        print("3. 학생 수정")
        print("4. 학생 삭제")
        print("5. 종료")

        cmd = input("선택: ").strip()
        if cmd == "1":
            sid = int(input("ID: "))
            name = input("이름: ")
            age = int(input("나이: "))
            print(_create_student(sid, name, age))
        elif cmd == "2":
            sid = int(input("조회할 ID: "))
            print(_get_student(sid))
        elif cmd == "3":
            sid = int(input("수정할 ID: "))
            name = input("새 이름(엔터시 유지): ") or None
            age_input = input("새 나이(엔터시 유지): ")
            age = int(age_input) if age_input else None
            print(_update_student(sid, name, age))
        elif cmd == "4":
            sid = int(input("삭제할 ID: "))
            print(_delete_student(sid))
        elif cmd == "5":
            print("종료합니다.")
            break
        else:
            print("잘못된 입력입니다.")

if __name__ == "__main__":
    cli()
    conn.close()
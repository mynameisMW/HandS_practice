import sqlite3
import bcrypt
import jwt
import datetime
SECRET_KEY = "practice_jwt_secret_key"
ALGORITHM = "HS256"

conn = sqlite3.connect("login2.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
    id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
""")
conn.commit()
def _create_user(username, id, password):
    try:
        cursor = conn.cursor()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("INSERT INTO users (id, username, password) VALUES (?, ?, ?)", (id, username, hashed_password))
        conn.commit()
        return {"message":"User created.", "username":username, "id":id}
    except sqlite3.IntegrityError:
        return {"error":"id already exists."}

def _get_user(id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id=?", (id,))
    row = cursor.fetchone()
    if row:
        print(row)
        return {"id": row[0], "username": row[1], "hashed password": row[2]}
    else:
        return "User not found."

def _get_all_users():
    cursor = conn.cursor()
    cursor.execute("""
            SELECT id, username
            FROM users
            WHERE LOWER(username) <> 'admin'
            ORDER BY id ASC
        """)    
    rows = cursor.fetchall()
    return [{"id": row[0], "username": row[1]} for row in rows]

def _update_user(id, username, password, new_password=None):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id=?", (id,))
    row = cursor.fetchone()
    if not row:
        return "User not found."
    if not bcrypt.checkpw(password.encode('utf-8'), row[2]):
        return "Incorrect password."
    
    elif new_password:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("UPDATE users SET password=? WHERE username=?", (hashed_password, username))
    conn.commit()
    return "User updated."

def _delete_user(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id=?", (id,))

    conn.commit()
    return {"message":"User deleted.", "id":id}


def _login_user(id, password):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id=?", (id,))
    row = cursor.fetchone()
    if not row:
        return {"error":"User not found."}
    if not bcrypt.checkpw(password.encode('utf-8'), row[2]):
        return {"error":"Incorrect password."}
    if id =='':
        return {'error':"ID cannot be empty."}
    username = row[1]
    print("row", row[1],username)
    payload = {
        "username": username,
        "role": "admin" if id == "admin" else "user",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        }
    refresh_payload = {
        "username": username,
        "type": "refresh",   # Refresh임을 구분
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }

    print("payload", payload)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer", "refresh_token" : refresh_token}

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")
        role = payload.get("role")
        if role == "admin":
            print("Token valid")
            return {"role":"admin", "username": username}
        elif role == "user": 
            print("Not enough permissions")
            return {"role":"user", "username": username}
        else:
            print("Invalid role")
            return {"error":"Invalid role", "username": username}
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.InvalidTokenError:
        return "Invalid token"

def refresh_access_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            return {"error": "Invalid token type"}
        
        username = payload.get("username")
        # DB에서 사용자 정보를 다시 확인하여 role을 가져옵니다.
        cursor.execute("SELECT id FROM users WHERE username=?", (username,))
        user_row = cursor.fetchone()
        if not user_row:
            return {"error": "User not found"}
        user_id = user_row[0]

        new_access_payload = {
            "username": username,
            "role": "admin" if user_id == "admin" else "user",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        new_access_token = jwt.encode(new_access_payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"access_token": new_access_token, "token_type": "bearer"}
    except jwt.ExpiredSignatureError:
        return {"error": "Refresh token expired. Please log in again."}
    except jwt.InvalidTokenError:
        return {"error": "Invalid refresh token."}

def cli():
    print(1)
    while True:
        print("\n--- 사용자 관리 CLI (SQLite) ---")
        print("1. 사용자 추가")
        print("2. 사용자 조회")
        print("3. 사용자 수정")
        print("4. 사용자 삭제")
        print("5. 종료")

        cmd = input("선택: ").strip()

        if cmd == "1":
            username = input("사용자 이름: ").strip()
            password = input("비밀번호: ").strip()
            print(_create_user(username, password))
        elif cmd == "2":
            username = input("사용자 이름: ").strip()
            print(_get_user(username))
        elif cmd == "3":
            username = input("사용자 이름: ").strip()
            password = input("현재 비밀번호: ").strip()
            new_password = input("새 비밀번호 (변경하지 않으려면 Enter): ").strip() or None
            print(_update_user(username, password, new_password))
        elif cmd == "4":
            username = input("사용자 이름: ").strip()
            print(_delete_user(username))
        elif cmd == "5":
            break
        elif cmd == "6":
            username = input("사용자 이름: ").strip()
            password = input("비밀번호: ").strip()
            a = _get_user(username)
            if bcrypt.checkpw(password.encode('utf-8'), a["hashed password"]):
                print("로그인 성공")
            else:
                print("비밀번호 틀림")
        else:
            print("잘못된 선택입니다.")
if __name__ == "__main__":
    cli()
    conn.close()
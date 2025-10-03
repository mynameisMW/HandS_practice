from fastapi import FastAPI
from controller import items, users
from SQLite_practice import _create_student, _get_student, _update_student, _delete_student
from login import _create_user, _get_user, _get_all_users, _update_user, _delete_user, _login_user, verify_token
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:8000"  # (필요시)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # 개발 중엔 ["*"]로 임시 허용 가능 (보안상 주의)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/students/{student_id}")
def read_student(id: int):
    return _get_student(id)
@app.get("/students")
def read_all_students():
    students = []
    for sid in range(1, 100):  # 임시로 1~99까지 조회
        student = _get_student(sid)
        if student != "Student not found.":
            students.append(student)
    return students
@app.post("/students/add")
def add_student(username: int, id: str, age: int):
    return _create_student(username, id, age)
@app.put("/students/update/{student_id}")
def update_student(student_id: int, name: str = None, age: int = None):
    return _update_student(student_id, name, age)
@app.delete("/students/delete/{student_id}")
def delete_student(student_id: int):
    return _delete_student(student_id)


@app.get("/users/{username}")
def read_user(username: str):
    return _get_user(username)
@app.get("/users")
def read_all_users():
    return _get_all_users()
@app.post("/users/signup")
def add_user(username: str, id:str, password: str):
    return _create_user(username, id, password)
@app.put("/users/update/{username}")
def update_user(username: str, password: str, new_password: str = None):
    return _update_user(username, password, new_password)
@app.delete("/users/delete/{id}")
def delete_user(id: str):
    return _delete_user(id)


@app.post("/login")
def login(id: str, password: str):
    return _login_user(id, password)
@app.get("/verify")
def verify(token: str):
    return verify_token(token)
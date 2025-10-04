import sqlite3
import jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from login import _get_user, verify_token, _login_user

conn = sqlite3.connect("posts.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
""")
conn.commit()


def _post(title, content, author_id):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)", (title, content, author_id))
    conn.commit()
    return "Post created."

def _get_post(post_id):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts WHERE id=?", (post_id,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "title": row[1], "content": row[2], "author_id": row[3], "created_at": row[4]}
    else:
        return "Post not found."
    
def _get_post_by_title(title):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts WHERE title=?", (title,))
    row = cursor.fetchone()
    if row:
        return {"id": row[0], "title": row[1], "content": row[2], "author_id": row[3], "created_at": row[4]}
    else:
        return "Post not found." 
    
def _get_all_posts():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM posts")
    rows = cursor.fetchall()
    posts = []
    for row in rows:
        posts.append({"id": row[0], "title": row[1], "content": row[2], "author_id": row[3], "created_at": row[4]})
    return posts

def _update_post(post_id, title=None, content=None):
    if title:
        cursor.execute("UPDATE posts SET title=? WHERE id=?", (title, post_id))
    if content:
        cursor.execute("UPDATE posts SET content=? WHERE id=?", (content, post_id))
    conn.commit()
    return "Post updated."

def _delete_post(post_id):
    cursor.execute("DELETE FROM posts WHERE id=?", (post_id,))
    conn.commit()
    return {"message":"Post deleted.", "id":post_id}

def _help():
    import argparse

    parser = argparse.ArgumentParser(description="Manage posts in the database.")
    parser.add_argument("--create", nargs=3, metavar=('title', 'content', 'author_id'), help="Create a new post")
    parser.add_argument("--get", type=int, metavar='post_id', help="Get a post by ID")
    parser.add_argument("--get-all", action='store_true', help="Get all posts")
    parser.add_argument("--update", nargs=3, metavar=('post_id', 'title', 'content'), help="Update a post by ID")
    parser.add_argument("--delete", type=int, metavar='post_id', help="Delete a post by ID")

    args = parser.parse_args()

    if args.create:
        title, content, author_id = args.create
        print(_post(title, content, int(author_id)))
    elif args.get:
        print(_get_post(args.get))
    elif args.get_all:
        print(_get_all_posts())
    elif args.update:
        post_id, title, content = args.update
        print(_update_post(int(post_id), title, content))
    elif args.delete:
        print(_delete_post(args.delete))
    else:
        parser.print_help()
        
def cli():
    print(1)
    while True:
        print("\n--- 게시물 관리 CLI (SQLite) ---")
        print("1. 게시물 추가")
        print("2. 게시물 조회")
        print("3. 모든 게시물 조회")
        print("4. 게시물 수정")
        print("5. 게시물 삭제")
        print("6. 종료")

        cmd = input("선택: ").strip()
        if cmd == "1":
            title = input("제목: ")
            content = input("내용: ")
            author_id = input("작성자 ID: ")
            print(_post(title, content, author_id))
        elif cmd == "2":
            post_id = int(input("조회할 게시물 ID: "))
            print(_get_post(post_id))
        elif cmd == "3":
            print(_get_all_posts())
        elif cmd == "4":
            post_id = int(input("수정할 게시물 ID: "))
            title = input("새 제목(엔터시 유지): ") or None
            content = input("새 내용(엔터시 유지): ") or None
            print(_update_post(post_id, title, content))
        elif cmd == "5":
            post_id = int(input("삭제할 게시물 ID: "))
            print(_delete_post(post_id))
        elif cmd == "6":
            print("종료합니다.")
            break
        else:
            print("잘못된 입력입니다.")

if __name__ == "__main__":
    cli()
    conn.close()
"use client"; // 클라이언트 컴포넌트
import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function addPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author_id, setAuthorId] = useState("");
    async function verify(){
        const token = localStorage.getItem("token");
            if (token) {
                const res = await fetch(`${API_BASE}/verify?token=${token}`);
                const data = await res.json();
                if (data.role) {
                    setAuthorId(data.username)
                }
                else {
                    return"please login first"
                }
            }
        }
    async function ADD(title, content, author_id){
        await verify();
        try {
            const res = await fetch(`${API_BASE}/posts/add?title=${title}&content=${content}&author_id=${author_id}`, 
            {
                method: "POST",
            });
            const data = await res.json();
            if (data.error) {
                alert(data.error);
            }
            else {
                alert("게시물 추가 성공");
                setTitle("");
                setContent("");
                setAuthorId("");
                window.location.href = "/posts";
            }
        }
        catch (err) {
            console.error(err);
        }
    }     
    useEffect(() => {
        verify();
    }, []);
    return (
        <div>
            <Link href="/posts">목록으로 돌아가기 </Link>
            <h2>게시물 추가</h2>
            <input placeholder="제목" onChange={(e) => setTitle(e.target.value)} />
            <p>작성자: {author_id}</p>
            <div>
            <textarea 
                placeholder="내용" 
                onChange={(e) => setContent(e.target.value)}
                rows="10"
                style={{ width: '300px', marginTop: '10px' }}
            />
            </div>
            <button onClick={() => ADD(title, content, author_id)}>추가</button>
        </div>
    )
}

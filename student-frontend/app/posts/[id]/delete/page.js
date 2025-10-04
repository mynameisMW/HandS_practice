"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function PostDetail({ params }) {
    const { id } = use(params); // URL에서 동적 파라미터(id)를 가져옵니다.
    async function deletePost() {
        const res = await fetch(`${API_BASE}/posts/delete/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.message) {
                alert(data.message);
                window.location.href = "/posts";
            } else {
                alert(data.error);
            }
        }
    

    useEffect(() => {
        deletePost();
    }, []);

    return (
        <div style={styles.container}>
            <p>게시물 삭제 중...</p>
            <Link href="/posts" style={styles.backLink}>← 목록으로 돌아가기</Link>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center' },
    backLink: { display: 'inline-block', marginTop: '30px', color: '#0070f3', textDecoration: 'none' },
}
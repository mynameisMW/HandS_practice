"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function PostDetail({ params }) {
    const { id } = params; // URL에서 동적 파라미터(id)를 가져옵니다.
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function verifyAndFetch() {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                window.location.href = "/";
                return;
            }

            try {
                // 1. 사용자 인증
                const verifyRes = await fetch(`${API_BASE}/verify?token=${token}`);
                const userData = await verifyRes.json();
                if (!userData.username) {
                    throw new Error("유효하지 않은 세션입니다. 다시 로그인해주세요.");
                }
                setCurrentUser(userData);

                // 2. 게시물 데이터 가져오기
                if (!id) return;
                const postRes = await fetch(`${API_BASE}/posts/${id}`);
                if (!postRes.ok) {
                    throw new Error('게시물을 찾을 수 없습니다.');
                }
                const postData = await postRes.json();
                setPost(postData);

            } catch (err) {
                setError(err.message);
                alert(err.message);
                if (err.message.includes("로그인")) {
                    window.location.href = "/";
                }
            } finally {
                setLoading(false);
            }
        }

        verifyAndFetch();
    }, [id]);

    if (loading) {
        return <div style={styles.container}><p>로딩 중...</p></div>;
    }

    if (error) {
        return <div style={styles.container}><p style={{ color: 'red' }}>오류: {error}</p><Link href="/posts">목록으로 돌아가기</Link></div>;
    }

    if (!post) {
        return <div style={styles.container}><p>게시물이 존재하지 않습니다.</p><Link href="/posts">목록으로 돌아가기</Link></div>;
    }

    const isAuthor = currentUser && post && (currentUser.username === post.author_id || currentUser.role === "admin");

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{post.title}</h1>
            <div style={styles.meta}>
                <span>작성자: {post.author_id}</span>
                <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
                {isAuthor && (
                    <div style={styles.buttonGroup}>
                        <Link href={`/posts/${post.id}/edit`} style={styles.editLink}>수정</Link>
                        <Link href={`/posts/${post.id}/delete`} style={styles.editLink}>삭제</Link>
                    </div>
                )}
            </div>
            <div style={styles.content}>
                {post.content}
            </div>
            <Link href="/posts" style={styles.backLink}>← 목록으로 돌아가기</Link>
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', marginBottom: '10px', color: '#333' },
    meta: { fontSize: '14px', color: '#666', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
    content: { fontSize: '16px', color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap', padding: '20px 0' },
    backLink: { display: 'inline-block', marginTop: '30px', color: '#0070f3', textDecoration: 'none' },
    buttonGroup: { display: 'flex', gap: '10px' },
    editLink: { color: '#0070f3', textDecoration: 'none', padding: '5px 10px', borderRadius: '5px', border: '1px solid #0070f3' },
    deleteButton: { color: '#f44336', backgroundColor: 'transparent', border: '1px solid #f44336', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }
};
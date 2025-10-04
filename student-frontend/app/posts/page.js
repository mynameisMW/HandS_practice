"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function Posts() {
    const [posts, setPosts] = useState([]);

    async function verify(){
        const token = localStorage.getItem("token");
            if (token) {
                const res = await fetch(`${API_BASE}/verify?token=${token}`);
                const data = await res.json();
                if (!data.role) {
                    alert("접근 권한이 없습니다.");
                    window.location.href = "/";
                }
            }
        }
    async function fetchPosts() {
        const res = await fetch(`${API_BASE}/posts`);
        const data = await res.json();
        setPosts(data);
    }
    useEffect(() => {
        verify();
        fetchPosts();
    }, []);
    verify();



  // (a) useEffect로 fetch
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>게시물 목록</h2>
                <Link href="/posts/add" style={styles.addButton}>
                    게시글 작성
                </Link>
            </div>
            <ul style={styles.postList}>
                {posts.map((post) => (
                    <li key={post.id} style={styles.postItem}>
                        <div style={styles.postHeader}>
                            <span style={styles.postId}>{post.id}</span>
                            <h3 style={styles.postTitle}>{post.title}</h3>
                        </div>
                        <div style={styles.postMeta}>
                            <span>작성자: {post.author_id}</span>
                            <span style={styles.postDate}>
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div style={styles.postContentPreview}>
                            {post.content.substring(0, 100)}{post.content.length > 100 ? '...' : ''}
                        </div>
                        <Link href={`/posts/${post.id}`} style={styles.viewLink}>
                            게시물 전체 보기 →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: { fontSize: '24px', color: '#333' },
    addButton: {
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    postList: { listStyle: 'none', padding: 0 },
    postItem: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    postHeader: { display: 'flex', alignItems: 'center', marginBottom: '10px' },
    postId: { marginRight: '10px', color: '#888', fontSize: '14px' },
    postTitle: { margin: 0, fontSize: '20px', color: '#333' },
    postMeta: { fontSize: '14px', color: '#666', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' },
    postDate: { color: '#888' },
    postContentPreview: { color: '#555', lineHeight: 1.6, marginBottom: '15px' },
    viewLink: { color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' },
};
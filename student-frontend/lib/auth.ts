const API_BASE = "http://127.0.0.1:8000";

async function verifyToken(token: string) {
    if (!token) {
        return null; // 토큰이 없으면 null 반환
    }
    try {
        const res = await fetch(`${API_BASE}/verify?token=${token}`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}

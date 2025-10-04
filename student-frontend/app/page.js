"use client"; // 클라이언트 컴포넌트
import Link from "next/link";
import { use, useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // 페이지 로드 시 로그인 상태를 확인하는 useEffect
  useEffect(() => {
    checkLoginStatus();
  }, []);

  async function checkLoginStatus() {
    let accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken) {
      const res = await fetch(`${API_BASE}/verify?token=${accessToken}`);
      const data = await res.json();
      
      if (data === "Token expired" && refreshToken) {
        // 액세스 토큰이 만료되었고, 리프레시 토큰이 있으면 재발급 시도
        try {
          const refreshRes = await fetch(`${API_BASE}/refresh?refresh_token=${refreshToken}`, { method: "POST" });
          const refreshData = await refreshRes.json();

          if (refreshData.access_token) {
            accessToken = refreshData.access_token;
            localStorage.setItem("token", accessToken);
            // 재발급 성공 후 다시 사용자 정보 조회
            const newVerifyRes = await fetch(`${API_BASE}/verify?token=${accessToken}`);
            const newUserData = await newVerifyRes.json();
            setRole(newUserData.role);
            setUsername(newUserData.username);
          } else {
            // 리프레시 토큰도 만료된 경우
            onLogout();
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          }
        } catch (error) {
          console.error("토큰 갱신 오류:", error);
          onLogout();
        }
      } else if (data.username) {
        setRole(data.role);
        setUsername(data.username);
      }
    }
  }
  async function login(id, password) {
    try {
      const res = await fetch(`${API_BASE}/login?id=${id}&password=${password}`, 
        {
          method: "POST",
        });
        const data = await res.json();
        const token = data.access_token;
        const refreshToken = data.refresh_token;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refreshToken);
        await checkLoginStatus(); // 로그인 성공 후 상태 업데이트
        if (data.error) {
          alert(data.error);
        }
        else {
          alert("로그인 성공");
        }
      }
      catch (err) {
        console.error(err);
      }
  }
  const onLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      setRole("");
      setId("");
      setPassword("");
      setUsername("");
      alert("로그아웃 되었습니다.");
  }
    
    return (
    <div>
      {role == "admin"? (
        <div>
          <div>
            <Link href="/users" style={{ marginRight: "10px" }}>회원 관리</Link>
            <Link href="/posts" style={{ marginRight: "10px" }}>게시물</Link>
          </div>
          <div>
          <h2>환영합니다 {username}님!</h2>
          <p>권한: {role}</p>
          <button onClick={() => {onLogout();
          }}>로그아웃</button>
          </div>
        </div>)
      : role == "user"?(
        <div>
          <div>            
            <Link href="/posts" style={{ marginRight: "10px" }}>게시물</Link>
          </div>
          <div>
            <h2>환영합니다 {username}님!</h2>
            <p>권한: {role}</p>
            <button onClick={() => {onLogout();
            }}>로그아웃</button>
          </div>
        </div>
        ):(
        <div>
          <div>
            <p> login </p>
            <input placeholder="ID" onChange={(e) => setId(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick = {() => login(id,password)}>로그인</button>
          </div>
          <div>
            <Link href="/signup">회원가입</Link>
          </div>
        </div>)
      }
    </div>
  );
}

"use client"; // 클라이언트 컴포넌트
import Link from "next/link";
import { use, useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Home() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  async function _change_role() {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await fetch(`${API_BASE}/verify?token=${token}`);
      const data = await res.json();
      setRole(data.role);
      setUsername(data.username);
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
        localStorage.setItem("token", token);
        _change_role();
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
          <h2>환영합니다 {username}님!</h2>
          <p>권한: {role}</p>
          <button onClick={() => {onLogout();
          }}>로그아웃</button>
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

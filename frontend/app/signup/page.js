"use client"; // 클라이언트 컴포넌트
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Home() {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  async function signupUser(username, id, password) {
    try {
      const res = await fetch(
        `${API_BASE}/users/signup?username=${username}&id=${id}&password=${password}`, 
        {method: "POST"}
      );
      const data = await res.json();
      console.log(data);
      
      if (data.error) throw new Error("회원가입 실패");
      else {
        // 회원가입 성공 시 처리
        alert("회원가입 성공");
        // 추가 작업 수행 (예: 페이지 이동)
        window.location.href = "/"; // 로그인 페이지로 이동
      }

    } catch (err) {
      console.error(err);
    }
  }

  const onClick = () => {
    signupUser(username, id, password);
    setId("");
    setPassword("");
    setUsername("");
  }
  return (
    <div>
      <h2>회원가입!</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="ID" onChange={(e) => setId(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={onClick}>회원가입</button>

    </div>
  );
}

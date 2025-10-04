"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function Projects() {
    const [project, setProject] = useState([]);

    const token = localStorage.getItem("token");
    useEffect(() => {
        async function verify(){
            if (token) {
                const res = await fetch(`${API_BASE}/verify?token=${token}`);
                const data = await res.json();
                if (data.role !== "admin") {
                    alert("접근 권한이 없습니다.");
                    window.location.href = "/";
                }
            }
        }
    }, []);

  // (a) useEffect로 fetch
    return( 
        <div>
        <h2>학생 목록</h2>
        <ul>
            {students.map((student) => (
            <li key={student.id}>
                {student.id} - {student.name} ({student.age}세)
            </li>
            ))}
        </ul>
        <Link href="/students/add">학생 추가</Link>
        </div>
    );
}
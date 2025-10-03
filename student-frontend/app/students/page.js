"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    async function fetchStudents() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:8000/students", {
        headers: {
        Authorization: `Bearer ${token}`,  // JWT 첨부
        },
    });
  const data = await res.json();
  console.log(data);
}
    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        const res = await fetch(`${API_BASE}/students`);
        const data = await res.json();
        setStudents(data);
    }

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
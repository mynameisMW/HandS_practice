"use client"; // 클라이언트 컴포넌트
import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");

  // (a) useEffect로 초기 학생 목록 불러오기
    useEffect(() => {
        fetchStudents();
    }, []);

    async function fetchStudents() {
        const res = await fetch(`${API_BASE}/students`);
        const data = await res.json();
        setStudents(data);
    }

    async function addStudent(studentId, name, age) {
        try {
        const res = await fetch(
            `${API_BASE}/students/add?student_id=${studentId}&name=${name}&age=${age}`,
            { method: "POST" }
        );

        if (!res.ok) throw new Error("학생 추가 실패");

        const data = await res.json();
        alert(data);

      // 새로고침 대신 목록 갱신
        fetchStudents();
        } catch (err) {
        console.error(err);
        }
    } 

    const handleAdd = () => {
        addStudent(id, name, age);
        setId("");
        setName("");
        setAge("");
    };

    return (
        <div>
        <h1>학생 관리</h1>

        <h2>학생 목록</h2>


        <h2>학생 추가</h2>
        <input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="나이" value={age} onChange={(e) => setAge(e.target.value)} />
        <button onClick={handleAdd}>추가</button>
        </div>
    );
}

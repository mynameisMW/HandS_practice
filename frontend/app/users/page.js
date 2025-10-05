"use client"; // 클라이언트 컴포넌트
import { use, useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = "http://127.0.0.1:8000";

export default function usermanaging() {
    async function _check_admin() {
        const token =  localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/verify?token=${token}`);
        const data = await res.json();
        const role = data.role;
        if (role != "admin") {
            return <div>접근 불가</div>;
        }
    }

    const [users, setUsers] = useState([]);
    async function fetchUsers() {
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();
        setUsers(data);
    }
    useEffect(() => {
        _check_admin();
        fetchUsers();
        // console.log(users);
    }, []);

    async function deleteUser(id) {
        const res = await fetch(`${API_BASE}/users/delete/${id}`, {method: "DELETE"});
        const data = await res.json();
        alert(data.message);
        fetchUsers(); // 삭제 후 사용자 목록 갱신
    }
  // (a) useEffect로 fetch
    return( 
        <div>
        <h2>학생 목록</h2>
        <ul>
            {users.map((user) => (
            <li key={user.id}>
                {user.id} - {user.username} <button onClick={()=> deleteUser(user.id)}>제거</button>
            </li>
            ))}
        </ul>
        </div>
    );
}

export default async function verify(token) {
    if (!token) {
        return { error: "No token provided" };
    }
    try {
        const res = await fetch(`http://localhost:8000/verify?token=${token}`);
        const data = await res.json();
        return data;
    }   catch (err) {   
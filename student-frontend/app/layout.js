import Link from "next/link";
import styles from "./title.module.css";

export const metadata = {
  title: "고려대학교 전기전자공학부 전공학회 HandS",
  description: "Next.js + FastAPI Demo",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="ko">
      <body style={{ margin: "20px", fontFamily: "Arial" }}>
        <header style={{ marginBottom: "20px", color: "#8a0a2eff" }}>
          <h1>
            <Link href="/" className={styles.link}>고려대학교 전기전자공학부 전공학회 HandS 
              </Link>
          </h1> 
          <h4>Hardware and Software</h4>
          <hr />
        </header>
          <p> 모든 것을 직접 손으로 만들며 노는 학회 </p>
        <main>{children}</main>
        <footer style={{ marginTop: "20px" }}>
          <hr />
          <p>© 고려대학교 전기전자공학부 전공학회 HandS </p>
          <p>고려대학교 신공학관 109호 </p>
        </footer>
      </body>
    </html>
  );
}

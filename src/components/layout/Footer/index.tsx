import Link from "next/link";
import styles from "./styles.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>关于</h3>
            <p className={styles.description}>
              FeiとFei 是一个记录生活点滴，分享恋爱心得的个人网站。
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>导航</h3>
            <nav className={styles.nav}>
              <Link href="/blog">博客</Link>
              <Link href="/about">关于</Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h3 className={styles.title}>联系</h3>
            <nav className={styles.nav}>
              <a
                href="https://github.com/shchnk"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a href="mailto:doubleshy0n@gmail.com">Email</a>
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} FeiとFei. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import CarouselComponent from "../components/CarouselComponent";
import ListSection from "../components/ListSection";
import styles from "./page.module.css";

export default function Home() {
  const [isHeaderShrunk, setIsHeaderShrunk] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsHeaderShrunk(scrollContainer.scrollTop >= 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header
        className={`${styles.header} ${
          isHeaderShrunk ? styles.headerShrunk : ""
        }`}
      >
        Feifei&apos;s World
      </header>

      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div className={styles.snapContainer}>
          <CarouselComponent />
          <ListSection />
        </div>

        <footer className={styles.footer}>
          <p>© 2025 Feifei&apos;s World. All rights reserved.</p>
          <p>Contact: info@feifeiworld.com</p>
        </footer>
      </div>
    </div>
  );
}

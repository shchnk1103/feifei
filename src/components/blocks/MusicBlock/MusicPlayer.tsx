"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDuration } from "@/utils/formatters";
import { MusicPlayerProps } from "./types";
import styles from "./styles.module.css";

//TODO: 不显示，到时候修复
export function MusicPlayer({
  block,
  variant = "full",
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      ended: () => setIsPlaying(false),
      timeupdate: () => setCurrentTime(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        audio?.removeEventListener(event, handler);
      });
    };
  }, []);

  return (
    <motion.div
      className={`${styles.musicCard} ${styles[variant]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      data-playing={isPlaying}
    >
      <div className={styles.coverContainer}>
        {block.metadata?.coverUrl && (
          <Image
            src={block.metadata.coverUrl}
            alt={block.content}
            width={variant === "simple" ? 120 : 160}
            height={variant === "simple" ? 120 : 160}
            className={styles.cover}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{block.content}</h3>
          {block.metadata?.artist && (
            <p className={styles.artist}>{block.metadata.artist}</p>
          )}
          {variant === "full" && block.metadata?.albumName && (
            <p className={styles.album}>{block.metadata.albumName}</p>
          )}
        </div>

        {variant === "full" ? (
          <div className={styles.controls}>
            <button
              className={styles.playButton}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸" : "▶️"}
            </button>

            <div
              ref={progressRef}
              className={styles.progressBar}
              onClick={handleProgressClick}
            >
              <div
                className={styles.progress}
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className={styles.time}>
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>

            <div className={styles.volume}>
              <span className={styles.volumeIcon}>
                {volume === 0 ? "🔇" : volume < 0.5 ? "🔈" : "🔊"}
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>
          </div>
        ) : (
          <button
            className={styles.simplePlayButton}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶️"}
          </button>
        )}

        <audio
          ref={audioRef}
          src={block.metadata?.musicUrl}
          preload="metadata"
          className={styles.audio}
        />
      </div>
    </motion.div>
  );
}

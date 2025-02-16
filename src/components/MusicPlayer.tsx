import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./ContentRenderer.module.css";
import { ContentBlock } from "../types/article";

interface MusicPlayerProps {
  block: ContentBlock;
}

export function MusicPlayer({ block }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.musicBlock}>
      <div className={styles.musicCard} data-playing={isPlaying}>
        <div className={styles.coverContainer}>
          {block.metadata?.coverUrl && (
            <Image
              src={block.metadata.coverUrl}
              alt={block.content}
              width={160}
              height={160}
              className={styles.musicCover}
            />
          )}
        </div>
        <div className={styles.musicContent}>
          <div className={styles.musicInfo}>
            <h3 className={styles.musicTitle}>{block.content}</h3>
            {block.metadata?.title && (
              <p className={styles.musicOriginalTitle}>
                {block.metadata.title}
              </p>
            )}
            {block.metadata?.artist && (
              <p className={styles.musicArtist}>{block.metadata.artist}</p>
            )}
            {block.metadata?.albumName && (
              <p className={styles.musicAlbum}>{block.metadata.albumName}</p>
            )}
          </div>
          {block.metadata?.description && (
            <p className={styles.musicDescription}>
              {block.metadata.description}
            </p>
          )}
          <div className={styles.musicWaveform} />
          <div className={styles.musicControls}>
            <span className={styles.musicTime}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className={styles.musicProgress}>
              <div
                className={styles.musicProgressBar}
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          {block.metadata?.musicUrl && (
            <audio
              ref={audioRef}
              className={styles.musicPlayer}
              controls
              src={block.metadata.musicUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

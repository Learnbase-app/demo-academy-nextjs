"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import {
  ArrowsIn,
  ArrowsOut,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerX,
  Spinner,
} from "@phosphor-icons/react"

function formatTime(secs: number): string {
  if (!Number.isFinite(secs) || secs < 0) return "0:00"
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

type VideoPlayerProps = {
  src: string
  title?: string
  poster?: string
}

export function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 2500)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onPlay = () => setPlaying(true)
    const onPause = () => {
      setPlaying(false)
      setShowControls(true)
    }
    const onTimeUpdate = () => setCurrentTime(v.currentTime)
    const onDuration = () => setDuration(v.duration)
    const onWaiting = () => setLoading(true)
    const onCanPlay = () => setLoading(false)
    const onProgress = () => {
      if (v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1))
      }
    }

    v.addEventListener("play", onPlay)
    v.addEventListener("pause", onPause)
    v.addEventListener("timeupdate", onTimeUpdate)
    v.addEventListener("durationchange", onDuration)
    v.addEventListener("waiting", onWaiting)
    v.addEventListener("canplay", onCanPlay)
    v.addEventListener("progress", onProgress)

    return () => {
      v.removeEventListener("play", onPlay)
      v.removeEventListener("pause", onPause)
      v.removeEventListener("timeupdate", onTimeUpdate)
      v.removeEventListener("durationchange", onDuration)
      v.removeEventListener("waiting", onWaiting)
      v.removeEventListener("canplay", onCanPlay)
      v.removeEventListener("progress", onProgress)
    }
  }, [])

  // HLS support
  useEffect(() => {
    const v = videoRef.current
    if (!v || !src) return

    const isHls = src.includes(".m3u8")

    if (isHls && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(v)
      hlsRef.current = hls
      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    } else {
      // Native HLS (Safari) or non-HLS source
      v.src = src
    }
  }, [src])

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
    } else {
      v.pause()
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    const bar = progressRef.current
    if (!v || !bar || !v.duration) return
    const { left, width } = bar.getBoundingClientRect()
    v.currentTime = Math.max(0, ((e.clientX - left) / width) * v.duration)
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFullscreen = () => {
    const c = containerRef.current
    if (!c) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      c.requestFullscreen()
    }
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-lg bg-black"
      onMouseMove={() => {
        setShowControls(true)
        if (playing) scheduleHide()
      }}
      onMouseLeave={() => {
        if (playing) setShowControls(false)
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        title={title}
        className="aspect-video w-full cursor-pointer"
        preload="metadata"
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Spinner size={36} className="animate-spin text-white/60" />
        </div>
      )}

      {/* Center play button when paused */}
      {!playing && !loading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play video"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/60">
            <Play size={24} weight="fill" className="ml-1 text-white" />
          </div>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3 transition-opacity duration-200 ${
          showControls || !playing
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="relative mb-3 h-1.5 cursor-pointer rounded-full bg-white/20"
          onClick={handleSeek}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/30"
            style={{ width: `${bufferedPct}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="text-white/80 transition hover:text-white"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause size={20} weight="fill" />
              ) : (
                <Play size={20} weight="fill" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white/80 transition hover:text-white"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <SpeakerX size={20} /> : <SpeakerHigh size={20} />}
            </button>

            <span className="font-mono text-xs tabular-nums text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-white/80 transition hover:text-white"
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <ArrowsIn size={18} /> : <ArrowsOut size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'

export interface SubtitleEntry {
  startSec: number
  endSec: number
  text: string
}

interface SubtitleOverlayProps {
  subtitles: SubtitleEntry[]
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ subtitles }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentSec = frame / fps

  const active = subtitles.find(
    (s) => currentSec >= s.startSec && currentSec < s.endSec,
  )

  if (!active) return null

  const lines = active.text.split('\n')

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: '0 40px',
        zIndex: 100,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontFamily: 'SUIT Variable, sans-serif',
            fontWeight: 700,
            fontSize: 58,
            color: '#FFFFFF',
            lineHeight: 1.38,
            textShadow:
              '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 12px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7)',
            WebkitTextStroke: '3px #000',
            paintOrder: 'stroke fill',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

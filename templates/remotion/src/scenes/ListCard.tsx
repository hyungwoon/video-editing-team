import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'

interface ListCardProps {
  text: string
  highlightWord?: string
  backgroundColor?: string
}

export const ListCard: React.FC<ListCardProps> = ({
  text,
  backgroundColor = '#111111',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const items = text.split('\n').filter(Boolean)

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 100px',
      }}
    >
      {items.map((item, index) => {
        const delay = index * 8
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 200 },
        })

        return (
          <div
            key={index}
            style={{
              opacity: progress,
              transform: `translateX(${(1 - progress) * 40}px)`,
              fontFamily: 'SUIT Variable, sans-serif',
              fontWeight: 700,
              fontSize: 48,
              color: '#FFFFFF',
              marginBottom: 40,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 24,
            }}
          >
            <span style={{ color: '#FFD700', fontSize: 52, minWidth: 50 }}>
              {index + 1}
            </span>
            <span style={{ lineHeight: 1.4 }}>{item}</span>
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

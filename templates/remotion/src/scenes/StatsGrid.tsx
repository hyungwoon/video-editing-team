import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface StatsGridProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const stats = [
  { number: 18, label: 'Agents', color: '#FFD700' },
  { number: 125, label: 'Skills', color: '#FFFFFF' },
  { number: 19, label: 'Knowledge Docs', color: '#FFFFFF' },
  { number: 4, label: 'RLVR Loops', color: '#FFD700' },
]

export const StatsGrid: React.FC<StatsGridProps> = ({ backgroundColor = '#111111' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 36,
        color: '#888',
        textAlign: 'center',
        marginBottom: 60,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        CEO Staff Agent System
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, width: '100%', maxWidth: 800 }}>
        {stats.map((stat, i) => {
          const delay = i * 10
          const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 200 } })
          const currentNum = Math.round(stat.number * progress)

          return (
            <div key={i} style={{
              textAlign: 'center',
              opacity: progress,
              transform: `scale(${0.8 + progress * 0.2})`,
            }}>
              <div style={{
                fontFamily: 'SUIT Variable, sans-serif',
                fontSize: 120,
                fontWeight: 700,
                color: stat.color,
                lineHeight: 1,
              }}>
                {currentNum}
              </div>
              <div style={{
                fontFamily: 'SUIT Variable, sans-serif',
                fontSize: 28,
                color: '#888',
                marginTop: 8,
              }}>
                {stat.label}
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

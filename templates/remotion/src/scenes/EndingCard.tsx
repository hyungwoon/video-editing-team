import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

interface EndingCardProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

export const EndingCard: React.FC<EndingCardProps> = ({
  backgroundColor = '#000000',
}) => {
  const frame = useCurrentFrame()

  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const textY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 60,
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          fontFamily: 'SUIT Variable, sans-serif',
          fontWeight: 700,
          fontSize: 72,
          color: '#FFFFFF',
          letterSpacing: 8,
        }}
      >
        ANTIEGG
      </div>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontFamily: 'SUIT Variable, sans-serif',
          fontWeight: 400,
          fontSize: 36,
          color: '#AAAAAA',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        더 많은 이야기는
        <br />
        <span style={{ color: '#FFD700', fontWeight: 700 }}>antiegg.kr</span>
        {' '}에서
      </div>
    </AbsoluteFill>
  )
}

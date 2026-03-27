import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

interface QuoteCardProps {
  text: string
  highlightWord?: string
  backgroundColor?: string
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  text,
  backgroundColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()

  const quoteOpacity = interpolate(frame, [0, 10], [0, 0.3], {
    extrapolateRight: 'clamp',
  })
  const textOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const textY = interpolate(frame, [5, 20], [20, 0], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: quoteOpacity,
          fontFamily: 'Georgia, serif',
          fontSize: 200,
          color: '#FFD700',
          position: 'absolute',
          top: 600,
          left: 60,
          lineHeight: 1,
        }}
      >
        "
      </div>
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontFamily: 'SUIT Variable, sans-serif',
          fontWeight: 700,
          fontSize: 56,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
          maxWidth: 900,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  )
}

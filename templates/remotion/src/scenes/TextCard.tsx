import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface TextCardProps {
  text: string
  highlightWord?: string
  backgroundColor?: string
}

export const TextCard: React.FC<TextCardProps> = ({
  text,
  highlightWord,
  backgroundColor = '#111111',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  })
  const translateY =
    spring({ frame, fps, config: { damping: 200 } }) * -20 + 20

  const renderText = () => {
    if (!highlightWord) {
      return text
    }

    const parts = text.split(highlightWord)
    return parts.flatMap((part, i) =>
      i < parts.length - 1
        ? [
            <React.Fragment key={`t-${i}`}>{part}</React.Fragment>,
            <span key={`h-${i}`} style={{ color: '#FFD700' }}>
              {highlightWord}
            </span>,
          ]
        : [<React.Fragment key={`t-${i}`}>{part}</React.Fragment>],
    )
  }

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
          opacity,
          transform: `translateY(${translateY}px)`,
          fontFamily: 'SUIT Variable, sans-serif',
          fontWeight: 700,
          fontSize: 64,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
        }}
      >
        {renderText()}
      </div>
    </AbsoluteFill>
  )
}

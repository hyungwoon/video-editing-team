import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface ProcessFlowProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const steps = [
  '요청 수신',
  '브레인스토밍 게이트',
  '도메인 분류',
  '에이전트 선택',
  '스킬 참조',
  '지식 검증',
  '응답 생성',
]

export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  backgroundColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 60,
    }}>
      {/* Title */}
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 38, fontWeight: 700, color: '#FFFFFF',
        textAlign: 'center', marginBottom: 40,
        opacity: titleOpacity,
      }}>
        Processing Pipeline
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0, width: '100%', maxWidth: 600,
      }}>
        {steps.map((step, i) => {
          const delay = 8 + i * 10
          const progress = spring({
            frame: Math.max(0, frame - delay), fps,
            config: { damping: 200 },
          })

          const isActive = frame >= delay + 5
          const bgColor = isActive ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)'
          const borderColor = isActive ? '#FFD700' : '#333'
          const numColor = isActive ? '#FFD700' : '#666'
          const textColor = isActive ? '#FFFFFF' : '#999'

          return (
            <React.Fragment key={i}>
              {/* Step box */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: bgColor,
                border: `2px solid ${borderColor}`,
                borderRadius: 16, padding: '20px 28px',
                width: '100%',
                opacity: progress,
                transform: `translateY(${(1 - progress) * 30}px)`,
              }}>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 32, fontWeight: 700, color: numColor,
                  minWidth: 48, textAlign: 'center',
                }}>
                  {i + 1}
                </span>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 30, fontWeight: 600, color: textColor,
                }}>
                  {step}
                </span>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div style={{
                  fontSize: 28, color: '#444',
                  textAlign: 'center', padding: '4px 0',
                  opacity: spring({
                    frame: Math.max(0, frame - delay - 5), fps,
                    config: { damping: 200 },
                  }),
                }}>
                  ↓
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

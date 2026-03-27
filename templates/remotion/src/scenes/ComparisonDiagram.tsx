import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface ComparisonDiagramProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const leftItems = ['회사 맥락 모름', '매번 리셋', '일반적 답변']
const rightItems = ['온톨로지 기반', '피드백 학습', '전문가 수준']

export const ComparisonDiagram: React.FC<ComparisonDiagramProps> = ({
  backgroundColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const vsProgress = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 200 } })

  return (
    <AbsoluteFill style={{
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 50,
    }}>
      {/* Title */}
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 36, fontWeight: 700, color: '#FFFFFF',
        textAlign: 'center', marginBottom: 60,
        opacity: titleOpacity,
      }}>
        What&apos;s Different?
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-start',
        gap: 20, width: '100%', maxWidth: 960,
      }}>
        {/* Left: Generic LLM */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 30, fontWeight: 700, color: '#888',
            textAlign: 'center', marginBottom: 28,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            범용 LLM
          </div>
          {leftItems.map((item, i) => {
            const delay = 10 + i * 8
            const progress = spring({
              frame: Math.max(0, frame - delay), fps,
              config: { damping: 200 },
            })
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #333',
                borderRadius: 12, padding: '22px 20px',
                marginBottom: 16,
                opacity: progress,
                transform: `translateX(${(1 - progress) * -40}px)`,
              }}>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 28, color: '#666',
                }}>
                  ✕
                </span>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 26, fontWeight: 600, color: '#888',
                }}>
                  {item}
                </span>
              </div>
            )
          })}
        </div>

        {/* VS Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minWidth: 70, paddingTop: 80,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 22, fontWeight: 700, color: '#000',
            opacity: vsProgress,
            transform: `scale(${vsProgress})`,
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
          }}>
            VS
          </div>
        </div>

        {/* Right: Agent Team */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 30, fontWeight: 700, color: '#FFD700',
            textAlign: 'center', marginBottom: 28,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            에이전트 팀
          </div>
          {rightItems.map((item, i) => {
            const delay = 30 + i * 8
            const progress = spring({
              frame: Math.max(0, frame - delay), fps,
              config: { damping: 200 },
            })
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255, 215, 0, 0.08)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: 12, padding: '22px 20px',
                marginBottom: 16,
                opacity: progress,
                transform: `translateX(${(1 - progress) * 40}px)`,
              }}>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 28, color: '#FFD700',
                }}>
                  ✓
                </span>
                <span style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 26, fontWeight: 600, color: '#FFFFFF',
                }}>
                  {item}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface ContentPipelineProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const stages = [
  { name: 'Monitor', desc: 'Slack · Notion · 외부 동향', color: '#3B82F6', icon: '👁️' },
  { name: 'Draft', desc: '소재 발굴 → 주제 선정', color: '#8B5CF6', icon: '✏️' },
  { name: 'SEO/GEO/AEO', desc: '검색 + AI 검색 최적화', color: '#10B981', icon: '🔍' },
  { name: 'Humanize', desc: 'AI 흔적 제거 · 톤 조정', color: '#F59E0B', icon: '🧹' },
  { name: 'Publish', desc: '블로그 발행 · 배포', color: '#EF4444', icon: '🚀' },
]

export const ContentPipeline: React.FC<ContentPipelineProps> = ({ backgroundColor = '#0a0a0a' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 38,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 50,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Content Marketing Pipeline
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 800 }}>
        {stages.map((stage, i) => {
          const delay = i * 15
          const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 200 } })

          return (
            <React.Fragment key={i}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: `${stage.color}18`,
                borderLeft: `4px solid ${stage.color}`,
                borderRadius: 12,
                padding: '18px 24px',
                opacity: progress,
                transform: `translateY(${(1 - progress) * 30}px)`,
              }}>
                <span style={{ fontSize: 32, minWidth: 40, textAlign: 'center' }}>{stage.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 30, fontWeight: 700, color: stage.color,
                  }}>
                    {stage.name}
                  </div>
                  <div style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 20, color: '#999', marginTop: 2,
                  }}>
                    {stage.desc}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 24, fontWeight: 700, color: '#444',
                }}>
                  {i + 1}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div style={{
                  textAlign: 'center',
                  fontSize: 24,
                  color: '#333',
                  opacity: spring({ frame: Math.max(0, frame - delay - 8), fps, config: { damping: 200 } }),
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

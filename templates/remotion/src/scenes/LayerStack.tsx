import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface LayerStackProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const layers = [
  { name: 'Memory / RLVR', desc: '피드백 기억 + 학습', color: '#8B5CF6', icon: '🧠' },
  { name: 'Knowledge Base', desc: '온톨로지 + 분석 문서', color: '#3B82F6', icon: '📚' },
  { name: 'Plugins / Skills', desc: '도메인별 전문 지식', color: '#10B981', icon: '🔧' },
  { name: 'Agents', desc: '18개 전문 에이전트', color: '#F59E0B', icon: '🤖' },
  { name: 'Rules', desc: '라우팅 + 게이트', color: '#EF4444', icon: '📋' },
]

export const LayerStack: React.FC<LayerStackProps> = ({ backgroundColor = '#0a0a0a' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill style={{ backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 40,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 50,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        5-Layer Architecture
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 800 }}>
        {layers.map((layer, i) => {
          const reverseI = layers.length - 1 - i
          const delay = reverseI * 12
          const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 200 } })

          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 20,
              background: `${layer.color}22`,
              borderLeft: `4px solid ${layer.color}`,
              borderRadius: 12,
              padding: '20px 28px',
              opacity: progress,
              transform: `translateX(${(1 - progress) * 60}px)`,
            }}>
              <span style={{ fontSize: 36 }}>{layer.icon}</span>
              <div>
                <div style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 32, fontWeight: 700, color: '#FFFFFF',
                }}>
                  {layer.name}
                </div>
                <div style={{
                  fontFamily: 'SUIT Variable, sans-serif',
                  fontSize: 22, color: '#aaa', marginTop: 4,
                }}>
                  {layer.desc}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

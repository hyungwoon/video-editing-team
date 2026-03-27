import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface OntologyGridProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const factOntologies = [
  '회사 개요', '팀', '제품', '기술',
  '시장', '트랙션', '투자', '로드맵',
  '고객', '브랜드', '경쟁사', '운영',
]

const analysisDocuments = [
  '유닛이코노믹스', '경쟁해자', '성장진단',
  'SaaS전환', 'GTM', '글로벌', '투자준비도',
]

export const OntologyGrid: React.FC<OntologyGridProps> = ({
  backgroundColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor, padding: 50 }}>
      {/* Title */}
      <div style={{
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 38, fontWeight: 700, color: '#FFFFFF',
        textAlign: 'center', marginBottom: 40, marginTop: 100,
        opacity: titleOpacity,
      }}>
        Knowledge Base Ontology
      </div>

      <div style={{ display: 'flex', gap: 24, width: '100%', height: '100%', maxHeight: 1400 }}>
        {/* Left Column: Fact Ontology */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 26, fontWeight: 700, color: '#60A5FA',
            textAlign: 'center', marginBottom: 20,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            Fact Ontology (12)
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 12, flex: 1,
          }}>
            {factOntologies.map((item, i) => {
              const delay = 10 + i * 3
              const progress = spring({
                frame: Math.max(0, frame - delay), fps,
                config: { damping: 200 },
              })
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 10, padding: '12px 14px',
                  opacity: progress,
                  transform: `scale(${0.85 + progress * 0.15})`,
                }}>
                  <span style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 18, fontWeight: 700, color: '#60A5FA',
                    minWidth: 28, textAlign: 'center',
                    background: 'rgba(59, 130, 246, 0.25)',
                    borderRadius: 6, padding: '2px 6px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 22, fontWeight: 600, color: '#FFFFFF',
                  }}>
                    {item}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Analysis */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 26, fontWeight: 700, color: '#34D399',
            textAlign: 'center', marginBottom: 20,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}>
            Analysis (7)
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            {analysisDocuments.map((item, i) => {
              const delay = 20 + i * 4
              const progress = spring({
                frame: Math.max(0, frame - delay), fps,
                config: { damping: 200 },
              })
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 10, padding: '16px 18px',
                  opacity: progress,
                  transform: `translateX(${(1 - progress) * 40}px)`,
                }}>
                  <span style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 18, fontWeight: 700, color: '#34D399',
                    minWidth: 28, textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.25)',
                    borderRadius: 6, padding: '2px 6px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{
                    fontFamily: 'SUIT Variable, sans-serif',
                    fontSize: 24, fontWeight: 600, color: '#FFFFFF',
                  }}>
                    {item}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

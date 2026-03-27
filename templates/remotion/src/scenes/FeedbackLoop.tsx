import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface FeedbackLoopProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const nodes = [
  { label: '피드백 감지', angle: -Math.PI / 2 },
  { label: '분류 & 저장', angle: 0 },
  { label: '학습 반영', angle: Math.PI / 2 },
  { label: '품질 향상', angle: Math.PI },
]

export const FeedbackLoop: React.FC<FeedbackLoopProps> = ({
  backgroundColor = '#0a0a0a',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const centerX = 540
  const centerY = 960
  const radius = 300

  const centerProgress = spring({ frame, fps, config: { damping: 200 } })
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Title */}
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 38, fontWeight: 700, color: '#FFFFFF',
        opacity: titleOpacity,
      }}>
        Feedback Learning Loop
      </div>

      {/* Center circle: RLVR */}
      <div style={{
        position: 'absolute',
        left: centerX - 80, top: centerY - 80,
        width: 160, height: 160,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 36, fontWeight: 700, color: '#000',
        opacity: centerProgress,
        transform: `scale(${centerProgress})`,
        boxShadow: '0 0 50px rgba(255, 215, 0, 0.35)',
      }}>
        RLVR
      </div>

      {/* Outer nodes */}
      {nodes.map((node, i) => {
        const delay = 15 + i * 12
        const progress = spring({
          frame: Math.max(0, frame - delay), fps,
          config: { damping: 200 },
        })

        const isActive = frame >= delay + 8
        const x = centerX + Math.cos(node.angle) * radius
        const y = centerY + Math.sin(node.angle) * radius
        const nodeW = 180
        const nodeH = 70

        return (
          <React.Fragment key={i}>
            {/* Connection line */}
            <svg
              style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }}
              viewBox="0 0 1080 1920"
            >
              <line
                x1={centerX} y1={centerY}
                x2={x} y2={y}
                stroke={isActive ? '#FFD700' : '#333'}
                strokeWidth={2}
                strokeDasharray="8,4"
                opacity={progress * 0.6}
              />
            </svg>

            {/* Node */}
            <div style={{
              position: 'absolute',
              left: x - nodeW / 2, top: y - nodeH / 2,
              width: nodeW, height: nodeH,
              borderRadius: 16,
              background: isActive ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${isActive ? '#FFD700' : '#333'}`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              fontFamily: 'SUIT Variable, sans-serif',
              fontSize: 24, fontWeight: 600,
              color: isActive ? '#FFD700' : '#999',
              opacity: progress,
              transform: `scale(${0.8 + progress * 0.2})`,
            }}>
              {node.label}
            </div>

            {/* Clockwise arrow hint */}
            <svg
              style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920 }}
              viewBox="0 0 1080 1920"
            >
              {(() => {
                const next = nodes[(i + 1) % nodes.length]
                const midAngle = (node.angle + next.angle) / 2 + (i === 3 ? Math.PI : 0)
                const arrowR = radius + 60
                const ax = centerX + Math.cos(midAngle) * arrowR
                const ay = centerY + Math.sin(midAngle) * arrowR
                const arrowDelay = delay + 8
                const arrowProgress = spring({
                  frame: Math.max(0, frame - arrowDelay), fps,
                  config: { damping: 200 },
                })
                const rotation = (midAngle * 180 / Math.PI) + 90
                return (
                  <text
                    x={ax} y={ay}
                    fill="#FFD700"
                    fontSize={28}
                    textAnchor="middle"
                    dominantBaseline="central"
                    opacity={arrowProgress * 0.7}
                    transform={`rotate(${rotation}, ${ax}, ${ay})`}
                  >
                    ▸
                  </text>
                )
              })()}
            </svg>
          </React.Fragment>
        )
      })}
    </AbsoluteFill>
  )
}

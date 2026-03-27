import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion'

interface AgentHubProps {
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

const agents = [
  'Product', 'Marketing', 'Sales', 'Finance',
  'Research', 'Data', 'Legal', 'BizDev',
  'HR', 'Design', 'PR', 'Dev',
  'Security', 'Compliance', 'Writing', 'Productivity', 'TA-Ops',
]

export const AgentHub: React.FC<AgentHubProps> = ({ backgroundColor = '#0a0a0a' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const centerX = 540
  const centerY = 960

  const hubProgress = spring({ frame, fps, config: { damping: 200 } })

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Title */}
      <div style={{
        position: 'absolute', top: 160, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'SUIT Variable, sans-serif',
        fontSize: 40, fontWeight: 700, color: '#FFFFFF',
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Agent Hub System
      </div>

      {/* Center hub */}
      <div style={{
        position: 'absolute',
        left: centerX - 90, top: centerY - 90,
        width: 180, height: 180,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        opacity: hubProgress,
        transform: `scale(${hubProgress})`,
        boxShadow: '0 0 40px rgba(255,215,0,0.3)',
      }}>
        <div style={{ fontFamily: 'SUIT Variable, sans-serif', fontSize: 22, fontWeight: 700, color: '#000' }}>CEO</div>
        <div style={{ fontFamily: 'SUIT Variable, sans-serif', fontSize: 18, fontWeight: 700, color: '#333' }}>STAFF</div>
      </div>

      {/* Surrounding agents */}
      {agents.map((agent, i) => {
        const delay = 15 + i * 3
        const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 200 } })

        const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2
        const radius = 320
        const x = centerX + Math.cos(angle) * radius - 55
        const y = centerY + Math.sin(angle) * radius - 22

        return (
          <div key={i} style={{
            position: 'absolute',
            left: x, top: y,
            width: 110, height: 44,
            borderRadius: 22,
            background: '#1a1a1a',
            border: '1px solid #333',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'SUIT Variable, sans-serif',
            fontSize: 16, fontWeight: 600, color: '#fff',
            opacity: progress,
            transform: `scale(${progress})`,
          }}>
            {agent}
          </div>
        )
      })}
    </AbsoluteFill>
  )
}

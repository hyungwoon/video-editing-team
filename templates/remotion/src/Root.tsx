import React from 'react'
import { Composition } from 'remotion'
import { ShortformComposition } from './ShortformComposition'
import { StatsGrid } from './scenes/StatsGrid'
import { LayerStack } from './scenes/LayerStack'
import { AgentHub } from './scenes/AgentHub'
import { ContentPipeline } from './scenes/ContentPipeline'

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="ShortformComposition"
      component={ShortformComposition}
      durationInFrames={1800}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        scenes: [
          {
            type: 'text' as const,
            text: '왜 AI 시대에\n사람이 더 중요할까요?',
            highlightWord: 'AI 시대',
            animation: 'fadeIn' as const,
            durationFrames: 90,
          },
          {
            type: 'text' as const,
            text: 'AI가 대체하는 건\n직업이 아니라 태도입니다',
            highlightWord: '태도',
            animation: 'fadeIn' as const,
            durationFrames: 150,
          },
          {
            type: 'ending' as const,
            text: '',
            animation: 'fadeIn' as const,
            durationFrames: 90,
          },
        ],
      }}
    />
    <Composition
      id="StatsGrid"
      component={StatsGrid}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="LayerStack"
      component={LayerStack}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="AgentHub"
      component={AgentHub}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ContentPipeline"
      component={ContentPipeline}
      durationInFrames={210}
      fps={30}
      width={1080}
      height={1920}
    />
    </>
  )
}

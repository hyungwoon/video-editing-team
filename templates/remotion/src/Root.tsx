import React from 'react'
import { Composition } from 'remotion'
import { ShortformComposition } from './ShortformComposition'
import { StatsGrid } from './scenes/StatsGrid'
import { LayerStack } from './scenes/LayerStack'
import { AgentHub } from './scenes/AgentHub'
import { ContentPipeline } from './scenes/ContentPipeline'
import { OntologyGrid } from './scenes/OntologyGrid'
import { ProcessFlow } from './scenes/ProcessFlow'
import { ComparisonDiagram } from './scenes/ComparisonDiagram'
import { FeedbackLoop } from './scenes/FeedbackLoop'
import { AudioSyncedComposition } from './AudioSyncedComposition'
import { compositions } from './compositionData'

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
    <Composition
      id="OntologyGrid"
      component={OntologyGrid}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ProcessFlow"
      component={ProcessFlow}
      durationInFrames={210}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ComparisonDiagram"
      component={ComparisonDiagram}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FeedbackLoop"
      component={FeedbackLoop}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
    {compositions.map((comp) => (
      <Composition
        key={comp.id}
        id={comp.id}
        component={AudioSyncedComposition}
        durationInFrames={Math.round(comp.props.totalSec * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={comp.props}
      />
    ))}
    </>
  )
}

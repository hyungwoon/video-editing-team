import React from 'react'
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from 'remotion'
import { TextCard } from './scenes/TextCard'
import { EndingCard } from './scenes/EndingCard'
import { QuoteCard } from './scenes/QuoteCard'
import { ListCard } from './scenes/ListCard'
import { StatsGrid } from './scenes/StatsGrid'
import { LayerStack } from './scenes/LayerStack'
import { AgentHub } from './scenes/AgentHub'
import { ContentPipeline } from './scenes/ContentPipeline'
import { OntologyGrid } from './scenes/OntologyGrid'
import { ProcessFlow } from './scenes/ProcessFlow'
import { ComparisonDiagram } from './scenes/ComparisonDiagram'
import { FeedbackLoop } from './scenes/FeedbackLoop'
import { SubtitleOverlay, SubtitleEntry } from './scenes/SubtitleOverlay'

export interface SceneDef {
  type: 'text' | 'quote' | 'list' | 'ending' | 'stats' | 'layers' | 'agenthub' | 'pipeline' | 'ontologyGrid' | 'processFlow' | 'comparison' | 'feedbackLoop'
  startSec: number
  endSec: number
  text?: string
  highlightWord?: string
  backgroundColor?: string
}

interface AudioSyncedProps {
  audioFile: string
  introVideo?: string
  outroVideo?: string
  introSec: number
  outroStartSec: number
  totalSec: number
  scenes: SceneDef[]
  subtitles: SubtitleEntry[]
}

const SCENE_MAP: Record<string, React.FC<any>> = {
  text: TextCard,
  quote: QuoteCard,
  list: ListCard,
  ending: EndingCard,
  stats: StatsGrid,
  layers: LayerStack,
  agenthub: AgentHub,
  pipeline: ContentPipeline,
  ontologyGrid: OntologyGrid,
  processFlow: ProcessFlow,
  comparison: ComparisonDiagram,
  feedbackLoop: FeedbackLoop,
}

export const AudioSyncedComposition: React.FC<AudioSyncedProps> = ({
  audioFile,
  introVideo,
  outroVideo,
  introSec,
  outroStartSec,
  totalSec,
  scenes,
  subtitles,
}) => {
  const { fps } = useVideoConfig()

  const introFrames = Math.round(introSec * fps)
  const outroStartFrame = Math.round(outroStartSec * fps)
  const totalFrames = Math.round(totalSec * fps)
  const outroFrames = totalFrames - outroStartFrame

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Continuous audio track */}
      <Audio src={staticFile(audioFile)} />

      {/* Intro: speaker video */}
      {introVideo && (
        <Sequence from={0} durationInFrames={introFrames}>
          <OffthreadVideo
            src={staticFile(introVideo)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Sequence>
      )}

      {/* Middle: Remotion graphics synced to audio */}
      {scenes.map((scene, i) => {
        const from = Math.round(scene.startSec * fps)
        const duration = Math.round((scene.endSec - scene.startSec) * fps)
        const Component = SCENE_MAP[scene.type] || TextCard

        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <Component
              text={scene.text || ''}
              highlightWord={scene.highlightWord}
              backgroundColor={scene.backgroundColor}
            />
          </Sequence>
        )
      })}

      {/* Outro: speaker video */}
      {outroVideo && (
        <Sequence from={outroStartFrame} durationInFrames={outroFrames}>
          <OffthreadVideo
            src={staticFile(outroVideo)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Sequence>
      )}

      {/* Subtitle overlay — always on top, synced to audio */}
      <SubtitleOverlay subtitles={subtitles} />
    </AbsoluteFill>
  )
}

import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { TextCard } from './scenes/TextCard'
import { EndingCard } from './scenes/EndingCard'
import { QuoteCard } from './scenes/QuoteCard'
import { ListCard } from './scenes/ListCard'

export interface Scene {
  type: 'text' | 'quote' | 'list' | 'ending'
  text: string
  highlightWord?: string
  backgroundColor?: string
  animation: 'fadeIn' | 'typing' | 'slideUp'
  durationFrames: number
}

interface Props {
  scenes: Scene[]
}

const SCENE_COMPONENTS = {
  text: TextCard,
  quote: QuoteCard,
  list: ListCard,
  ending: EndingCard,
} as const

export const ShortformComposition: React.FC<Props> = ({ scenes }) => {
  let currentFrame = 0

  return (
    <AbsoluteFill style={{ backgroundColor: '#111111' }}>
      {scenes.map((scene, index) => {
        const from = currentFrame
        currentFrame += scene.durationFrames

        const Component = SCENE_COMPONENTS[scene.type] || TextCard

        return (
          <Sequence key={index} from={from} durationInFrames={scene.durationFrames}>
            <Component
              text={scene.text}
              highlightWord={scene.highlightWord}
              backgroundColor={scene.backgroundColor}
            />
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}

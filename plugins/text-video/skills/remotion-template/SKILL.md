---
name: remotion-template
description: Remotion 기반 세로형 숏폼 컴포지션 가이드. 1080x1920 캔버스, 장면 컴포넌트, 텍스트 애니메이션, renderMedia() 호출 방법을 포함한다.
---

# Remotion Template Skill

## 기본 설정

### 컴포지션 규격

| 속성 | 값 |
|------|------|
| 너비 | 1080 |
| 높이 | 1920 |
| FPS | 30 |
| 기본 길이 | 1800 frames (60초) |
| 코덱 | H.264 |
| 출력 | MP4 |

## AudioSyncedComposition (프로덕션 컴포지션)

화자 영상 + 오디오 + 다이어그램 그래픽 + CSS 자막을 단일 렌더로 합성하는 핵심 컴포지션.

### Props 인터페이스

```typescript
interface AudioSyncedProps {
  audioFile: string        // public/ 내 오디오 파일명
  introVideo?: string      // public/ 내 인트로 클립 (3-4초)
  outroVideo?: string      // public/ 내 아웃트로 클립 (3초)
  introSec: number         // 인트로 길이 (초)
  outroStartSec: number    // 아웃트로 시작 시점 (초)
  totalSec: number         // 전체 길이 (초)
  scenes: SceneDef[]       // 그래픽 장면 정의
  subtitles: SubtitleEntry[] // 자막 정의
}
```

### SceneDef (12개 장면 타입)

```typescript
interface SceneDef {
  type: 'text' | 'quote' | 'list' | 'ending' | 'stats' | 'layers' | 'agenthub' | 'pipeline' | 'ontologyGrid' | 'processFlow' | 'comparison' | 'feedbackLoop'
  startSec: number
  endSec: number
  text?: string
  highlightWord?: string
  backgroundColor?: string
}
```

### 장면 타입별 용도

| 타입 | 컴포넌트 | 레이아웃 | 용도 |
|------|---------|---------|------|
| text | TextCard | 중앙 텍스트 | 핵심 문장, 펀치라인 |
| quote | QuoteCard | 따옴표 + 인용문 | 인용, 강조 문구 |
| list | ListCard | 번호 리스트 | 항목 나열 |
| ending | EndingCard | ANTIEGG CTA | 엔딩 |
| stats | StatsGrid | 2x2 숫자 그리드 | 스펙 숫자 |
| layers | LayerStack | 수평 컬러 바 | 아키텍처 레이어 |
| agenthub | AgentHub | 방사형 허브 | 에이전트 관계도 |
| pipeline | ContentPipeline | 세로 카드+아이콘 | 프로세스 단계 |
| ontologyGrid | OntologyGrid | 2열 카드 그리드 | 지식 체계 |
| processFlow | ProcessFlow | 번호 스텝+화살표 | 순서 흐름 |
| comparison | ComparisonDiagram | 좌우 VS 비교 | A vs B 비교 |
| feedbackLoop | FeedbackLoop | 원형 순환 | 반복 루프 |

### 구성 예시 (compositionData.ts)

```typescript
{
  id: 'Hook001',
  props: {
    audioFile: 'h001-audio.m4a',
    introVideo: 'h001-intro.mp4',
    outroVideo: 'h001-outro.mp4',
    introSec: 4,
    outroStartSec: 55,
    totalSec: 58,
    scenes: [
      { type: 'comparison', startSec: 4, endSec: 22 },
      { type: 'ontologyGrid', startSec: 22, endSec: 42 },
      { type: 'text', startSec: 42, endSec: 55, text: '핵심 메시지', highlightWord: '핵심' },
    ],
    subtitles: [
      { startSec: 0, endSec: 4, text: '인트로 자막' },
      // ...
    ],
  }
}
```

## 장면 컴포넌트 패턴

### TextCard — 텍스트 카드 장면

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface TextCardProps {
  text: string
  highlightWord?: string
  backgroundColor?: string
}

export const TextCard: React.FC<TextCardProps> = ({
  text,
  highlightWord,
  backgroundColor = '#111111',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const translateY = spring({ frame, fps, config: { damping: 200 } }) * -20 + 20

  return (
    <AbsoluteFill style={{ backgroundColor, justifyContent: 'center', alignItems: 'center', padding: 80 }}>
      <div style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: 'SUIT Variable',
        fontWeight: 700,
        fontSize: 64,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 1.4,
      }}>
        {highlightWord
          ? text.split(highlightWord).flatMap((part, i, arr) =>
              i < arr.length - 1
                ? [part, <span key={i} style={{ color: '#FFD700' }}>{highlightWord}</span>]
                : [part]
            )
          : text}
      </div>
    </AbsoluteFill>
  )
}
```

### EndingCard — ANTIEGG CTA 엔딩

ANTIEGG 로고 + "더 많은 이야기는 antiegg.kr 에서" CTA 표시.
배경: #000000, 로고 페이드인 + 텍스트 슬라이드업.

### QuoteCard — 인용문 장면

큰 따옴표 + 인용 텍스트 + 출처. 배경: 다크 그라데이션.

### ListCard — 리스트 장면

번호/불릿 항목이 하나씩 spring 애니메이션으로 나타남.

## 렌더링

### CLI 렌더링

```bash
cd templates/remotion
npx remotion render src/index.ts Hook001 ../../output/Hook001-v2.mp4
```

### 등록된 컴포지션 ID

| ID | 내용 | 길이 |
|----|------|------|
| Hook001 | 온톨로지 = AI 장기 근속자 | 58초 |
| Hook002 | 피드백 루프 | 55초 |
| Hook003 | CEO 스태프 시스템 | 63초 |
| Hook004 | 콘텐츠 파이프라인 | 57초 |
| Process001 | 5레이어 아키텍처 | 51초 |
| Process002 | 온톨로지 구축법 | 87초 |
| Process003 | 에이전트 팀 구조 | 67초 |
| Process004 | 콘텐츠 마케팅 파이프라인 | 105초 |

### 레거시: ShortformComposition

`ShortformComposition.tsx`는 텍스트 전용 레거시 컴포지션 (4 타입만 지원, 오디오/비디오/자막 없음). 새 영상에는 `AudioSyncedComposition` 사용.

### 프로그래매틱 렌더링

```typescript
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'

const bundled = await bundle({ entryPoint: './src/index.ts' })
const composition = await selectComposition({
  serveUrl: bundled,
  id: 'ShortformComposition',
  inputProps: { scenes: scriptData },
})
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: 'h264',
  outputLocation: '../../output/text-shortform.mp4',
})
```

## SUIT 폰트 로드

```typescript
import { staticFile } from 'remotion'

const fontFace = new FontFace('SUIT Variable', `url(${staticFile('SUIT-Variable.woff2')})`)
await fontFace.load()
document.fonts.add(fontFace)
```

`public/` 폴더에 SUIT-Variable.woff2 복사 필요.

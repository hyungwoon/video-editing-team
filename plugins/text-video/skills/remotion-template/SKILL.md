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
npx remotion render src/index.ts ShortformComposition ../../output/text-shortform.mp4
```

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

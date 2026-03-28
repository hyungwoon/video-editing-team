---
name: subtitle-styling
description: ANTIEGG 브랜드 자막 스타일 가이드. SRT → ASS 변환 규칙, 화자명/대사 스타일, FFmpeg burn-in 명령을 포함한다.
---

# Subtitle Styling Skill

## ANTIEGG 자막 스타일 스펙

### 화자명

| 속성 | 값 |
|------|------|
| 형식 | `[이름]` (대괄호 포함) |
| 폰트 | SUIT Variable |
| 크기 | 44px |
| 굵기 | Bold (700) |
| 색상 | #FFD700 (골드) → ASS: `&H0000D7FF` |
| 외곽선 | #000000, 3px |
| 위치 | 화면 하단, 대사 위 |

### 대사

| 속성 | 값 |
|------|------|
| 폰트 | SUIT Variable |
| 크기 | 58px |
| 굵기 | Bold (700) |
| 색상 | #FFFFFF → ASS: `&H00FFFFFF` |
| 행간 | 138% (line-height 1.38) |
| 최대 줄 수 | 2줄 |
| 외곽선 | #000000, 3px |
| 그림자 | 0px 4px 16px rgba(0,0,0,0.7), blur 12px → ASS: Shadow=4 |

> ASS 매핑 참고: CSS `0px 4px 16px rgba(0,0,0,0.7)` → ASS `Shadow=4`. ASS는 그림자 거리(offset)만 지원하며 blur radius는 별도 제어 불가. `ScaledBorderAndShadow: yes` 로 해상도에 비례 적용.
| 위치 | 화면 하단 1/3 |

### 강조 키워드

특별히 강조할 단어:
- 색상: #FFD700 (골드) — ASS inline: `{\c&H0000D7FF&}`
- 크기: 62px — ASS inline: `{\fs62}`
- 외곽선: 4px

## SRT → SubtitleEntry 변환 규칙 (v2 — Remotion)

### 변환 절차

1. SRT 파일의 각 자막 블록을 파싱
2. 화자명 포함 시 (`[이름]` 패턴) → 화자명 제거하고 대사만 추출
3. 자막 다듬기 적용 (아래 규칙 참조)
4. SubtitleEntry 형식으로 변환

### SubtitleEntry 인터페이스

```typescript
interface SubtitleEntry {
  startSec: number   // 오디오 기준 시작 시간 (초)
  endSec: number     // 오디오 기준 끝 시간 (초)
  text: string       // 줄바꿈은 \n
}
```

### SRT → SubtitleEntry 변환 예시

입력 SRT:
```
1
00:00:01,000 --> 00:00:04,500
[형운] 사실 AI가 대체하는 건
직업이 아니라 태도입니다
```

출력 SubtitleEntry:
```json
{ "startSec": 1.0, "endSec": 4.5, "text": "사실 AI가 대체하는 건\n직업이 아니라 태도입니다" }
```

### Remotion 렌더링

SubtitleOverlay 컴포넌트가 CSS로 렌더링:

```css
font-family: 'SUIT Variable', sans-serif;
font-weight: 700;
font-size: 58px;
color: #FFFFFF;
text-shadow: -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000,
             0 0 12px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.7);
-webkit-text-stroke: 3px #000;
```

### 레거시: FFmpeg ASS Burn-in (폴백용)

Remotion 사용이 불가한 환경에서만 사용:
```bash
ffmpeg -i input.mp4 -vf "ass=subtitles.ass:fontsdir=assets/font" -c:v libx264 -crf 18 -c:a copy output.mp4
```
레거시 도구: `scripts/generate-ass.py` (SRT → ASS 변환 + 고유명사 교정 + 줄바꿈)

## 자막 다듬기 규칙 (Subtitle Refinement)

Whisper 원본 출력을 그대로 사용하지 않는다. 반드시 다듬기 과정을 거친다.

### 원칙

1. **말한 그대로 쓰지 않는다** — 구어체를 자연스러운 서면 한국어로 다듬는다
2. **고유명사를 맥락에서 추론한다** — Whisper가 틀린 고유명사는 문맥으로 교정
3. **불명확한 표현을 명확하게** — 지시어("거기", "그거")를 구체적 단어로 대체
4. **의미 보존, 표현 개선** — 뜻은 바꾸지 않되 읽기 쉽게 정리

### 다듬기 단계

1. **Whisper 원본 SRT 검토**
2. **고유명사 교정**: 인명, 회사명, 기술명 등 맥락에서 올바른 표기 추론
   - 예: "오픈 에이아이" → "OpenAI", "챗지피티" → "ChatGPT"
   - 예: 화자가 "네이버" 말했는데 Whisper가 "내이버"로 인식 → "네이버"
3. **구어체 정리**: 말 더듬, 반복, 군더더기("음", "어", "그래서 뭐냐면") 제거
4. **문장 재구성**: 긴 문장 분할, 어순 정리, 조사 교정
5. **2줄 이내 유지**: 자막 한 블록이 2줄(최대 32자/줄)을 넘지 않도록 분할
6. **타이밍 보정**: 다듬은 텍스트에 맞게 자막 표시 시간 조정 (읽기 속도: 초당 4~5음절)

### 다듬기 예시

| Whisper 원본 | 다듬은 자막 |
|-------------|-----------|
| 어 사실 그게 뭐냐면 에이아이가 대체하는 건 직업이 아니라 태도거든요 | AI가 대체하는 건\N직업이 아니라 태도입니다 |
| 그래서 제가 오픈에이아이 챗지피티를 한 3개월 정도 써봤는데 | OpenAI ChatGPT를\N3개월간 사용해본 결과 |
| 근데 진짜 중요한 건 뭐냐면 그 이 사람들이 | 정말 중요한 건\N이 사람들이 |

### 줄바꿈 규칙

자막 줄바꿈은 기계적으로 중간 분할하지 않는다. 의미 단위로 자연스럽게 분할한다.

**줄바꿈 우선순위:**
1. 연결 어미 뒤 ("~되고", "~하고", "~있고", "~해서", "~인데", "~지만", "~니까")
2. 접속 부사 앞 ("그래서", "그리고", "근데", "하지만")
3. 문장 종결 뒤 ("~합니다.", "~거든요.", "~잖아요.")
4. 주어/목적어 뒤 (자연스러운 호흡 단위)

**금지:**
- 조사 앞에서 끊기 ("온톨로지를" → "온톨로지\N를" ❌)
- 단어 중간에서 끊기
- 한쪽이 5자 미만인 불균형 분할

**예시:**
| 잘못된 줄바꿈 | 올바른 줄바꿈 |
|-------------|------------|
| 온톨로지를 구축하면 AI가 회사의 장기\N근속자가 됩니다 | 온톨로지를 구축하면\NAI가 회사의 장기 근속자가 됩니다 |
| CEO 스태프 에이전트 시스\N템에는 18개의 에이전트 | CEO 스태프 에이전트 시스템에는\N18개의 에이전트가 있습니다 |

### 자동화 불가 항목 (Claude가 반드시 수동 처리)

- 고유명사 맥락 추론 (Whisper가 못 하는 영역)
- 구어체→서면체 변환
- 의미 단위 줄바꿈 결정
- 화자 의도에 맞는 강조 키워드 선택

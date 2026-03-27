# Video Editing Team — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** ANTIEGG 브랜드 숏폼 영상 제작을 자동화하는 에이전트 팀 + Claude Code 스킬 시스템 구축

**Architecture:** 에이전트 `.md` 파일이 분석/기획을 담당하고, Claude Code 스킬이 FFmpeg/Remotion 파이프라인을 오케스트레이션. `antiegg-shortform-templates` 레포의 디자인 가이드를 자막/오버레이 스타일의 원천으로 사용.

**Tech Stack:** FFmpeg (시스템 설치), Whisper (로컬 STT), Remotion (React 기반 비디오), SUIT Variable 폰트, ASS 자막

---

### Task 1: 프로젝트 스캐폴드 + CLAUDE.md

**Files:**
- Create: `_tools/video-editing-team/CLAUDE.md`
- Create: `_tools/video-editing-team/.gitignore`
- Create: `_tools/video-editing-team/output/.gitkeep`

**Step 1: 디렉토리 구조 생성**

```bash
cd /Users/hyungwoon/Documents/AI/_tools/video-editing-team
mkdir -p agents plugins/video-source/skills/highlight-analysis \
  plugins/video-source/skills/subtitle-styling \
  plugins/text-video/skills/script-writing \
  plugins/text-video/skills/remotion-template \
  .claude/skills/cut-shortform \
  .claude/skills/text-to-video \
  assets/logo assets/font \
  templates templates/remotion \
  output
```

**Step 2: .gitignore 작성**

```gitignore
node_modules/
output/*.mp4
output/*.ass
.DS_Store
*.log
```

**Step 3: CLAUDE.md 작성**

프로젝트 개요, 에이전트 매핑 테이블, 스킬 라우팅 포함. 아래 내용:

```markdown
# CLAUDE.md

## 프로젝트 개요

ANTIEGG 숏폼 영상 제작 에이전트 팀. 촬영 영상과 텍스트 콘텐츠를 SNS 바이럴용 세로형 숏폼(~1분)으로 변환한다.

## 빠른 명령

| 명령 | 설명 |
|------|------|
| `/cut-shortform <video> [srt]` | 촬영 영상에서 후킹 숏폼 추출 + 자막 |
| `/text-to-video <text-file>` | 텍스트 콘텐츠 → Remotion 숏폼 영상 |

## 출력 규격

- 해상도: 1080x1920 (9:16 세로형)
- 프레임: 30fps
- 코덱: H.264 MP4
- 길이: ~1분 (45초~75초)

## 에이전트 매핑 테이블

| 요청 키워드 | 에이전트 | 파일 | 플러그인 스킬 |
|---|---|---|---|
| 후킹, 하이라이트, 인사이트 분석, 스크립트 | Scriptwriter | `agents/scriptwriter.md` | `video-source/` → highlight-analysis · `text-video/` → script-writing |
| 편집, 컷, 타임코드, 자막, 트랜지션 | Editor | `agents/editor.md` | `video-source/` → subtitle-styling · `text-video/` → remotion-template |

## 기술 스택

- **영상 편집**: FFmpeg (시스템 설치 필요)
- **자막 생성**: Whisper 로컬 또는 사용자 SRT 제공
- **자막 스타일**: ASS 포맷 (ANTIEGG 디자인 가이드)
- **텍스트→영상**: Remotion
- **폰트**: SUIT Variable
- **브랜드**: ANTIEGG (`antiegg-shortform-templates` 레포 참조)

## 브랜드 자막 스타일

| 요소 | 스펙 |
|------|------|
| 화자명 | `[이름]`, 44px, Bold, #FFD700 |
| 대사 | 58px, Bold, #FFFFFF, 행간 138%, 최대 2줄 |
| 폰트 | SUIT Variable |
| 외곽선 | #000000, 3px |
| 그림자 | 0px 4px 16px rgba(0,0,0,0.7) |
```

**Step 4: git init + 최초 커밋**

```bash
cd /Users/hyungwoon/Documents/AI/_tools/video-editing-team
git init
git add CLAUDE.md .gitignore output/.gitkeep docs/
git commit -m "chore: init video-editing-team project scaffold"
```

---

### Task 2: 브랜드 에셋 수집

**Files:**
- Create: `_tools/video-editing-team/assets/logo/antiegg-horizontal.svg`
- Create: `_tools/video-editing-team/assets/logo/antiegg-vertical.svg`
- Download: `_tools/video-editing-team/assets/font/SUIT-Variable.woff2`

**Step 1: ANTIEGG 로고 SVG 추출**

`antiegg-shortform-templates` 레포의 `index.html`에서 로고 SVG 2종 추출:
- 가로형 (content-logo): viewBox `0 0 323 56` — 세로 영상 하단용
- 세로형 (logo): viewBox `0 0 97 102` — 썸네일용

`gh api` 로 레포에서 `assets/logo.svg`도 확인하여 사용 가능한 에셋 추가.

**Step 2: SUIT Variable 폰트 다운로드**

```bash
curl -L -o assets/font/SUIT-Variable.woff2 \
  "https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.woff2"
```

FFmpeg libass용 TTF/OTF 버전도 필요 — SUIT GitHub에서 TTF 다운로드:

```bash
curl -L -o assets/font/SUIT-Bold.otf \
  "https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT-Bold.woff2"
```

> 참고: libass는 시스템 폰트 경로 또는 `fontsdir` 옵션으로 폰트 로드. woff2는 libass에서 직접 사용 불가하므로 OTF/TTF 필요. SUIT GitHub 레포에서 정적 OTF 파일 확인 후 다운로드.

**Step 3: 커밋**

```bash
git add assets/
git commit -m "chore: add ANTIEGG brand assets (logo SVG, SUIT font)"
```

---

### Task 3: 자막 ASS 템플릿

**Files:**
- Create: `_tools/video-editing-team/templates/subtitle.ass`

**Step 1: ASS 템플릿 작성**

ANTIEGG 디자인 가이드 스펙 반영:

```ass
[Script Info]
Title: ANTIEGG Shortform Subtitle
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV
Style: Speaker,SUIT Variable,44,&H0000D7FF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,3,0,2,40,40,120
Style: Dialogue,SUIT Variable,58,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,3,4,2,40,40,60
Style: Highlight,SUIT Variable,62,&H0000D7FF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,4,4,2,40,40,60

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
; 아래는 예시 — 실제 사용 시 SRT에서 변환하여 채움
Comment: 0,0:00:00.00,0:00:03.00,Speaker,,0,0,0,,[형운]
Comment: 0,0:00:00.00,0:00:03.00,Dialogue,,0,0,0,,여기에 자막 텍스트가 들어갑니다
```

**Step 2: 검증 — FFmpeg로 ASS 파싱 테스트**

```bash
ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=3 \
  -vf "ass=templates/subtitle.ass" \
  -frames:v 1 -y /tmp/subtitle-test.png
```

Expected: 에러 없이 PNG 생성 (폰트 미설치 시 fallback 폰트로 렌더링됨)

**Step 3: 커밋**

```bash
git add templates/subtitle.ass
git commit -m "feat: add ANTIEGG subtitle ASS template with brand styles"
```

---

### Task 4: scriptwriter 에이전트

**Files:**
- Create: `_tools/video-editing-team/agents/scriptwriter.md`

**Step 1: scriptwriter.md 작성**

```markdown
# Scriptwriter

> 촬영 영상의 후킹 포인트를 분석하고, 텍스트 콘텐츠를 숏폼 스크립트로 변환하는 기획 전문가

## 시스템 프롬프트

당신은 SNS 숏폼 콘텐츠 기획 전문가입니다.
28분 촬영 영상에서 1분짜리 바이럴 숏폼을 뽑아내거나, 텍스트 콘텐츠를 시각적 숏폼 스크립트로 변환합니다.

전문 분야:
- 후킹 포인트 식별 (인사이트 밀도 분석)
- 숏폼 구성 설계 (하이라이트 앞배치 구조)
- 텍스트→숏폼 스크립트 변환
- SNS 바이럴 콘텐츠 전략

원칙:
- 첫 3초가 전부다 — 스크롤을 멈출 후킹으로 시작
- 결론(하이라이트)을 먼저 보여주고, "왜?"를 유발한 뒤 맥락을 채운다
- 1분 안에 하나의 명확한 인사이트만 전달
- 시청자가 공유하고 싶은 "한 문장"이 반드시 있어야 한다

## 모드

### 모드 1: 촬영 영상 분석 (video-source)

입력: SRT 트랜스크립트
출력: 숏폼 후보 3~5개

각 후보는 다음 형식:

| 항목 | 내용 |
|------|------|
| 후킹 포인트 | 타임코드, 대사 인용, 후킹 이유 |
| 구성안 | 후킹(3~5초) → 맥락(30~40초) → 클라이맥스(10~15초) → 마무리(5초) |
| 예상 길이 | 45~75초 |
| 바이럴 예측 | 공유 가능한 핵심 문장 |

후킹 포인트 판별 기준:
1. **감정 전환점** — 놀라움, 반전, 강한 주장이 터지는 순간
2. **공유 인사이트** — "이거 알아?" 하고 보내고 싶은 정보
3. **궁금증 유발** — "왜?" "어떻게?" 를 일으키는 불완전한 문장
4. **수치/데이터** — 구체적 숫자가 나오는 순간
5. **대비/비교** — "A는 이런데 B는 이렇다" 구조

### 모드 2: 텍스트→스크립트 (text-video)

입력: 텍스트 콘텐츠 (기사, 블로그, 메모 등)
출력: 장면 단위 숏폼 스크립트

스크립트 구조 (8~12장면, 장면당 5~8초):

| 장면 | 시간 | 화면 | 나레이션/텍스트 |
|------|------|------|----------------|
| 1 | 0:00~0:03 | 후킹 텍스트 (큰 글씨) | 질문형/숫자형/반전형 |
| 2~9 | 0:03~0:50 | 인사이트별 텍스트 카드 | 핵심 포인트 |
| 10~12 | 0:50~1:00 | CTA + ANTIEGG 로고 | 마무리 |

후킹 오프닝 공식:
- **질문형**: "왜 ~할까요?"
- **숫자형**: "~의 3가지 비밀"
- **반전형**: "~라고 생각하시죠? 틀렸습니다"

## 액션

- analyze_transcript: SRT 트랜스크립트를 분석하여 후킹 포인트 식별
- propose_shortforms: 후킹 포인트별 숏폼 구성안 제안
- write_script: 텍스트 콘텐츠를 숏폼 스크립트로 변환

## 커뮤니케이션 스타일

구체적이고 실행 가능하게. 모든 제안에 정확한 타임코드와 이유를 포함.
"이 부분이 좋습니다" 대신 "0:45~0:52에서 '사실 AI는 ~' 발언이 후킹 — 기존 통념을 뒤집는 반전이라 스크롤을 멈출 확률이 높습니다" 수준으로 구체화.

## 플러그인 & 스킬 라우팅

| 요청 유형 | 플러그인 | 스킬 |
|---|---|---|
| 후킹 포인트 분석 | `video-source` | highlight-analysis |
| 텍스트→스크립트 | `text-video` | script-writing |
```

**Step 2: 커밋**

```bash
git add agents/scriptwriter.md
git commit -m "feat: add scriptwriter agent — hooking analysis + script writing"
```

---

### Task 5: editor 에이전트

**Files:**
- Create: `_tools/video-editing-team/agents/editor.md`

**Step 1: editor.md 작성**

```markdown
# Editor

> scriptwriter의 구성안을 실행 가능한 편집 지시서로 변환하는 편집 판단 전문가

## 시스템 프롬프트

당신은 숏폼 영상 편집 전문가입니다.
scriptwriter가 제안한 구성안을 받아서 FFmpeg/Remotion으로 바로 실행 가능한 편집 지시서를 생성합니다.

전문 분야:
- 영상 컷 편집 (정밀 타임코드)
- 자막 타이밍 조정
- 트랜지션 판단
- 오버레이/템플릿 매칭
- 출력 규격 관리 (1080x1920, 30fps)

원칙:
- 말 중간에 절대 자르지 않는다 — 문장 단위 컷
- 컷 포인트는 호흡/쉼표 위치에 맞춘다
- 하이라이트 앞배치 시 자막 타이밍도 재조정한다
- 트랜지션은 최소한으로 — 컷이 기본, 페이드는 장면 전환 시에만

## 편집 지시서 형식

### 촬영 영상 편집 지시서

| 순서 | 시작 | 끝 | 용도 | 트랜지션 |
|------|------|------|------|----------|
| 1 | 00:00:45.200 | 00:00:50.800 | 후킹 | cut |
| 2 | 00:00:12.000 | 00:00:45.200 | 맥락 | fade 0.3s |
| 3 | 00:00:50.800 | 00:01:05.400 | 클라이맥스 | cut |
| 4 | ending.mp4 | - | 엔딩 | fade 0.5s |

### 자막 재조정 규칙

하이라이트 앞배치 시:
1. 원본 SRT의 타임코드를 새로운 순서에 맞게 오프셋
2. 후킹 구간: 원본 타임코드 - 후킹 시작점 + 0
3. 맥락 구간: 원본 타임코드 - 맥락 시작점 + 후킹 길이
4. 클라이맥스: 원본 타임코드 - 클라이맥스 시작점 + 후킹 길이 + 맥락 길이

### FFmpeg 명령 생성 규칙

```bash
# 1. 구간별 컷
ffmpeg -ss {start} -to {end} -i input.mov -c copy segment_{n}.mp4

# 2. concat (트랜지션 없는 경우)
ffmpeg -f concat -safe 0 -i segments.txt -c copy joined.mp4

# 3. 자막 burn-in
ffmpeg -i joined.mp4 -vf "ass=adjusted.ass:fontsdir=assets/font" \
  -c:v libx264 -crf 18 -preset fast -c:a aac output.mp4
```

### 오버레이 템플릿 선택

| 조건 | 템플릿 |
|------|--------|
| 타이틀만 필요 | V-01 (상단 메인) |
| 타이틀 + 부제 | V-02 (상단 메인+보조) |

## 액션

- generate_edit_sheet: 구성안 → 편집 지시서 생성
- adjust_subtitles: SRT → 재조정된 ASS 변환
- select_template: 영상 내용에 맞는 오버레이 선택

## 커뮤니케이션 스타일

정밀하고 기술적. 모든 지시에 정확한 타임코드(밀리초 단위)와 FFmpeg 파라미터 포함.
모호한 표현 없이 바로 실행 가능한 수준.

## 플러그인 & 스킬 라우팅

| 요청 유형 | 플러그인 | 스킬 |
|---|---|---|
| 자막 스타일링 | `video-source` | subtitle-styling |
| Remotion 템플릿 | `text-video` | remotion-template |
```

**Step 2: 커밋**

```bash
git add agents/editor.md
git commit -m "feat: add editor agent — edit sheet generation + subtitle timing"
```

---

### Task 6: 플러그인 스킬 — highlight-analysis

**Files:**
- Create: `_tools/video-editing-team/plugins/video-source/skills/highlight-analysis/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
---
name: highlight-analysis
description: SRT 트랜스크립트에서 숏폼 후킹 포인트를 식별하는 분석 프레임워크. 인사이트 밀도, 감정 전환, 바이럴 가능성을 기준으로 하이라이트 구간을 추출한다.
---

# Highlight Analysis Skill

## 분석 프레임워크

### 1단계: 전체 트랜스크립트 스캔

SRT 파일을 읽고 다음을 파악:
- 전체 주제 / 핵심 메시지
- 화자 수 및 역할
- 전체 길이 대비 인사이트 밀도 구간

### 2단계: 후킹 포인트 스코어링

각 30초 구간에 대해 5가지 기준으로 1~5점 채점:

| 기준 | 1점 | 5점 |
|------|-----|-----|
| 감정 전환 | 평이한 설명 | 놀라움/반전/강한 주장 |
| 공유성 | 맥락 없이 이해 불가 | 한 문장으로 캡처 가능 |
| 궁금증 | 결론이 명확 | "왜? 어떻게?" 유발 |
| 구체성 | 추상적 개념 | 수치/사례/이름 포함 |
| 시각성 | 말로만 설명 | 영상으로 보여줄 게 있음 |

총점 20+ → 후킹 후보

### 3단계: 숏폼 구성

후킹 후보별 구성안 설계:

```
[후킹] 3~5초 — 가장 임팩트 있는 1~2문장
  ↓
[맥락] 30~40초 — 후킹을 이해하기 위한 배경
  ↓
[클라이맥스] 10~15초 — 후킹 포인트 전후 맥락 포함 원본 재생
  ↓
[마무리] 5초 — 여운 또는 다음 예고
```

### 4단계: 출력 형식

각 후보마다:

```
## 후보 N: [후킹 문장 요약]

**후킹 점수:** 22/25
**타임코드:** 12:34~13:28 (원본 기준)
**후킹 대사:** "실제로 AI가 대체하는 건 직업이 아니라 태도입니다"
**후킹 이유:** 기존 "AI가 일자리를 뺏는다" 통념을 뒤집는 반전

| 구간 | 원본 타임코드 | 길이 | 내용 |
|------|-------------|------|------|
| 후킹 | 12:45~12:50 | 5초 | 핵심 반전 문장 |
| 맥락 | 12:00~12:45 | 45초 | AI와 직업의 관계 설명 |
| 클라이맥스 | 12:50~13:05 | 15초 | 구체 사례 |
| 마무리 | - | 5초 | 엔딩 |

**예상 길이:** 70초
**공유 문장:** "AI가 대체하는 건 직업이 아니라 태도"
```

## 주의사항

- 후킹은 반드시 원본 대사에서 추출 — 창작 금지
- 타임코드는 SRT 기준 정확히 매칭
- 맥락 구간은 후킹을 이해하기에 충분해야 함 (너무 짧으면 의미 전달 실패)
- 한 영상에서 겹치는 구간이 있는 후보는 별도 표기
```

**Step 2: 커밋**

```bash
git add plugins/video-source/skills/highlight-analysis/
git commit -m "feat: add highlight-analysis skill — hooking point scoring framework"
```

---

### Task 7: 플러그인 스킬 — subtitle-styling

**Files:**
- Create: `_tools/video-editing-team/plugins/video-source/skills/subtitle-styling/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
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
| 색상 | #FFD700 (골드) |
| 외곽선 | #000000, 3px |
| 위치 | 화면 하단, 대사 위 |

### 대사

| 속성 | 값 |
|------|------|
| 폰트 | SUIT Variable |
| 크기 | 58px |
| 굵기 | Bold (700) |
| 색상 | #FFFFFF |
| 행간 | 138% (line-height 1.38) |
| 최대 줄 수 | 2줄 |
| 외곽선 | #000000, 3px |
| 그림자 | 0px 4px 16px rgba(0,0,0,0.7), blur 12px |
| 위치 | 화면 하단 1/3 |

### 강조 키워드

특별히 강조할 단어가 있을 때:
- 색상: #FFD700 (골드) — `{\c&H0000D7FF&}` ASS 태그
- 크기: 62px
- 외곽선: 4px

## SRT → ASS 변환 규칙

### 변환 절차

1. SRT 파일의 각 자막 블록을 파싱
2. 화자명이 포함된 경우 (`[이름]` 패턴) → Speaker 스타일 + Dialogue 스타일 분리
3. 화자명이 없는 경우 → Dialogue 스타일만 사용
4. 2줄 초과 시 → 2줄로 분할 (의미 단위)

### SRT 파싱 예시

입력 SRT:
```
1
00:00:01,000 --> 00:00:04,500
[형운] 사실 AI가 대체하는 건
직업이 아니라 태도입니다
```

출력 ASS:
```
Dialogue: 0,0:00:01.00,0:00:04.50,Speaker,,0,0,0,,[형운]
Dialogue: 0,0:00:01.00,0:00:04.50,Dialogue,,0,0,0,,사실 AI가 대체하는 건\N직업이 아니라 태도입니다
```

## FFmpeg Burn-in 명령

```bash
ffmpeg -i input.mp4 \
  -vf "ass=subtitles.ass:fontsdir=assets/font" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a copy \
  -y output.mp4
```

### 주의사항

- `fontsdir` 경로에 SUIT Variable OTF/TTF 파일이 있어야 함
- FFmpeg에 `--enable-libass` 컴파일 필요 (`ffmpeg -version`으로 확인)
- CRF 18 = 시각적으로 무손실에 가까운 품질
- 자막 위치(MarginV)는 ASS 스타일에서 제어 — FFmpeg에서 별도 조정 불필요
```

**Step 2: 커밋**

```bash
git add plugins/video-source/skills/subtitle-styling/
git commit -m "feat: add subtitle-styling skill — ANTIEGG brand subtitle specs + SRT→ASS rules"
```

---

### Task 8: 플러그인 스킬 — script-writing

**Files:**
- Create: `_tools/video-editing-team/plugins/text-video/skills/script-writing/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
---
name: script-writing
description: 텍스트 콘텐츠를 세로형 숏폼 스크립트로 변환하는 가이드. 후킹 오프닝, 장면 구성, 비주얼 지시를 포함한다.
---

# Script Writing Skill

## 텍스트→숏폼 스크립트 변환 프레임워크

### 원칙

1. 원문의 핵심을 60초에 압축 — 정보 손실 최소화, 밀도 최대화
2. 첫 3초에 스크롤을 멈출 후킹
3. 장면당 5~8초, 총 8~12장면
4. 하나의 명확한 테이크어웨이

### 스크립트 구조

| 파트 | 장면 수 | 시간 | 역할 |
|------|---------|------|------|
| 후킹 | 1 | 0~3초 | 스크롤 멈추기 |
| 도입 | 1~2 | 3~10초 | 주제 제시 |
| 본론 | 4~6 | 10~45초 | 인사이트 전달 |
| 마무리 | 1~2 | 45~55초 | 핵심 요약 |
| CTA | 1 | 55~60초 | ANTIEGG 엔딩 |

### 후킹 오프닝 3공식

**질문형:**
- "왜 ~할까요?"
- "~해본 적 있으신가요?"
- 호기심 유발, 시청자 참여 유도

**숫자형:**
- "~의 3가지 비밀"
- "10명 중 9명이 모르는 ~"
- 구체성이 신뢰감 형성

**반전형:**
- "~라고 생각하시죠? 틀렸습니다"
- "사실 ~는 ~가 아닙니다"
- 기존 통념 파괴

### 장면 지시 형식

각 장면마다:

```
## 장면 N (시간)

**화면:** [텍스트 / 이미지 / 애니메이션 설명]
**텍스트:** [화면에 표시할 텍스트]
**배경:** [색상 코드 또는 이미지]
**애니메이션:** [타이핑 / 페이드인 / 슬라이드업 / 줌인]
**나레이션:** [TTS 사용 시 읽을 텍스트] (선택)
```

### 비주얼 스타일 가이드

- 배경: 단색 다크 (#111111 ~ #1a1a1a) 또는 그라데이션
- 텍스트: SUIT Variable Bold, 중앙 정렬
- 핵심 키워드: #FFD700 (ANTIEGG 골드) 강조
- 애니메이션: 과하지 않게 — 타이핑 또는 페이드인 기본
- 로고: 마지막 장면에 ANTIEGG 가로형 로고

### 출력 형식

스크립트는 아래 테이블 + 장면 상세로 구성:

| 장면 | 시간 | 화면 요약 | 텍스트 |
|------|------|-----------|--------|
| 1 | 0:00~0:03 | 후킹 (큰 글씨) | 왜 ~할까요? |
| 2 | 0:03~0:08 | 텍스트 카드 | ~ |
| ... | ... | ... | ... |
| 12 | 0:55~1:00 | ANTIEGG CTA | antiegg.kr |
```

**Step 2: 커밋**

```bash
git add plugins/text-video/skills/script-writing/
git commit -m "feat: add script-writing skill — text-to-shortform script framework"
```

---

### Task 9: 플러그인 스킬 — remotion-template

**Files:**
- Create: `_tools/video-editing-team/plugins/text-video/skills/remotion-template/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
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

### 프로젝트 초기화

```bash
npx create-video@latest --template=blank templates/remotion
cd templates/remotion
npm install
```

### remotion.config.ts

```typescript
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
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

### QuoteCard — 인용문 장면

큰 따옴표 + 인용 텍스트 + 출처

### ListCard — 리스트 장면

번호/불릿 항목이 하나씩 나타나는 애니메이션

### EndingCard — ANTIEGG CTA 엔딩

ANTIEGG 로고 + "더 많은 이야기는 antiegg.kr 에서"

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
// src/fonts.ts
import { staticFile } from 'remotion'

const fontFace = new FontFace('SUIT Variable', `url(${staticFile('SUIT-Variable.woff2')})`)
await fontFace.load()
document.fonts.add(fontFace)
```

`public/` 폴더에 SUIT-Variable.woff2 복사 필요.
```

**Step 2: 커밋**

```bash
git add plugins/text-video/skills/remotion-template/
git commit -m "feat: add remotion-template skill — composition guide + scene components"
```

---

### Task 10: Claude Code 스킬 — cut-shortform

**Files:**
- Create: `_tools/video-editing-team/.claude/skills/cut-shortform/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
---
name: cut-shortform
description: 촬영 영상에서 후킹 숏폼을 추출하고 ANTIEGG 스타일 자막을 입힌다. /cut-shortform <video-path> [srt-path] 로 실행.
---

# /cut-shortform — 촬영 영상 → 숏폼 추출

## 사용법

```
/cut-shortform <video-path> [srt-path]
```

- `video-path`: 원본 영상 파일 경로 (.mov, .mp4)
- `srt-path`: (선택) SRT 자막 파일. 없으면 Whisper로 자동 생성.

## 실행 파이프라인

### Phase 1: 트랜스크립트 준비

SRT 파일이 제공된 경우:
- SRT 파일을 읽어서 트랜스크립트로 사용

SRT 파일이 없는 경우:
1. FFmpeg로 오디오 추출:
   ```bash
   ffmpeg -i <video> -vn -acodec pcm_s16le -ar 16000 -ac 1 /tmp/audio.wav
   ```
2. Whisper 로컬 실행:
   ```bash
   whisper /tmp/audio.wav --model medium --language ko --output_format srt --output_dir /tmp/
   ```
3. 생성된 SRT를 사용자에게 보여주고 수정 기회 제공

### Phase 2: 후킹 분석

1. `agents/scriptwriter.md` 에이전트를 참조하여 분석 수행
2. `plugins/video-source/skills/highlight-analysis/SKILL.md`의 스코어링 프레임워크 적용
3. 후보 3~5개를 사용자에게 제시:

```
## 후보 1: "AI가 대체하는 건 직업이 아니라 태도"
점수: 23/25 | 예상 길이: 65초
후킹 → 12:45~12:50 | 맥락 → 12:00~12:45 | 클라이맥스 → 12:50~13:05

## 후보 2: ...
```

4. **사용자 선택 대기** — 어떤 후보를 만들지 선택

### Phase 3: 편집 실행

1. `agents/editor.md` 에이전트를 참조하여 편집 지시서 생성
2. FFmpeg 명령 순서:

```bash
# 1. 구간별 컷 (copy 모드 — 재인코딩 없이 빠르게)
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_1.mp4
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_2.mp4
# ...

# 2. concat 리스트 작성
echo "file 'segment_1.mp4'" > segments.txt
echo "file 'segment_2.mp4'" >> segments.txt
# ...

# 3. concat
ffmpeg -f concat -safe 0 -i segments.txt -c copy joined.mp4

# 4. SRT → ASS 변환 (재조정된 타이밍)
# editor 에이전트가 타이밍 재조정한 ASS 파일 생성

# 5. 자막 burn-in + 최종 인코딩
ffmpeg -i joined.mp4 \
  -vf "ass=adjusted.ass:fontsdir=assets/font" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a aac -b:a 128k \
  -y output/shortform-{n}.mp4
```

### Phase 4: 확인

1. 출력 파일 정보 표시:
   ```bash
   ffprobe -v quiet -print_format json -show_format output/shortform-{n}.mp4
   ```
2. 파일 크기, 길이, 해상도 확인
3. 사용자에게 결과 경로 안내

## 필수 도구 확인

파이프라인 시작 전 확인:
```bash
ffmpeg -version | head -1          # FFmpeg 설치 확인
ffmpeg -filters | grep ass          # libass 지원 확인
which whisper || echo "Whisper 미설치"  # Whisper 확인 (SRT 미제공 시)
```

## 출력 규격

- 해상도: 1080x1920 (세로)
- FPS: 30
- 코덱: H.264 (libx264), CRF 18
- 오디오: AAC 128kbps
- 길이: 45~75초
```

**Step 2: 커밋**

```bash
git add .claude/skills/cut-shortform/
git commit -m "feat: add /cut-shortform skill — video source to shortform pipeline"
```

---

### Task 11: Claude Code 스킬 — text-to-video

**Files:**
- Create: `_tools/video-editing-team/.claude/skills/text-to-video/SKILL.md`

**Step 1: SKILL.md 작성**

```markdown
---
name: text-to-video
description: 텍스트 콘텐츠를 Remotion 기반 세로형 숏폼 영상으로 변환한다. /text-to-video <text-file> 로 실행.
---

# /text-to-video — 텍스트 → 숏폼 영상

## 사용법

```
/text-to-video <text-file>
```

- `text-file`: 텍스트 콘텐츠 파일 (.md, .txt)

## 실행 파이프라인

### Phase 1: 스크립트 작성

1. 텍스트 파일 읽기
2. `agents/scriptwriter.md` 에이전트 참조 (텍스트 영상 모드)
3. `plugins/text-video/skills/script-writing/SKILL.md`의 프레임워크 적용
4. 장면 단위 스크립트 생성:

```
| 장면 | 시간 | 화면 | 텍스트 | 애니메이션 |
|------|------|------|--------|-----------|
| 1 | 0:00~0:03 | 후킹 | 왜 ~할까요? | 타이핑 |
| 2 | 0:03~0:08 | 텍스트카드 | ~ | 페이드인 |
| ... | ... | ... | ... | ... |
```

5. **사용자 스크립트 확인 대기** — 수정 기회 제공

### Phase 2: Remotion 컴포지션 생성

1. `plugins/text-video/skills/remotion-template/SKILL.md` 참조
2. `templates/remotion/` 프로젝트 기반
3. 스크립트의 각 장면 → React 컴포넌트 매핑:

| 장면 타입 | 컴포넌트 |
|-----------|----------|
| 후킹 텍스트 | `TextCard` (큰 글씨, 타이핑) |
| 인사이트 | `TextCard` (강조 키워드) |
| 인용문 | `QuoteCard` |
| 리스트 | `ListCard` |
| CTA/엔딩 | `EndingCard` |

4. 컴포지션 코드 생성 (src/ShortformComposition.tsx)

### Phase 3: 렌더링

```bash
cd templates/remotion
npx remotion render src/index.ts ShortformComposition \
  --props='{"scenes": [...]}' \
  ../../output/text-shortform-{n}.mp4
```

또는 프로그래매틱:
```typescript
await renderMedia({
  composition,
  serveUrl: bundled,
  codec: 'h264',
  outputLocation: '../../output/text-shortform.mp4',
})
```

### Phase 4: 확인

1. 출력 파일 정보 표시
2. 파일 크기, 길이, 해상도 확인
3. 사용자에게 결과 경로 안내

## 필수 도구 확인

```bash
node --version                     # Node.js 18+ 필요
npx remotion --version 2>/dev/null # Remotion 설치 확인
ls templates/remotion/node_modules # 의존성 설치 확인
```

## 출력 규격

- 해상도: 1080x1920 (세로)
- FPS: 30
- 코덱: H.264
- 길이: 45~75초
```

**Step 2: 커밋**

```bash
git add .claude/skills/text-to-video/
git commit -m "feat: add /text-to-video skill — text content to Remotion shortform pipeline"
```

---

### Task 12: Remotion 보일러플레이트 초기화

**Files:**
- Create: `_tools/video-editing-team/templates/remotion/` (Remotion 프로젝트)

**Step 1: Remotion 프로젝트 생성**

```bash
cd /Users/hyungwoon/Documents/AI/_tools/video-editing-team/templates
npx create-video@latest remotion --template=blank
```

**Step 2: SUIT 폰트 복사**

```bash
cp ../../assets/font/SUIT-Variable.woff2 remotion/public/
```

**Step 3: 기본 컴포지션 설정**

`templates/remotion/src/Root.tsx` 수정 — 1080x1920, 30fps 컴포지션 등록

**Step 4: 장면 컴포넌트 스캐폴드**

`remotion-template/SKILL.md`의 TextCard 패턴을 기반으로:
- `src/scenes/TextCard.tsx`
- `src/scenes/EndingCard.tsx`
- `src/ShortformComposition.tsx`

**Step 5: 렌더 테스트**

```bash
cd templates/remotion
npx remotion render src/index.ts ShortformComposition /tmp/test-remotion.mp4
```

Expected: 1080x1920 MP4 생성

**Step 6: 커밋**

```bash
cd /Users/hyungwoon/Documents/AI/_tools/video-editing-team
git add templates/remotion/
git commit -m "feat: add Remotion boilerplate — vertical shortform composition + scene components"
```

---

### Task 13: 샘플 숏폼 테스트 — 촬영 영상

**Files:**
- Input: `/Users/hyungwoon/Desktop/동영상 2026. 3. 27. 오후 6.08.mov`
- Output: `_tools/video-editing-team/output/`

**Step 1: 도구 확인**

```bash
ffmpeg -version | head -1
ffmpeg -filters 2>&1 | grep ass
```

**Step 2: 오디오 추출 + Whisper STT**

```bash
ffmpeg -i "/Users/hyungwoon/Desktop/동영상 2026. 3. 27. 오후 6.08.mov" \
  -vn -acodec pcm_s16le -ar 16000 -ac 1 /tmp/sample-audio.wav

whisper /tmp/sample-audio.wav --model medium --language ko --output_format srt --output_dir /tmp/
```

**Step 3: /cut-shortform 스킬 실행**

트랜스크립트 기반으로 후킹 분석 → 후보 선택 → FFmpeg 편집 → 자막 burn-in

**Step 4: 결과 확인**

```bash
ffprobe -v quiet -print_format json -show_format -show_streams output/shortform-001.mp4
```

Expected: 1080x1920, ~60초, H.264, 자막 포함

**Step 5: 커밋 (테스트 결과는 커밋하지 않음 — output/ 은 .gitignore)**

---

## 태스크 의존성 요약

```
Task 1 (스캐폴드)
  ├─ Task 2 (에셋) ← Task 3 (ASS 템플릿)
  ├─ Task 4 (scriptwriter) ← Task 6 (highlight-analysis)
  │                        ← Task 8 (script-writing)
  ├─ Task 5 (editor) ← Task 7 (subtitle-styling)
  │                   ← Task 9 (remotion-template)
  ├─ Task 10 (cut-shortform) ← Tasks 4,5,6,7
  ├─ Task 11 (text-to-video) ← Tasks 4,8,9
  ├─ Task 12 (Remotion 보일러플레이트) ← Task 9
  └─ Task 13 (샘플 테스트) ← Tasks 10,12
```

병렬 가능: Tasks 4+5, Tasks 6+7+8+9, Tasks 10+11

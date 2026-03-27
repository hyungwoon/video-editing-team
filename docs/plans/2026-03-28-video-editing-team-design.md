# Video Editing Team — Design Document

**Date:** 2026-03-28
**Status:** Approved
**Location:** `_tools/video-editing-team` (독립 프로젝트)

## 개요

촬영 영상과 텍스트 콘텐츠를 SNS 바이럴용 세로형 숏폼(~1분)으로 변환하는 에이전트 팀.
하이브리드 방식: 에이전트 팀(분석/기획) + Claude Code 스킬(실행).

## 요구사항

| 항목 | 내용 |
|------|------|
| 영상 타입 1 | 촬영 영상 → 후킹 하이라이트 숏폼 + 자막 |
| 영상 타입 2 | 텍스트 콘텐츠 → 스크립트 → Remotion 시각화 숏폼 |
| 출력 규격 | 1080x1920 (9:16), 30fps, H.264 MP4, ~1분 |
| 플랫폼 | YouTube Shorts / Instagram Reels / TikTok (공통) |
| 목적 | SNS 바이럴, 인사이트 전달 |
| 브랜드 | ANTIEGG (antiegg-shortform-templates 디자인 가이드 준수) |

## 기술 스택

| 역할 | 도구 |
|------|------|
| 영상 편집 (자르기/합치기) | `fluent-ffmpeg` + `ffmpeg-static` |
| 자막 생성 (STT) | Whisper 로컬 (사용자가 SRT 제공 가능) |
| 자막 입히기 | FFmpeg libass (SRT → ASS 변환 후 burn-in) |
| 텍스트→영상 | Remotion (React 기반 프로그래매틱 비디오) |

## 프로젝트 구조

```
_tools/video-editing-team/
├── CLAUDE.md
├── agents/
│   ├── scriptwriter.md          # 후킹 분석 + 스크립트 작성
│   └── editor.md                # 편집 판단 (컷 포인트, 순서, 구성)
├── plugins/
│   ├── video-source/skills/
│   │   ├── highlight-analysis/SKILL.md
│   │   └── subtitle-styling/SKILL.md
│   └── text-video/skills/
│       ├── script-writing/SKILL.md
│       └── remotion-template/SKILL.md
├── .claude/skills/
│   ├── cut-shortform/SKILL.md   # /cut-shortform <video> [srt]
│   └── text-to-video/SKILL.md   # /text-to-video <text-file>
├── assets/
│   ├── logo/                    # ANTIEGG 로고 SVG
│   └── font/                    # SUIT Variable 폰트
├── templates/
│   ├── subtitle.ass             # ANTIEGG 자막 ASS 템플릿
│   ├── overlay-v01.png          # V-01 오버레이
│   ├── overlay-v02.png          # V-02 오버레이
│   └── ending.mp4              # 엔딩 시퀀스
├── templates/remotion/          # Remotion 프로젝트 보일러플레이트
└── output/                      # 생성된 숏폼 출력
```

## 에이전트 설계

### scriptwriter.md — 분석 + 기획

**촬영 영상 모드:**
- 트랜스크립트(SRT) 기반 인사이트 밀도 분석
- 후킹 포인트 3~5개 식별 (타임코드 + 이유)
- 각 후킹 포인트별 숏폼 구성안:
  - 후킹(3~5초) → 맥락(30~40초) → 클라이맥스(10~15초) → 마무리(5초)
- 판별 기준: 감정 전환점, 공유 가능한 한 문장 인사이트, 궁금증 유발 순간

**텍스트 영상 모드:**
- 텍스트 콘텐츠 → 60초 숏폼 스크립트 재구성
- 후킹 오프닝(질문형/숫자형/반전형) → 핵심 인사이트 2~3개 → CTA
- 장면 단위 지시: 텍스트, 배경, 애니메이션 타입

### editor.md — 편집 실행 판단

- scriptwriter 구성안 → 실행 가능한 편집 지시서 변환
- 정확한 FFmpeg 컷 타임코드 (말 중간 끊김 방지)
- 트랜지션 타입 판단 (컷, 페이드)
- 자막 타이밍 재조정 (하이라이트 앞배치에 맞게)
- 오버레이 템플릿 선택 (V-01 or V-02)
- 최종 출력 규격 확인

## 자막 스타일 (ANTIEGG 디자인 가이드)

| 요소 | 스펙 |
|------|------|
| 화자명 | `[이름]` 형식, 44px, Bold 700, #FFD700 (골드) |
| 대사 | 58px, Bold 700, #FFFFFF, 행간 138%, 최대 2줄 |
| 폰트 | SUIT Variable |
| 외곽선 | #000000, 3px |
| 그림자 | 0px 4px 16px rgba(0,0,0,0.7) + blur 12px |

### ASS 템플릿

```ass
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Style: Speaker,SUIT Variable,44,&H0000D7FF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,3,0,2,10,10,80
Style: Dialogue,SUIT Variable,58,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,3,4,2,10,10,80
```

## 워크플로우

### /cut-shortform (촬영 영상 → 숏폼)

1. SRT 있으면 로드, 없으면 Whisper 로컬로 생성
2. scriptwriter → 트랜스크립트 분석 → 숏폼 후보 3~5개 제안
3. 사용자가 후보 선택
4. editor → 편집 지시서 생성
5. FFmpeg 실행: 컷 + concat + SRT→ASS + 자막 burn-in + 오버레이 + 엔딩
6. 출력: `output/shortform-001.mp4`

### /text-to-video (텍스트 → 숏폼)

1. 텍스트 파일 읽기
2. scriptwriter → 숏폼 스크립트 작성 (장면 단위)
3. 사용자 스크립트 확인/수정
4. Remotion 컴포지션 생성 (1080x1920, SUIT Variable, ANTIEGG 브랜드)
5. renderMedia()로 렌더링
6. 출력: `output/text-shortform-001.mp4`

## 참조

- 자막/썸네일 스타일: `hyungwoon/antiegg-shortform-templates` (디자인 가이드 섹션)
- 템플릿 종류: T-01~04 (썸네일), V-01~02 (세로), H-01~02 (가로), ENDING
- 폰트 CDN: `https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css`

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

- **영상 합성**: Remotion AudioSyncedComposition (화자 인트로/아웃트로 + 그래픽 + 오디오 싱크)
- **소스 추출**: FFmpeg (오디오/인트로/아웃트로 클립 추출용)
- **자막 생성**: whisper-cpp (large-v3 모델, Metal GPU 가속) 또는 사용자 SRT 제공
- **자막 렌더링**: Remotion SubtitleOverlay (CSS 기반, 완벽 오디오 싱크)
- **그래픽**: Remotion 장면 컴포넌트 12종 (TextCard, QuoteCard, ListCard, EndingCard, StatsGrid, LayerStack, AgentHub, ContentPipeline, OntologyGrid, ProcessFlow, ComparisonDiagram, FeedbackLoop)
- **폰트**: SUIT Variable
- **브랜드**: ANTIEGG ([antiegg-shortform-templates](https://github.com/hyungwoon/antiegg-shortform-templates) 레포 참조)

## 브랜드 자막 스타일

| 요소 | 스펙 |
|------|------|
| 화자명 | `[이름]`, 44px, Bold, #FFD700 |
| 대사 | 58px, Bold, #FFFFFF, 행간 138%, 최대 2줄 |
| 폰트 | SUIT Variable |
| 외곽선 | #000000, 3px |
| 그림자 | 0px 4px 16px rgba(0,0,0,0.7) |

## 참고 문서

- `docs/plans/` — 설계 및 구현 계획 문서
- `templates/remotion/src/compositionData.ts` — 8개 숏폼 장면/자막 정의
- `templates/remotion/src/AudioSyncedComposition.tsx` — 핵심 컴포지션
- CEO Staff Agent System 가이드: https://site-flame-pi-11.vercel.app/guide
- 컴포지션 ID: Hook001~004, Process001~004
- 레거시: `scripts/generate-ass.py` (SRT→ASS), `templates/subtitle.ass`, `ShortformComposition.tsx`

## 압축(Compaction) 시 보존 지시

컨텍스트 압축 시 반드시 보존할 정보: 현재 실행 중인 스킬 이름, 편집 중인 영상 파일 경로, 생성된 SRT/ASS 파일 경로, 사용자가 선택한 숏폼 후보 번호.

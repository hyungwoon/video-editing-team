# Shortform 제작 결과

**소스**: 동영상 2026. 3. 27. 오후 6.08.mov (28분, ANTIEGG CEO 스태프 에이전트 시스템 사례)
**생성일**: 2026-03-28
**아키텍처**: Remotion AudioSyncedComposition (화자 인트로/아웃트로 + 다이어그램 그래픽 + 오디오 싱크 + CSS 자막)
**모델**: whisper-cpp large-v3-turbo (한국어)

## v2 시리즈 (최종본 — 다이어그램 중심 Remotion 그래픽)

### 후킹 시리즈

| # | 파일 | 후킹 포인트 | 크기 | 주요 다이어그램 |
|---|------|-----------|------|-------------|
| 1 | Hook001-v2.mp4 | "온톨로지 = AI 장기 근속자" | 10MB | ComparisonDiagram + OntologyGrid |
| 2 | Hook002-v2.mp4 | "매번 리셋되면 AI 쓸 이유 없다" | 10MB | FeedbackLoop + ListCard |
| 3 | Hook003-v2.mp4 | "CEO의 모든 일을 AI 18개가 처리" | 11MB | StatsGrid + AgentHub + ProcessFlow |
| 4 | Hook004-v2.mp4 | "마케터 일을 모니터 에이전트가 대신" | 10MB | ContentPipeline |

### 프로세스 설명 시리즈

| # | 파일 | 주제 | 크기 | 주요 다이어그램 |
|---|------|------|------|-------------|
| 1 | Process001-v2.mp4 | 5레이어 아키텍처 | 9MB | LayerStack |
| 2 | Process002-v2.mp4 | 온톨로지 구축법 | 12MB | ComparisonDiagram + OntologyGrid + LayerStack |
| 3 | Process003-v2.mp4 | 에이전트 팀 구조 | 11MB | AgentHub + ProcessFlow |
| 4 | Process004-v2.mp4 | 콘텐츠 마케팅 파이프라인 | 13MB | ContentPipeline + FeedbackLoop |

## 다이어그램 컴포넌트 (8종)

| 컴포넌트 | 레이아웃 | 용도 |
|---------|---------|------|
| StatsGrid | 2x2 숫자 카운터 그리드 | 스펙 숫자 (18/125/19/4) |
| LayerStack | 수평 컬러 바 스택 | 5레이어 아키텍처 |
| AgentHub | 방사형 허브 | CEO Staff + 17 에이전트 |
| ContentPipeline | 세로 카드+아이콘 흐름 | 콘텐츠 마케팅 5단계 |
| OntologyGrid | 2열 카드 그리드 (블루+그린) | 12 팩트 + 7 분석 문서 |
| ProcessFlow | 번호 스텝 + 화살표 | 7단계 처리 흐름 |
| ComparisonDiagram | 좌우 분할 비교 + VS | LLM vs 에이전트 팀 |
| FeedbackLoop | 원형 순환 4노드 | RLVR 피드백 루프 |

## 아키텍처

```
Remotion AudioSyncedComposition:
├── <Audio src="segment-audio.m4a" />     ← 화자 음성 (연속 재생)
├── <Sequence> 화자 인트로 (3-4s)          ← OffthreadVideo
├── <Sequence> 다이어그램 장면들 (본체)     ← 8종 다이어그램 컴포넌트
├── <Sequence> 화자 아웃트로 (3s)          ← OffthreadVideo
└── <SubtitleOverlay />                   ← CSS 기반 자막 (완벽 싱크)
```

## 웹 프리뷰

`output/preview.html` — 브라우저에서 원본 영상 드래그 앤 드롭으로 프리뷰

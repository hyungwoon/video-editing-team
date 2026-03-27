---
name: text-to-video
description: 텍스트 콘텐츠를 Remotion 기반 세로형 숏폼 영상으로 변환한다. /text-to-video <text-file> 로 실행.
user-invocable: true
argument-hint: "<text-file>"
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

| 장면 | 시간 | 화면 | 텍스트 | 애니메이션 |
|------|------|------|--------|-----------|
| 1 | 0:00~0:03 | 후킹 | 왜 ~할까요? | 타이핑 |
| 2 | 0:03~0:08 | 텍스트카드 | ~ | 페이드인 |
| ... | ... | ... | ... | ... |

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

4. 컴포지션 코드 생성 또는 inputProps로 전달

### Phase 3: 렌더링

```bash
cd templates/remotion
npx remotion render src/index.ts ShortformComposition \
  --props='{"scenes": [...]}' \
  ../../output/text-shortform-{n}.mp4
```

### Phase 4: 확인

1. 출력 파일 정보 표시
2. 파일 크기, 길이, 해상도 확인
3. 사용자에게 결과 경로 안내

## 필수 도구 확인

```bash
node --version                        # Node.js 18+ 필요
ls templates/remotion/node_modules    # 의존성 설치 확인
```

미설치 시:
```bash
cd templates/remotion && npm install
```

## 출력 규격

- 해상도: 1080x1920 (세로)
- FPS: 30
- 코덱: H.264
- 길이: 45~75초

## 에러 복구

| 상황 | 원인 | 해결 |
|------|------|------|
| 폰트 로드 실패 | SUIT-Variable.woff2 누락 | `templates/remotion/public/` 에 파일 복사 확인 |
| 컴포지션 길이 초과 | 장면 총 프레임 > 1800 | Root.tsx의 `durationInFrames`를 총 프레임에 맞게 조정 |
| 렌더 OOM | 메모리 부족 | `--concurrency=1` 플래그 추가 |
| 렌더 실패 | node_modules 미설치 | `cd templates/remotion && npm install` |

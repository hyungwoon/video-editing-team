---
name: cut-shortform
description: 촬영 영상에서 후킹 숏폼을 추출하고 ANTIEGG 스타일 자막을 입힌다. /cut-shortform <video-path> [srt-path] 로 실행.
user-invocable: true
argument-hint: "<video-path> [srt-path]"
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
2. Whisper 로컬 실행 (Metal GPU 가속, large-v3 모델):
   ```bash
   whisper-cli -m /tmp/ggml-large-v3.bin -f /tmp/audio.wav -l ko --output-srt -of /tmp/transcript
   # 생성 파일: /tmp/transcript.srt
   ```
   - **기본 모델**: `large-v3` (최고 한국어 정확도, 품질 최우선)
   - **Metal GPU 가속**: whisper-cpp는 macOS에서 Metal 자동 활성 (`--no-gpu` 없으면 GPU 사용)
   - **모델 파일 없을 시**: `curl -L -o /tmp/ggml-large-v3.bin "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin"`
3. 생성된 SRT를 사용자에게 보여주고 수정 기회 제공

4. **자막 다듬기** (SRT 제공 여부 무관, 항상 수행):
   - 구어체 → 자연스러운 서면 한국어로 정리
   - 고유명사 맥락 추론 및 교정 (예: "오픈에이아이" → "OpenAI")
   - 말 더듬, 반복, 군더더기 제거
   - 문장 재구성 (2줄 이내, 줄당 최대 32자)
   - 다듬기 규칙 상세: `plugins/video-source/skills/subtitle-styling/SKILL.md` 참조

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

### Phase 3: 웹 프리뷰 (인코딩 전 확인)

편집 지시서가 나오면 **먼저 웹 프리뷰로 확인**한다. 인코딩은 확인 후 진행.

1. `output/preview.html` 생성 — 숏폼 후보별 세그먼트 재생 + 자막 오버레이
2. 브라우저에서 원본 영상 파일을 드래그 앤 드롭하여 로드
3. 각 후보의 후킹 → 맥락 → 클라이맥스 구간을 순차 재생
4. 자막은 CSS로 ANTIEGG 스타일 오버레이 (인코딩 없이 즉시 확인)
5. **사용자 확인 후** Phase 4로 진행 — 수정 필요 시 타임코드/자막 조정

### Phase 3.5: Remotion 그래픽 교차 편집 (선택)

촬영 영상만 보여주지 않고, 설명하는 내용을 Remotion으로 시각화하여 교차 편집한다.

**언제 사용:**
- 아키텍처/구조를 설명하는 구간 (5레이어, 에이전트 팀 구조 등)
- 숫자/데이터를 나열하는 구간 (18개 에이전트, 125개 스킬 등)
- 프로세스 흐름을 설명하는 구간 (7단계 처리 흐름 등)

**워크플로우:**
1. 스크립트에서 시각화가 필요한 구간 식별
2. Remotion으로 해당 내용의 그래픽 컴포지션 생성 (다이어그램, 리스트, 플로우차트)
3. 렌더링하여 그래픽 클립 생성
4. FFmpeg로 원본 영상과 교차 편집: 화자 → 그래픽 → 화자 → 그래픽

**참고 콘텐츠:**
- CEO Staff Agent System 가이드: https://site-flame-pi-11.vercel.app/guide
- 5-Layer Architecture, Agent Hub, Plugin/Skill 구조 등 시각화 소스

### Phase 4: 편집 실행

1. `agents/editor.md` 에이전트를 참조하여 편집 지시서 생성
2. FFmpeg 명령 순서:

```bash
# 1. 구간별 컷
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_1.mp4
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_2.mp4

# 2. concat 리스트 작성
echo "file 'segment_1.mp4'" > /tmp/segments.txt
echo "file 'segment_2.mp4'" >> /tmp/segments.txt

# 3. concat
ffmpeg -f concat -safe 0 -i /tmp/segments.txt -c copy /tmp/joined.mp4

# 4. SRT → ASS 변환 (재조정된 타이밍)
# 4-1. templates/subtitle.ass 의 [Script Info]와 [V4+ Styles] 섹션을 헤더로 복사
# 4-2. editor 에이전트가 재조정한 타임코드로 [Events] 섹션 생성
# 4-3. adjusted.ass 파일로 저장

# 5. 자막 burn-in + 최종 인코딩
ffmpeg -i /tmp/joined.mp4 \
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
ffmpeg -version | head -1
ffmpeg -filters 2>&1 | grep ass
which whisper-cli || echo "whisper-cpp 미설치 — brew install whisper-cpp"
ls /tmp/ggml-large-v3.bin || echo "large-v3 모델 미다운로드"
```

## 출력 규격

- 해상도: 1080x1920 (세로)
- FPS: 30
- 코덱: H.264 (libx264), CRF 18
- 오디오: AAC 128kbps
- 길이: 45~75초

## 에러 복구

| 상황 | 원인 | 해결 |
|------|------|------|
| segment 컷 실패 `Invalid data` | 키프레임 불일치 | `-c copy` 대신 `-c:v libx264 -c:a aac`로 재인코딩 |
| concat 실패 | 세그먼트 코덱 불일치 | `ffprobe`로 각 세그먼트 코덱 확인 후 통일 |
| ASS burn-in 실패 | libass 미지원 또는 폰트 미설치 | `ffmpeg -filters \| grep ass` 확인, `fontsdir` 경로에 SUIT-Bold.ttf 확인 |
| 출력 0바이트 | 입력 파일 손상 | `ffprobe`로 입력 파일 무결성 검증 |

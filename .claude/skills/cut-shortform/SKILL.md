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
# 1. 구간별 컷
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_1.mp4
ffmpeg -ss {start} -to {end} -i input.mov -c copy -avoid_negative_ts make_zero segment_2.mp4

# 2. concat 리스트 작성
echo "file 'segment_1.mp4'" > /tmp/segments.txt
echo "file 'segment_2.mp4'" >> /tmp/segments.txt

# 3. concat
ffmpeg -f concat -safe 0 -i /tmp/segments.txt -c copy /tmp/joined.mp4

# 4. SRT → ASS 변환 (재조정된 타이밍)
# editor 에이전트가 타이밍 재조정한 ASS 파일 생성
# templates/subtitle.ass 의 스타일 정의를 헤더로 사용

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
which whisper || echo "Whisper 미설치 — SRT 파일을 직접 제공해주세요"
```

## 출력 규격

- 해상도: 1080x1920 (세로)
- FPS: 30
- 코덱: H.264 (libx264), CRF 18
- 오디오: AAC 128kbps
- 길이: 45~75초

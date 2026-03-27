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

## SRT → ASS 변환 규칙

### 변환 절차

1. SRT 파일의 각 자막 블록을 파싱
2. 화자명이 포함된 경우 (`[이름]` 패턴) → Speaker 스타일 + Dialogue 스타일 분리
3. 화자명이 없는 경우 → Dialogue 스타일만 사용
4. 2줄 초과 시 → 2줄로 분할 (의미 단위)
5. 타임코드 변환: SRT `00:00:01,000` → ASS `0:00:01.00`

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

### ASS 줄바꿈

- SRT 줄바꿈 `\n` → ASS `\N`
- 최대 2줄 유지 — 3줄 이상은 의미 단위로 분할하여 별도 이벤트

## FFmpeg Burn-in 명령

```bash
ffmpeg -i input.mp4 \
  -vf "ass=subtitles.ass:fontsdir=assets/font" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a copy \
  -y output.mp4
```

### 필수 확인 사항

- `fontsdir` 경로에 SUIT Variable OTF/TTF 파일 존재
- FFmpeg에 `--enable-libass` 컴파일 (`ffmpeg -filters | grep ass`)
- CRF 18 = 시각적으로 무손실에 가까운 품질
- 자막 위치(MarginV)는 ASS 스타일에서 제어

> 레이아웃 참고: Speaker MarginV=120 > Dialogue MarginV=60 이므로, Alignment=2 (하단 중앙) 기준으로 화자명이 대사 위에 위치한다.

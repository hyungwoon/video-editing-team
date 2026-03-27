import type { SceneDef } from './AudioSyncedComposition'
import type { SubtitleEntry } from './scenes/SubtitleOverlay'

export interface CompositionDef {
  id: string
  props: {
    audioFile: string
    introVideo: string
    outroVideo: string
    introSec: number
    outroStartSec: number
    totalSec: number
    scenes: SceneDef[]
    subtitles: SubtitleEntry[]
  }
}

export const compositions: CompositionDef[] = [
  // ─── Process001 (5개 레이어, 51s) ───
  {
    id: 'Process001',
    props: {
      audioFile: 'p001-audio.m4a',
      introVideo: 'p001-intro.mp4',
      outroVideo: 'p001-outro.mp4',
      introSec: 3,
      outroStartSec: 48,
      totalSec: 51,
      scenes: [
        { type: 'text', startSec: 3, endSec: 8.5, text: 'CEO 스태프 에이전트는\n5개의 레이어를 통해\n업무를 수행합니다', highlightWord: '5개의 레이어' },
        { type: 'layers', startSec: 8.5, endSec: 28 },
        { type: 'ontologyGrid', startSec: 28, endSec: 42.5 },
        { type: 'processFlow', startSec: 42.5, endSec: 48 },
      ],
      subtitles: [
        { startSec: 0, endSec: 3, text: '이거를 좀 차근차근 설명드려볼게요' },
        { startSec: 3, endSec: 8.5, text: 'CEO 스태프는 5개의 레이어를 통해\n업무를 수행하게 되는데요' },
        { startSec: 8.5, endSec: 14, text: '규칙에 의해서 움직이게 되고\n각각의 AI 에이전트들이 움직입니다' },
        { startSec: 14, endSec: 17.8, text: '에이전트들이 참고하는\n지식들이 있어요' },
        { startSec: 17.8, endSec: 24, text: '스킬들을 도메인별로\n재무, 디자인, 마케팅, 프로덕트\n플러그인으로 묶어놨습니다' },
        { startSec: 24, endSec: 28, text: '이 플러그인들을 읽는 작업이 있고요' },
        { startSec: 28, endSec: 35.5, text: '온톨로지라고 해서 기업의 역사와\n자료가 지식화된 문서입니다' },
        { startSec: 35.5, endSec: 42.5, text: '12개의 팩트 기반 온톨로지와\n7개의 전략 분석 문서가 있어요' },
        { startSec: 42.5, endSec: 48, text: '피드백을 기억하고 학습하는\n메모리 데이터가 있습니다' },
        { startSec: 48, endSec: 51, text: '이 5가지 레이어를 가지고\nAI가 일을 하게 됩니다' },
      ],
    },
  },

  // ─── Hook001 (온톨로지 = AI 장기 근속자, 58s) ───
  {
    id: 'Hook001',
    props: {
      audioFile: 'h001-audio.m4a',
      introVideo: 'h001-intro.mp4',
      outroVideo: 'h001-outro.mp4',
      introSec: 4,
      outroStartSec: 55,
      totalSec: 58,
      scenes: [
        { type: 'text', startSec: 4, endSec: 9, text: 'AI가 우리 회사에서 제일\n장기 근속한 사람처럼', highlightWord: '장기 근속한' },
        { type: 'comparison', startSec: 9, endSec: 22 },
        { type: 'ontologyGrid', startSec: 22, endSec: 42 },
        { type: 'text', startSec: 42, endSec: 48, text: '옵시디언 연결 →\n지식 그래프', highlightWord: '지식 그래프' },
        { type: 'stats', startSec: 48, endSec: 55 },
      ],
      subtitles: [
        { startSec: 0, endSec: 4, text: '이걸 하면 쉽게 말하면\n진짜 AI가 우리 회사에서' },
        { startSec: 4, endSec: 9, text: '제일 장기 근속한 사람처럼\n속속들이 알게 되는 효과가 있어요' },
        { startSec: 9, endSec: 16, text: '범용 LLM과 에이전트 팀의 차이는\n우리 회사의 맥락을 아느냐 모르느냐' },
        { startSec: 16, endSec: 22, text: '온톨로지는 신입사원 온보딩처럼\n회사의 역사, 매출, 제품을 정리한 것' },
        { startSec: 22, endSec: 28, text: '팀, 제품, 기술, 시장\n투자 상황, 로드맵, 고객 정보' },
        { startSec: 28, endSec: 34, text: '이런 것들의 정보를\n잘 정리해 놓은 게 온톨로지예요' },
        { startSec: 34, endSec: 40, text: '예전에는 구축이 어려웠는데\nAI를 활용하면 쉽게 구축 가능합니다' },
        { startSec: 40, endSec: 48, text: '옵시디언에 연결하면\n지식 그래프로도 볼 수 있어요' },
        { startSec: 48, endSec: 55, text: '그래서 온톨로지를 먼저 구축하고\n에이전트 17개를 만들었습니다' },
        { startSec: 55, endSec: 58, text: '운영 중에 추가되어\n총 18개가 됐습니다' },
      ],
    },
  },

  // ─── Hook002 (피드백 루프, 55s) ───
  {
    id: 'Hook002',
    props: {
      audioFile: 'h002-audio.m4a',
      introVideo: 'h002-intro.mp4',
      outroVideo: 'h002-outro.mp4',
      introSec: 4,
      outroStartSec: 52,
      totalSec: 55,
      scenes: [
        { type: 'text', startSec: 4, endSec: 10, text: '쓰면 쓸수록 똑똑해져야 하는데\n매번 리셋되면?', highlightWord: '매번 리셋' },
        { type: 'feedbackLoop', startSec: 10, endSec: 28 },
        { type: 'list', startSec: 28, endSec: 40, text: '숫자는 한 번 더 검증해\n이건 동의하지 않아\n별로야, 구려' },
        { type: 'text', startSec: 40, endSec: 52, text: 'RLVR\n검증 가능한 보상 시그널로\n학습하는 루프', highlightWord: 'RLVR' },
      ],
      subtitles: [
        { startSec: 0, endSec: 6, text: '쓰면 쓸수록 똑똑해져야 하는데\n매번 리셋되면 AI 쓸 이유가 없죠' },
        { startSec: 6, endSec: 10, text: '에이전트 시스템을 구축하면\n피드백 루프가 핵심입니다' },
        { startSec: 10, endSec: 18, text: "'숫자는 한 번 더 검증해'\n'이건 동의하지 않아'" },
        { startSec: 18, endSec: 24, text: '이런 피드백들을\n여러 가지로 저장해놓습니다' },
        { startSec: 24, endSec: 32, text: '한 번 지적한 것, 두 번, 세 번\n반복될수록 강하게 반영됩니다' },
        { startSec: 32, endSec: 40, text: '피드백 루프를 잘 구축해놔야\n에이전트 시스템의 이득이 생깁니다' },
        { startSec: 40, endSec: 48, text: 'RLVR 관점에서 검증 가능한\n보상 시그널을 계속 주면서' },
        { startSec: 48, endSec: 52, text: '지식을 학습하는 루프를\n만들어 놓는 것이 중요합니다' },
        { startSec: 52, endSec: 55, text: '쓸수록 격차가 만들어지고\n더 똑똑해지는 AI를 만드세요' },
      ],
    },
  },

  // ─── Hook003 (CEO 스태프 시스템, 63s) ───
  {
    id: 'Hook003',
    props: {
      audioFile: 'h003-audio.m4a',
      introVideo: 'h003-intro.mp4',
      outroVideo: 'h003-outro.mp4',
      introSec: 4,
      outroStartSec: 60,
      totalSec: 63,
      scenes: [
        { type: 'text', startSec: 4, endSec: 9, text: 'CEO의 일을\n전부 다 도와주는\nAI 시스템', highlightWord: '전부 다' },
        { type: 'stats', startSec: 9, endSec: 20 },
        { type: 'agenthub', startSec: 20, endSec: 36 },
        { type: 'processFlow', startSec: 36, endSec: 52 },
        { type: 'layers', startSec: 52, endSec: 60 },
      ],
      subtitles: [
        { startSec: 0, endSec: 5, text: 'CEO의 일을 전부 다 도와주는\n시스템을 만들었어요' },
        { startSec: 5, endSec: 9, text: '이 에이전트 시스템의\n스펙이 엄청나게 큽니다' },
        { startSec: 9, endSec: 14, text: '18개의 에이전트가 있고\n125개의 스킬을 보유합니다' },
        { startSec: 14, endSec: 20, text: '19개의 지식 문서와\n4가지 RLVR 학습 루프가 있습니다' },
        { startSec: 20, endSec: 28, text: '에이전트 팀과 이 팀이 일하는\n하네스를 설계한 케이스입니다' },
        { startSec: 28, endSec: 36, text: 'CEO 스태프라는 오케스트레이터가 있고\n그 아래에 17개 전문 에이전트' },
        { startSec: 36, endSec: 42, text: '프로덕트, 마케팅, 파이낸스\n데이터, 세일즈, 리걸, HR' },
        { startSec: 42, endSec: 52, text: '5개의 레이어를 통해\n업무를 수행합니다' },
        { startSec: 52, endSec: 60, text: 'CEO 스태프가 업무를 받으면\n적합한 에이전트에게 분배합니다' },
        { startSec: 60, endSec: 63, text: '에이전트 허브 시스템으로\nCEO의 모든 업무를 처리합니다' },
      ],
    },
  },

  // ─── Hook004 (콘텐츠 파이프라인, 57s) ───
  {
    id: 'Hook004',
    props: {
      audioFile: 'h004-audio.m4a',
      introVideo: 'h004-intro.mp4',
      outroVideo: 'h004-outro.mp4',
      introSec: 4,
      outroStartSec: 54,
      totalSec: 57,
      scenes: [
        { type: 'text', startSec: 4, endSec: 11, text: '컨텐츠 마케터가\n진짜 하는 일을\n모니터 에이전트가 대신', highlightWord: '모니터 에이전트' },
        { type: 'pipeline', startSec: 11, endSec: 30 },
        { type: 'comparison', startSec: 30, endSec: 42 },
        { type: 'text', startSec: 42, endSec: 54, text: '합의된 채널과\n합의된 지식들만\n모니터링하도록 설계', highlightWord: '보안' },
      ],
      subtitles: [
        { startSec: 0, endSec: 4, text: '콘텐츠 마케터가 진짜 하는 일을\n모니터 에이전트가 대신합니다' },
        { startSec: 4, endSec: 11, text: '소재 발굴부터 트렌드 파악까지\nAI가 자동으로 수행합니다' },
        { startSec: 11, endSec: 18, text: '모니터링, 드래프트, SEO 최적화\n퍼블리싱, 성과 분석 파이프라인' },
        { startSec: 18, endSec: 24, text: '5단계 파이프라인을 통해\n콘텐츠가 자동으로 흘러갑니다' },
        { startSec: 24, endSec: 32, text: 'Slack과 Notion의 변경 사항을\n다 모니터링합니다' },
        { startSec: 32, endSec: 40, text: '회사 내부 동향뿐 아니라\n업계 뉴스, 경쟁사 동향도 파악' },
        { startSec: 40, endSec: 48, text: '합의된 채널과 지식들만\n모니터링하도록 보안 설계했습니다' },
        { startSec: 48, endSec: 54, text: '소재를 발굴하고 주제를 뽑아내는\n드래프트 에이전트가 동작합니다' },
        { startSec: 54, endSec: 57, text: '콘텐츠 마케팅의 80%를\nAI가 자동으로 처리합니다' },
      ],
    },
  },

  // ─── Process002 (온톨로지 구축, 87s) ───
  {
    id: 'Process002',
    props: {
      audioFile: 'p002-audio.m4a',
      introVideo: 'p002-intro.mp4',
      outroVideo: 'p002-outro.mp4',
      introSec: 4,
      outroStartSec: 84,
      totalSec: 87,
      scenes: [
        { type: 'text', startSec: 4, endSec: 10, text: '날리지 베이스 온톨로지\n구축부터 시작했습니다' },
        { type: 'comparison', startSec: 10, endSec: 24 },
        { type: 'layers', startSec: 24, endSec: 36 },
        { type: 'ontologyGrid', startSec: 36, endSec: 58 },
        { type: 'text', startSec: 58, endSec: 68, text: '옵시디언에 연결하면\n지식 그래프로 볼 수 있어요', highlightWord: '지식 그래프' },
        { type: 'text', startSec: 68, endSec: 80, text: 'AI가 우리 회사에서\n제일 장기 근속한 사람처럼\n모든 걸 알게 됩니다', highlightWord: '장기 근속한 사람' },
        { type: 'stats', startSec: 80, endSec: 84 },
      ],
      subtitles: [
        { startSec: 0, endSec: 4, text: '날리지 베이스 온톨로지\n구축 과정을 설명드리겠습니다' },
        { startSec: 4, endSec: 10, text: '날리지 베이스 온톨로지\n구축부터 시작했습니다' },
        { startSec: 10, endSec: 18, text: 'Gemini나 GPT 같은\n범용 LLM도 일은 잘 합니다' },
        { startSec: 18, endSec: 28, text: '에이전트 팀과의 차이는\n회사 맥락을 아느냐 모르느냐입니다' },
        { startSec: 28, endSec: 34, text: '팀, 제품, 기술, 시장\n투자 상황 등을 계층화합니다' },
        { startSec: 34, endSec: 40, text: '5개 레이어로 구조화된\n지식 체계를 만들었습니다' },
        { startSec: 40, endSec: 48, text: '온톨로지 구축이\n예전에는 정말 어려웠는데' },
        { startSec: 48, endSec: 58, text: 'AI를 활용하면 마크다운 기반으로\n비교적 쉽게 구축할 수 있습니다' },
        { startSec: 58, endSec: 68, text: '옵시디언에 연결하면\n지식 그래프로도 볼 수 있어요' },
        { startSec: 68, endSec: 80, text: 'AI가 우리 회사에서 제일\n장기 근속한 사람처럼 알게 됩니다' },
        { startSec: 80, endSec: 84, text: '12개 팩트 온톨로지와\n7개 전략 문서를 구축했습니다' },
        { startSec: 84, endSec: 87, text: '이렇게 온톨로지를 먼저 구축하고\n에이전트를 만들었습니다' },
      ],
    },
  },

  // ─── Process003 (에이전트 팀 구조, 67s) ───
  {
    id: 'Process003',
    props: {
      audioFile: 'p003-audio.m4a',
      introVideo: 'p003-intro.mp4',
      outroVideo: 'p003-outro.mp4',
      introSec: 4,
      outroStartSec: 64,
      totalSec: 67,
      scenes: [
        { type: 'text', startSec: 4, endSec: 12, text: '처음에 17개를 만들었는데\n운영 중 TalentOps 추가' },
        { type: 'text', startSec: 12, endSec: 20, text: '나머지 1개는\n오케스트레이터', highlightWord: '오케스트레이터' },
        { type: 'agenthub', startSec: 20, endSec: 36 },
        { type: 'processFlow', startSec: 36, endSec: 56 },
        { type: 'text', startSec: 56, endSec: 64, text: '다양한 스킬들을\n참조하며 일합니다' },
      ],
      subtitles: [
        { startSec: 0, endSec: 4, text: '에이전트 팀 구조를\n설명드리겠습니다' },
        { startSec: 4, endSec: 12, text: '처음에 17개를 만들었는데\n운영 중에 TalentOps가 추가됐어요' },
        { startSec: 12, endSec: 20, text: '나머지 1개는 오케스트레이터로\nCEO 스태프 역할을 합니다' },
        { startSec: 20, endSec: 28, text: 'CEO 스태프 아래에\n17개 전문 에이전트가 있습니다' },
        { startSec: 28, endSec: 36, text: '프로덕트, 마케팅, 파이낸스\n데이터, 세일즈, 리걸, HR 등' },
        { startSec: 36, endSec: 46, text: 'CEO가 업무를 요청하면\nCEO 스태프가 먼저 받습니다' },
        { startSec: 46, endSec: 56, text: '적합한 에이전트에게 분배하는\n허브 시스템으로 동작합니다' },
        { startSec: 56, endSec: 64, text: '각 에이전트가 도메인별\n다양한 스킬들을 참조하며 일합니다' },
        { startSec: 64, endSec: 67, text: '이것이 에이전트 팀의\n전체 구조입니다' },
      ],
    },
  },

  // ─── Process004 (콘텐츠 마케팅 파이프라인, 105s) ───
  {
    id: 'Process004',
    props: {
      audioFile: 'p004-audio.m4a',
      introVideo: 'p004-intro.mp4',
      outroVideo: 'p004-outro.mp4',
      introSec: 4,
      outroStartSec: 102,
      totalSec: 105,
      scenes: [
        { type: 'text', startSec: 4, endSec: 12, text: '콘텐츠 마케팅 파이프라인\n5개 단계를 통해 일합니다', highlightWord: '5개 단계' },
        { type: 'pipeline', startSec: 12, endSec: 38 },
        { type: 'text', startSec: 38, endSec: 48, text: '모니터 에이전트가\n소재를 발굴합니다', highlightWord: '모니터 에이전트' },
        { type: 'pipeline', startSec: 48, endSec: 64 },
        { type: 'text', startSec: 64, endSec: 72, text: '드래프트 에이전트가\n주제를 뽑고', highlightWord: '드래프트' },
        { type: 'comparison', startSec: 72, endSec: 86 },
        { type: 'feedbackLoop', startSec: 86, endSec: 102 },
      ],
      subtitles: [
        { startSec: 0, endSec: 4, text: '콘텐츠 마케팅 파이프라인을\n설명드리겠습니다' },
        { startSec: 4, endSec: 12, text: '콘텐츠 마케팅 파이프라인은\n5개 단계를 통해 일합니다' },
        { startSec: 12, endSec: 20, text: '모니터링, 드래프트, SEO 최적화\n퍼블리싱, 성과 분석' },
        { startSec: 20, endSec: 28, text: '이 5단계 파이프라인을 통해\n콘텐츠가 자동으로 만들어집니다' },
        { startSec: 28, endSec: 38, text: 'Slack과 Notion의 변경 사항과\n외부 동향을 파악합니다' },
        { startSec: 38, endSec: 48, text: '모니터 에이전트가\n소재를 자동으로 발굴합니다' },
        { startSec: 48, endSec: 56, text: '컨텐츠 마케터가 진짜 하는 일을\nAI가 대신 수행합니다' },
        { startSec: 56, endSec: 64, text: '합의된 채널만 모니터링하도록\n보안 설계가 되어 있습니다' },
        { startSec: 64, endSec: 72, text: '드래프트 에이전트가\n주제를 뽑아냅니다' },
        { startSec: 72, endSec: 82, text: 'SEO, GEO, AEO에\n최적화된 콘텐츠를 생성합니다' },
        { startSec: 82, endSec: 96, text: '블로그 초안이 나오면 휴먼아이저가\nAI 흔적을 제거합니다' },
        { startSec: 96, endSec: 102, text: '사람이 보는 콘텐츠와\nAI가 볼 콘텐츠를 분리합니다' },
        { startSec: 102, endSec: 105, text: '이것이 콘텐츠 마케팅\n자동화 파이프라인입니다' },
      ],
    },
  },
]

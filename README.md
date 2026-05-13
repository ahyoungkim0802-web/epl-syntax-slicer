# EPL Syntax Slicer

영어 본문을 의미 단위로 자동 분석하여 시각적 카드로 보여주는 학습 도구입니다.

## 배포 방법

### 1. GitHub Pages
1. 이 저장소를 GitHub에 푸시
2. Settings → Pages → Source: `main` / `/ (root)` 선택
3. 배포 URL: `https://[username].github.io/epl-syntax-slicer/`

### 2. Cloudflare Worker (AI 분석용)
1. [Cloudflare Dashboard](https://dashboard.cloudflare.com) → Workers & Pages → Create
2. `worker.js` 코드를 붙여넣고 배포
3. Settings → Variables → `ANTHROPIC_API_KEY` 추가
4. 배포된 Worker URL을 복사

### 3. Worker URL 연결
`index.html` 최상단의 `WORKER_URL` 상수를 Worker URL로 변경 후 재커밋

## 기능
- 영어 본문 → AI 자동 문장 구조 분석
- 의미 단위(S/V/O/C/M) 시각화 카드
- 학습 모드 토글 (한국어·영어·태그·어휘·해석 숨기기)
- PDF 저장 / 공유 링크 / 워크시트 인쇄
- 최근 5건 히스토리

## 기술 스택
- Vanilla HTML/CSS/JS (빌드 도구 없음)
- Anthropic Claude API (Cloudflare Worker 경유)
- GitHub Pages 정적 배포

## EPL 영어학원
Empower · Practice · Literacy

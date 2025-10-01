# 💪 운동 코멘트 봇

운동 완료 후 AI가 유머러스한 코멘트를 던져주는 웹 앱

## 기능

- ✅ 3가지 톤 프리셋 (관장/친구/사부 모드)
- ✅ 8가지 운동 종류 지원
- ✅ AI 코멘트 자동 생성
- ✅ TTS 음성 재생 (각 톤별 다른 음성)
- ✅ 최근 10개 기록 저장
- ✅ 모바일 최적화

## 기술 스택

- Vanilla JavaScript
- Web Speech API (TTS)
- LocalStorage
- Vercel (배포)

## 로컬 실행

```bash
# 브라우저에서 index.html 열기
open index.html
```

## 배포

Vercel로 자동 배포됩니다.

```bash
git push origin main
```

## TTS 음성 설정

- **관장 모드**: 낮은 음성 (pitch: 0.8, rate: 1.1)
- **친구 모드**: 높은 음성 (pitch: 1.2, rate: 1.0)
- **사부 모드**: 느린 음성 (pitch: 0.9, rate: 0.85)

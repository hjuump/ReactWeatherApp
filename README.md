# 🌤 날씨 앱

React Native로 제작된 날씨 앱입니다. 사용자의 현재 위치를 기반으로 실시간 날씨 정보를 제공합니다.

![Demo of Weather App](docs/demo.gif)

## ✨ 주요 기능

- 현재 위치 기반 날씨 정보 제공
- 5일간의 일기 예보
- 실시간 기온 및 날씨 상태 표시
- 수평 스크롤로 시간대별 날씨 확인

## 🛠 기술 스택

- React Native
- TypeScript
- react-native-geolocation-service
- react-native-vector-icons
- OpenWeatherMap API
- OpenStreetMap API (Nominatim)

## 📱 구현된 기능

### 1. 위치 기반 서비스
- `Geolocation` 서비스를 활용한 현재 위치 조회
- Nominatim API를 통한 역지오코딩으로 도시 이름 표시
- 위치 권한 관리 및 에러 처리

### 2. 날씨 데이터 처리
- OpenWeatherMap API 연동
- 온도, 날씨 상태, 상세 설명 제공
- 시간대별 날씨 데이터 파싱 및 표시

### 3. UI/UX
- 직관적인 날씨 아이콘 표시
- 페이징 처리된 수평 스크롤 뷰
- 로딩 상태 표시
- 오늘/내일/날짜 형식의 시간 표시

## ⚙️ 설치 및 실행

```bash
# 패키지 설치
npm install

# 환경 변수 설정
# .env 파일 생성 후 API_KEY 추가
API_KEY=your_openweathermap_api_key

# 개발 서버 실행
npm run start

# iOS 실행
npm run ios

# Android 실행
npm run android
```

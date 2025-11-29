## 프로젝트 개요

이 레포지토리는 **Next.js(App Router) + React 19 + TypeScript + Tailwind CSS** 기반의 예제 프로젝트입니다.  

주요 기능은 다음과 같습니다.

- **게시판(/posts)**  
  - 무한 스크롤, 검색/정렬/필터(카테고리, 날짜 범위)  
  - 컬럼 리사이즈 및 숨김, 금칙어 제한
  - 모달 기반 상세보기 + 수정/삭제, 생성/수정 폼 모달  
  - TanStack Query 기반 CRUD / 무한스크롤(fetchNextPage)  

- **Mock 차트 대시보드(/mock)**  
  - `Chart.js` + `react-chartjs-2` 로 구현된 다양한 차트
  - 커피/스낵 브랜드 바 & 도넛 차트 (브랜드별 색상·보이기/숨기기·색 변경)
  - 주간 기분/운동 **100% 스택 바 & 스택 에어리어 차트**
  - 커피 섭취량 vs 버그/생산성 멀티라인 차트  
  - 스낵 섭취량 vs 회의불참/사기 멀티라인 차트  
  - 모든 차트에 대해 **Legend로 색상 변경 및 시리즈 토글**, 툴팁 커스터마이징

인증 이후 영역은 `app/(afterAuth)` 레이아웃을 통해 보호되며, 상단 공통 헤더에서  
**게시판(/posts)** 와 **Mock 차트(/mock)** 로 이동할 수 있습니다.

---

## 주요 기술 스택

- **Framework**
  - Next.js (App Router)
  - React 19
  - TypeScript

- **스타일링 / UI**
  - Tailwind CSS

- **데이터 패칭 / 상태관리**
  - `@tanstack/react-query` (Query, InfiniteQuery, Mutation)
  - 커스텀 `apiClient` 래퍼로 API 호출

- **차트**
  - `chart.js`
  - `react-chartjs-2`

---

## 폴더 구조 (주요 경로)

```text
app/
  _components/
    Header.tsx               // 상단 공통 헤더 (네비게이션)

  (beforeAuth)/
    login/
      page.tsx               // 로그인 페이지

  (afterAuth)/
    layout.tsx               // 인증된 영역 레이아웃 + Header

    posts/
      page.tsx               // 게시판 진입 페이지
      _components/
        Posts.tsx            // 게시판 컨테이너 (쿼리/상태/모달 관리)
        PostFilters.tsx      // 검색/정렬/필터 UI
        PostTable.tsx        // 테이블 + 무한 스크롤 + 컬럼 리사이즈
        PostFormModal.tsx    // 생성/수정 폼 모달
        postTypes.ts         // 타입 정의 및 컬럼 설정

  mock/
    page.tsx               // Mock 차트 페이지 진입
    _components/
    Mock.tsx             // 상위 컨테이너 (모든 mock 데이터 useQuery)
    coffee/
        CoffeeBrandsCharts.tsx   // 커피 브랜드 바/도넛
    snack/
        SnackBrandsCharts.tsx    // 스낵 브랜드 바/도넛
    mood/
        WeeklyMoodCharts.tsx     // 주간 기분 스택 바/에어리어
    workout/
        WeeklyWorkoutCharts.tsx  // 주간 운동 스택 바/에어리어
    multi/
        CoffeeConsumptionChart.tsx // 커피 vs 버그/생산성 멀티라인
        SnackImpactChart.tsx      // 스낵 vs 회의불참/사기 멀티라인

lib/
  apiClient.ts               // 공통 API 클라이언트 래퍼
  authApi.ts                 // 인증 관련 API
  postsApi.ts                // 게시판 관련 API (무한스크롤, cursor 기반)
  mockApi.ts                 // Mock 차트용 API 및 타입 정의
```

---

## 실행 방법

### 1. 의존성 설치

(node 버전 22.18.0 에서 실행행)
프로젝트 루트(`package.json`이 있는 위치)에서:

```
npm install
```

### 2. 서버 실행

```
npm run build 빌드 후
npm run start
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

### 3. 라우팅
- `/login`: 로그인 화면면
- `/posts`: 게시판 화면
- `/mock`: Mock 차트 대시보드


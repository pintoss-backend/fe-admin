# React + TypeScript + Vite + FSD

관리자 대시보드 애플리케이션입니다. Feature-Sliced Design (FSD) 아키텍처를 적용하여 개발되었습니다.

## 🚀 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Ant Design** - UI 컴포넌트 라이브러리
- **Zustand** - 상태 관리
- **Zod** - 스키마 검증
- **Jest** - 테스트 프레임워크
- **Prettier** - 코드 포맷팅
- **ESLint** - 코드 린팅

## 📁 FSD 구조로 변경된 프로젝트

### 디렉토리 구조:

```
src/
├── app/          # 앱 설정, 라우팅, 글로벌 스타일
├── pages/        # 페이지 컴포넌트
├── widgets/      # 복합 UI 블록
├── features/     # 비즈니스 기능
├── entities/     # 비즈니스 엔티티
└── shared/       # 공유 유틸리티
```

### 구현된 기능들:

✅ **FSD 아키텍처 적용**

- 레이어별 명확한 분리
- 의존성 방향 준수 (shared → entities → features → widgets → pages → app)

✅ **Ant Design 로그인 폼**

- 이메일/비밀번호 입력
- 실시간 유효성 검사
- 로딩 상태 표시
- 에러 메시지 처리

✅ **Zustand 상태 관리**

- 인증 상태 관리
- 로그인/로그아웃 기능
- 사용자 정보 저장

✅ **Zod 폼 검증**

- 타입 안전한 스키마 검증
- 한국어 에러 메시지

✅ **대시보드 페이지**

- 로그인 후 전환
- 사용자 정보 표시
- 로그아웃 기능

## 🧪 테스트 계정

- **이메일**: `admin@example.com`
- **비밀번호**: `password123`

## 🛠️ 개발 명령어

```bash
# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 테스트 실행
pnpm test

# 테스트 감시 모드
pnpm test:watch

# 코드 포맷팅
pnpm format

# 린트 검사
pnpm lint
```

## 📦 설치된 패키지

### 의존성

- `react` - React 라이브러리
- `react-dom` - React DOM
- `antd` - Ant Design UI 라이브러리
- `@ant-design/icons` - Ant Design 아이콘
- `zustand` - 상태 관리
- `zod` - 스키마 검증

### 개발 의존성

- `typescript` - TypeScript
- `vite` - 빌드 도구
- `@vitejs/plugin-react` - React 플러그인
- `jest` - 테스트 프레임워크
- `@testing-library/react` - React 테스트 라이브러리
- `prettier` - 코드 포맷터
- `eslint` - 코드 린터

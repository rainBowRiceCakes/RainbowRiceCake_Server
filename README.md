# 🌈 DGD - 서버

> 본 프로젝트는 배달 대행 플랫폼 '무지개떡'의 서버 애플리케이션입니다.
> 사용자(고객), 라이더, 파트너사, 그리고 관리자 간의 유기적인 상호작용을 위한 핵심 비즈니스 로직과 API를 제공합니다.

---

## ✨ 주요 기능

### 🧑‍🤝‍🧑 공통
- **인증/인가:** JWT 기반의 사용자 인증 및 역할(User, Rider, Partner, Admin)에 따른 API 접근 제어
- **소셜 로그인:** 카카오 소셜 로그인을 통한 간편한 회원가입 및 로그인
- **프로필 관리:** 사용자 정보 수정 및 프로필 이미지 업로드
- **Q&A:** 1:1 문의 및 답변 기능 (이미지 첨부 가능)

### 🛵 라이더
- **주문 접수 및 관리:** 실시간 주문 목록 확인, 주문 접수, 배달 상태 (픽업, 완료) 변경
- **정산 관리:** 배달 수수료 정산 내역 확인 및 자동 정산 스케줄링

### 🏢 파트너 (가맹점)
- **주문 접수 및 관리:** 실시간 주문 유입 확인 및 주문 처리
- **정산 관리:** 주문에 대한 정산 내역 확인 및 자동 정산 스케줄링
- **호텔 관리:** 파트너사에 속한 호텔 정보 등록 및 관리

### 👨‍💻 관리자
- **회원 관리:** 전체 회원(사용자, 라이더, 파트너) 정보 조회 및 관리
- **공지사항 관리:** 전체 사용자를 대상으로 한 공지사항 작성 및 관리
- **정산 관리:** 전체 정산 내역 모니터링 및 수동 정산 처리

---

## 🏗️ 아키텍처

본 서버는 유지보수성과 확장성을 높이기 위해 **계층형 아키텍처 (Layered Architecture)** 로 설계되었습니다.

```
📦 RainbowRiceCake_Server
┣ 📂 routes - API 엔드포인트 정의 및 요청/응답 형식 유효성 검사
┣ 📂 middlewares - 인증/인가, 파일 업로드(Multer), 로깅(Winston) 등 공통 로직 처리
┣ 📂 controllers - HTTP 요청을 받아 서비스 계층으로 비즈니스 로직 처리를 위임하고, 결과를 반환
┣ 📂 services - 실제 비즈니스 로직을 수행하며, 여러 리포지토리를 조합하여 사용
┣ 📂 repositories - 데이터베이스와의 상호작용(CRUD)을 담당 (Sequelize ORM 사용)
┣ 📂 models - 데이터베이스 테이블과 매핑되는 모델(Entity) 정의
┗ 📂 schedulers - 정기적인 작업(정산 등)을 처리하기 위한 스케줄러 (node-schedule)
```

---

## 📊 데이터베이스 스키마 (ERD)

주요 엔티티 간의 관계는 다음과 같습니다.

*   **Users**는 **Riders**, **Partners**와 1:1 관계를 가집니다. (User 테이블이 공통 정보를 관리)
*   하나의 **Order**는 각각 하나의 **User**, **Rider**, **Partner**, **Hotel**과 관계를 맺습니다.
*   **Settlements** (라이더 정산)는 **Rider**와, **PartnerSettlements** (파트너 정산)는 **Partner**와 1:N 관계를 가집니다.
*   자세한 관계는 `app/models` 폴더의 각 모델 파일과 `databases/migrations` 폴더의 FK 설정 코드를 통해 확인할 수 있습니다.

---

## 🛠️ 기술 스택

### Environment
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white">

### Database
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"> <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white">

### Authentication & Security
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20Web%20Tokens&logoColor=white"> <img src="https://img.shields.io/badge/Bcrypt-6246e6?style=for-the-badge&logo=Bcrypt&logoColor=white"> <img src="https://img.shields.io/badge/CORS-000000?style=for-the-badge&logo=CORS&logoColor=white">

### API Documentation
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black">

### Others
<img src="https://img.shields.io/badge/Multer-2a9d8f?style=for-the-badge"> <img src="https://img.shields.io/badge/Winston-fca311?style=for-the-badge"> <img src="https://img.shields.io/badge/node--schedule-3d405b?style=for-the-badge"> <img src="https://img.shields.io/badge/dotenv-f4a261?style=for-the-badge"> <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

---

## 📖 API 문서

**Swagger**를 통해 API 명세를 확인할 수 있습니다.
서버 실행 후, `http://localhost:[포트번호]/api-docs` 경로로 접속하세요.

> **Swagger 문서 자동 생성**
> API 코드를 수정한 경우, 아래 명령어를 실행하여 Swagger 문서를 최신 상태로 업데이트할 수 있습니다.
> ```bash
> npm run swagger
> ```

---

## 🚀 시작하기

### 1. 프로젝트 클론
```bash
git clone https://github.com/[your-username]/RainbowRiceCake_Server.git
cd RainbowRiceCake_Server
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 데이터베이스 정보 및 JWT 시크릿 키 등 필요한 환경 변수를 설정합니다.

```env
# .env 예시
DATABASE_URL=mysql://[사용자명]:[비밀번호]@[호스트]:[포트]/[데이터베이스명]
JWT_SECRET=[나만의 시크릿 키]
COOKIE_SECRET=[나만의 쿠키 시크릿]
# ... 기타 필요한 환경 변수
```

### 4. 데이터베이스 마이그레이션
```bash
npx sequelize db:migrate
```
> (선택) 초기 더미 데이터가 필요한 경우, 시더(Seeder) 파일을 실행합니다.
> ```bash
> npx sequelize-cli db:seed:all
> ```

### 5. 서버 실행
```bash
npm run start
```
서버가 정상적으로 실행되면 `http://localhost:[포트번호]`에서 API 요청을 보낼 수 있습니다.

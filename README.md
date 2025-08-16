# 11st Clone Project

React + NestJS + PostgreSQL 기반의 11번가 클론 프로젝트입니다.

## 🚀 개발 환경 설정

### 필수 요구사항
- Docker
- Docker Compose
- Git

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd 11st-clone
```

### 2. 환경 변수 설정 (선택사항)
```bash
cp env.example .env
# .env 파일을 편집하여 필요한 환경 변수를 설정하세요
```

### 3. 개발 서버 실행
```bash
# 전체 서비스 실행 (프론트엔드 + 백엔드 + 데이터베이스)
docker-compose up

# 백그라운드에서 실행
docker-compose up -d

# 특정 서비스만 실행
docker-compose up frontend
docker-compose up backend
docker-compose up postgres
```

### 4. 개발 서버 접속
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **데이터베이스**: localhost:5432

## 📁 프로젝트 구조

```
11st-clone/
├── frontend/          # React 애플리케이션
│   ├── public/        # 정적 파일
│   │   └── images/    # 이미지 파일
│   └── src/           # 소스 코드
├── backend/           # NestJS API 서버
│   └── src/           # 소스 코드
├── database/          # 데이터베이스 관련 파일
│   └── init/          # 초기화 스크립트
│       └── 01-init.sql # 데이터베이스 스키마 및 샘플 데이터
├── docker-compose.yml # Docker Compose 설정
├── docker-compose.override.yml # 개발 환경 오버라이드
├── env.example        # 환경 변수 예시
└── README.md
```

## 🔧 개발 가이드

### 파일 수정 방법
1. **프론트엔드 수정**: `frontend/` 폴더의 파일을 직접 수정하면 Hot Reload로 자동 반영됩니다.
2. **백엔드 수정**: `backend/` 폴더의 파일을 직접 수정하면 Hot Reload로 자동 반영됩니다.
3. **데이터베이스**: PostgreSQL 데이터는 `postgres_data` 볼륨에 저장됩니다.

### 유용한 명령어
```bash
# 로그 확인
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres

# 실시간 로그 확인
docker-compose logs -f frontend

# 서비스 재시작
docker-compose restart frontend
docker-compose restart backend

# 컨테이너 내부 접속
docker-compose exec frontend sh
docker-compose exec backend sh
docker-compose exec postgres psql -U user -d db

# 전체 정리
docker-compose down -v

# 이미지 재빌드
docker-compose build --no-cache
```

### 데이터베이스 관리
```bash
# PostgreSQL 접속
docker-compose exec postgres psql -U user -d db

# 테이블 목록 확인
\dt

# 데이터 확인
SELECT * FROM users;
SELECT * FROM products;

# 데이터베이스 백업
docker-compose exec postgres pg_dump -U user db > backup.sql

# 데이터베이스 복원
docker-compose exec -T postgres psql -U user db < backup.sql

# 초기화 스크립트 수동 실행 (필요시)
cat database/init/01-init.sql | docker-compose exec -T postgres psql -U user -d db
```

### 외부 DB GUI 툴 접속
**pgAdmin, DBeaver 등으로 접속할 때:**
```
호스트: localhost
포트: 5432
데이터베이스: db
사용자명: user
비밀번호: password
```

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL 15
- **Container**: Docker, Docker Compose
- **ORM**: TypeORM

## 📊 데이터베이스 스키마

### 초기화 스크립트 (`database/init/01-init.sql`)
데이터베이스 시작 시 자동으로 실행되는 초기화 스크립트입니다:
- **테이블 생성**: 7개 테이블 (users, admins, categories, products, product_images, orders, order_items)
- **샘플 데이터 삽입**: 실제 개발에 필요한 테스트 데이터
- **외래 키 관계**: 테이블 간 관계 설정
- **자동 실행**: Docker Compose 시작 시 자동으로 실행됨

### 주요 테이블
- **users**: 사용자 정보 (이메일, 비밀번호, 이름, 주소, 전화번호)
- **admins**: 관리자 정보 (이메일, 비밀번호, 이름, 전화번호, 주소)
- **categories**: 상품 카테고리 (계층 구조 지원)
- **products**: 상품 정보 (이름, 가격, 설명, 재고, 이미지)
- **product_images**: 상품 이미지 (여러 이미지 지원)
- **orders**: 주문 정보 (사용자, 총 금액, 상태)
- **order_items**: 주문 상세 (상품, 수량, 가격)

### 샘플 데이터
- **사용자**: 3명 (김철수, 이영희, 박민수)
- **관리자**: 1명 (11번가 관리자)
- **카테고리**: 16개 (전자제품, 의류, 가구, 식품 및 하위 카테고리)
- **상품**: 14개 (iPhone, Galaxy, MacBook, 의류, 가구, 식품 등)
- **주문**: 3개 (완료, 대기, 배송중)

## 🖼️ 이미지 관리

### 이미지 저장 구조
```
frontend/public/images/products/
├── product_1/          # 상품 ID별 폴더
│   ├── main.jpg        # 메인 이미지
│   ├── detail_1.jpg    # 상세 이미지
│   └── thumbnail.jpg   # 썸네일
```

### 이미지 규격
- **메인 이미지**: 800x800px
- **상세 이미지**: 1200x800px
- **썸네일**: 200x200px

## 📝 주의사항

1. **포트 충돌**: 3000, 3001, 5432 포트가 사용 중이면 다른 포트로 변경하세요.
2. **환경 변수**: 민감한 정보는 `.env` 파일에 저장하고 `.gitignore`에 추가하세요.
3. **데이터 보존**: `docker-compose down -v` 명령어는 데이터베이스 데이터를 삭제합니다.
4. **이미지 파일**: `frontend/public/images/` 폴더에 이미지를 저장하세요.

## 🤝 팀 개발 가이드

### 브랜치 전략
```bash
# 기능 개발
git checkout -b feature/상품목록
git checkout -b feature/장바구니
git checkout -b feature/결제시스템

# 버그 수정
git checkout -b fix/로그인오류
```

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 프로세스 또는 보조 도구 변경
```

### 개발 워크플로우
1. **기능 브랜치 생성**: `git checkout -b feature/기능명`
2. **개발 및 테스트**: 로컬에서 기능 개발
3. **커밋**: `git add .` → `git commit -m "feat: 기능 설명"`
4. **푸시**: `git push origin feature/기능명`
5. **PR 생성**: GitHub/GitLab에서 Pull Request 생성
6. **코드 리뷰**: 팀원과 코드 리뷰 진행
7. **머지**: 승인 후 main 브랜치로 머지

### 환경 동기화
- 새로운 의존성 추가 시 팀원들에게 알려주세요
- 환경 변수 변경 시 `env.example` 파일도 업데이트하세요
- 데이터베이스 스키마 변경 시 마이그레이션 스크립트를 작성하세요

## 🚨 문제 해결

### 자주 발생하는 문제들

**1. 포트 충돌**
```bash
# 포트 사용 확인
lsof -i :3000
lsof -i :3001
lsof -i :5432

# 다른 포트로 변경 (docker-compose.yml 수정)
```

**2. 컨테이너 시작 실패**
```bash
# 로그 확인
docker-compose logs

# 컨테이너 재빌드
docker-compose build --no-cache
docker-compose up
```

**3. 데이터베이스 연결 실패**
```bash
# PostgreSQL 상태 확인
docker-compose ps postgres

# 데이터베이스 재시작
docker-compose restart postgres
```

**4. Hot Reload 작동 안함**
```bash
# 볼륨 마운트 확인
docker-compose exec frontend ls -la /app
docker-compose exec backend ls -la /app
```

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. README.md의 문제 해결 섹션
2. Docker 및 Docker Compose 로그
3. 팀원과 상의

---

**Happy Coding! 🚀**
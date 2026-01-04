# 배포 가이드 (Deployment Guide)

이 프로젝트를 무료로 배포하는 여러 방법을 안내합니다.

## 🚀 배포 옵션 비교

| 플랫폼 | 난이도 | 무료 도메인 | SSL | 추천도 |
|--------|--------|------------|-----|--------|
| **GitHub Pages** | ⭐⭐ 쉬움 | ✅ 예 | ✅ 자동 | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐ 매우쉬움 | ✅ 예 | ✅ 자동 | ⭐⭐⭐⭐⭐ |
| **Vercel** | ⭐⭐ 쉬움 | ✅ 예 | ✅ 자동 | ⭐⭐⭐⭐ |
| **Surge.sh** | ⭐⭐ 쉬움 | ❌ 아니오 | ✅ 자동 | ⭐⭐⭐ |

---

## 방법 1: GitHub Pages (추천) ⭐

GitHub Pages는 가장 인기 있고 안정적인 무료 호스팅 서비스입니다.

### 준비 사항
- GitHub 계정 (없으면 https://github.com 가입)

### 배포 단계

#### 1. GitHub 저장소 생성
```bash
# Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/사용자명/eventrsvp.git
git branch -M main
git push -u origin main
```

#### 2. GitHub Pages 활성화
1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source**에서 **Deploy from a branch** 선택
5. Branch를 **main** 또는 **master** 선택
6. Folder를 **/ (root)** 선택
7. **Save** 클릭

#### 3. 배포 완료!
- 몇 분 후 `https://사용자명.github.io/eventrsvp/` 주소로 접속 가능
- URL은 Settings > Pages에서 확인 가능

---

## 방법 2: Netlify (가장 쉬움) ⭐⭐⭐

Netlify는 드래그 앤 드롭으로 가장 쉽게 배포할 수 있습니다.

### 배포 단계

#### 옵션 A: 드래그 앤 드롭 (가장 쉬움)
1. https://www.netlify.com 접속 및 회원가입
2. 대시보드에서 **Sites** 클릭
3. **Add new site** > **Deploy manually** 선택
4. 프로젝트 폴더를 드래그 앤 드롭
5. 배포 완료! 자동으로 URL 생성

#### 옵션 B: Git 연동 (자동 배포)
1. Netlify에 로그인
2. **Add new site** > **Import an existing project**
3. GitHub 저장소 연결
4. Build settings:
   - Build command: (비워두기)
   - Publish directory: `.` 또는 비워두기
5. **Deploy site** 클릭

### 커스텀 도메인
- Netlify 대시보드 > Site settings > Domain management
- 무료로 `yourname.netlify.app` 도메인 제공
- 커스텀 도메인도 연결 가능

---

## 방법 3: Vercel

Vercel은 개발자 친화적인 배포 플랫폼입니다.

### 배포 단계
1. https://vercel.com 접속 및 회원가입
2. **Add New Project** 클릭
3. GitHub 저장소 선택 또는 직접 업로드
4. **Deploy** 클릭
5. 배포 완료!

---

## 방법 4: Surge.sh (CLI 도구)

명령줄로 빠르게 배포할 수 있습니다.

### 설치 및 배포
```bash
# Surge 설치
npm install -g surge

# 배포 (프로젝트 폴더에서)
surge

# 첫 배포 시:
# - 이메일 입력
# - 비밀번호 생성
# - 도메인 입력 (예: eventrsvp.surge.sh)
```

---

## 📝 배포 전 체크리스트

- [x] 모든 파일이 정상 작동하는지 확인
- [ ] Git 저장소 생성 (선택사항)
- [ ] README.md 업데이트
- [ ] 테스트 완료

---

## 🔗 배포 후 작업

### 1. README에 배포 링크 추가
README.md에 배포된 사이트 URL을 추가하세요.

### 2. 공유 URL 업데이트
`app.js`의 공유 기능이 배포된 URL을 사용하도록 확인하세요.

### 3. Google Analytics 추가 (선택사항)
사용자 통계를 확인하고 싶다면 Google Analytics를 추가할 수 있습니다.

---

## 💡 팁

- **GitHub Pages**: 오픈소스 프로젝트에 적합, 무료 도메인 제공
- **Netlify**: 가장 쉬움, 폼 처리 등 추가 기능 많음
- **Vercel**: Next.js 등 프레임워크 프로젝트에 최적
- **Surge.sh**: 빠른 프로토타입 테스트에 적합

---

## 🆘 문제 해결

### CORS 오류
- LocalStorage는 도메인별로 작동하므로 문제 없습니다.

### 404 오류
- GitHub Pages의 경우 `index.html`이 루트에 있는지 확인하세요.
- Netlify/Vercel은 자동으로 `index.html`을 인식합니다.

### CSS/JS 로드 안됨
- CDN 링크를 사용하고 있으므로 문제 없습니다.
- 브라우저 콘솔에서 오류 확인하세요.


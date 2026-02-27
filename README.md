# startaxwebsite

STARTAX 소개 웹사이트(Next.js App Router) 프로젝트입니다.

## 실행

```bash
npm install
npm run dev
```

- 개발 서버: `http://localhost:3000`
- 프로덕션 빌드: `npm run build`
- 린트: `npm run lint`

## 폴더 구조

```text
.
├── app/                     # 페이지/레이아웃/도메인 UI (App Router)
│   ├── components/          # 공통 섹션 컴포넌트
│   ├── context/             # 전역 컨텍스트
│   └── services/            # 서비스 상세 페이지 및 전용 컴포넌트
├── public/
│   └── assets/
│       └── used/            # 실제 서비스에서 참조되는 정적 파일
├── assets/
│   └── unused/              # 작업용/보관용 원본 에셋 (배포 미사용)
└── ...
```

## 에셋 규칙

- 사용자에게 노출되는 이미지/정적 파일은 `public/assets/used` 아래에 둡니다.
- 코드에서 참조할 경로는 `/assets/used/...` 형태를 사용합니다.
- 작업 중 임시/보관 에셋은 `assets/unused`에 두고 Git 추적에서 제외합니다.

## Git 관리 규칙

- `.next`, `node_modules`, `.idea`, `assets/unused`는 버전 관리에서 제외합니다.
- IDE 개별 설정은 각자 로컬 환경에서 관리합니다.

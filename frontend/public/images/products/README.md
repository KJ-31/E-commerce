# 상품 이미지 저장 구조

## 폴더 구조
```
frontend/public/images/products/
├── product_1/          # 상품 ID별 폴더
│   ├── main.jpg        # 메인 이미지
│   ├── detail_1.jpg    # 상세 이미지 1
│   ├── detail_2.jpg    # 상세 이미지 2
│   └── thumbnail.jpg   # 썸네일 이미지
├── product_2/
│   ├── main.jpg
│   └── detail_1.jpg
└── ...
```

## 이미지 규격
- **메인 이미지**: 800x800px (정사각형)
- **상세 이미지**: 1200x800px (가로형)
- **썸네일**: 200x200px (정사각형)
- **포맷**: JPG, PNG, WebP

## URL 구조
- 로컬 개발: `http://localhost:3000/images/products/product_1/main.jpg`
- 프로덕션: `https://cdn.example.com/images/products/product_1/main.jpg`

## 업로드 방식
1. **개발 환경**: 로컬 파일 시스템에 직접 저장
2. **프로덕션**: 클라우드 스토리지 (AWS S3 등) + CDN

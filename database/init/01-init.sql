-- 11st Clone Database 초기화 스크립트
-- 이미 테이블이 존재하면 초기화하지 않음

DO $$
BEGIN
    -- users 테이블이 존재하지 않을 때만 초기화 실행
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        
        -- 사용자
        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            user_pw VARCHAR(255) NOT NULL,
            user_name VARCHAR(100) NOT NULL,
            user_addr TEXT,
            user_phone_num VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 셀러(판매자)
        CREATE TABLE sellers (
            seller_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            seller_pw VARCHAR(255) NOT NULL,
            seller_name VARCHAR(100) NOT NULL,
            seller_phone_num VARCHAR(20),
            seller_addr TEXT,
            company_name VARCHAR(100),
            business_number VARCHAR(20),
            company_phone VARCHAR(20),
            company_addr TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 카테고리
        CREATE TABLE categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) NOT NULL,
            parent_category_id INTEGER REFERENCES categories(category_id)
        );

        -- 상품
        CREATE TABLE products (
            product_id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            category_id INTEGER REFERENCES categories(category_id),
            seller_id INTEGER REFERENCES sellers(seller_id),
            product_price DECIMAL(10,2) NOT NULL,
            company VARCHAR(100),
            description TEXT,
            quantity INTEGER DEFAULT 0,
            main_img VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 상품 이미지 (여러 이미지 지원)
        CREATE TABLE product_images (
            image_id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(product_id),
            image_url VARCHAR(500) NOT NULL,
            image_order INTEGER DEFAULT 0,
            is_main BOOLEAN DEFAULT false
        );

        -- 주문
        CREATE TABLE orders (
            order_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            total_price DECIMAL(10,2) NOT NULL,
            order_status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 주문 상세
        CREATE TABLE order_items (
            order_item_id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(order_id),
            product_id INTEGER REFERENCES products(product_id),
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 샘플 데이터 삽입

        -- 카테고리 데이터
        INSERT INTO categories (category_name, parent_category_id) VALUES
        ('전자제품', NULL),
        ('의류', NULL),
        ('가구', NULL),
        ('식품', NULL),
        ('스마트폰', 1),
        ('노트북', 1),
        ('태블릿', 1),
        ('남성의류', 2),
        ('여성의류', 2),
        ('아동의류', 2),
        ('책상', 3),
        ('의자', 3),
        ('침대', 3),
        ('과일', 4),
        ('채소', 4),
        ('육류', 4);

        -- 셀러 데이터
        INSERT INTO sellers (email, seller_pw, seller_name, seller_phone_num, seller_addr, company_name, business_number, company_phone, company_addr) VALUES
        ('seller1@test.com', 'hashed_seller_password', '김판매', '010-1111-3333', '서울시 강남구 테헤란로 123', '(주)테스트회사', '123-45-67890', '02-1234-5678', '서울시 강남구 테헤란로 456'),
        ('seller2@test.com', 'hashed_seller_password', '이상점', '010-2222-4444', '서울시 서초구 서초대로 456', '(주)샘플스토어', '234-56-78901', '02-2345-6789', '서울시 서초구 서초대로 789');

        -- 사용자 데이터
        INSERT INTO users (email, user_pw, user_name, user_addr, user_phone_num) VALUES
        ('user1@test.com', 'hashed_user_password', '김철수', '서울시 강남구 테헤란로 123', '010-1111-2222'),
        ('user2@test.com', 'hashed_user_password', '이영희', '서울시 서초구 서초대로 456', '010-3333-4444'),
        ('user3@test.com', 'hashed_user_password', '박민수', '서울시 마포구 와우산로 789', '010-5555-6666');

        -- 상품 데이터
        INSERT INTO products (product_name, category_id, seller_id, product_price, company, description, quantity, main_img) VALUES
        -- 스마트폰 (5) - 판매자 1
        ('iPhone 15 Pro', 5, 1, 1500000.00, 'Apple', '최신 아이폰 15 Pro 256GB', 50, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'),
        ('Samsung Galaxy S24', 5, 1, 1200000.00, 'Samsung', '삼성 갤럭시 S24 256GB', 45, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop'),
        ('Google Pixel 8', 5, 1, 1100000.00, 'Google', 'Google Pixel 8 128GB', 30, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop'),
        ('OnePlus 12', 5, 2, 1000000.00, 'OnePlus', 'OnePlus 12 256GB', 25, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'),
        ('Xiaomi 14', 5, 2, 900000.00, 'Xiaomi', 'Xiaomi 14 256GB', 40, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop'),
        
        -- 노트북 (6) - 판매자 1,2
        ('MacBook Pro 14인치', 6, 1, 2800000.00, 'Apple', 'M3 칩 탑재 맥북 프로 14인치', 30, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'),
        ('LG Gram 노트북', 6, 1, 1800000.00, 'LG', '초경량 LG Gram 15인치 노트북', 25, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'),
        ('Samsung Galaxy Book', 6, 2, 1600000.00, 'Samsung', 'Samsung Galaxy Book Pro 360', 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'),
        ('Dell XPS 13', 6, 2, 2000000.00, 'Dell', 'Dell XPS 13 13인치 노트북', 15, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'),
        ('HP Spectre x360', 6, 1, 1900000.00, 'HP', 'HP Spectre x360 13인치', 18, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'),
        
        -- 태블릿 (7)
        ('iPad Air', 7, 1, 800000.00, 'Apple', 'iPad Air 5세대 64GB', 40, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'),
        ('Samsung Galaxy Tab S9', 7, 2, 700000.00, 'Samsung', 'Samsung Galaxy Tab S9 11인치', 35, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'),
        ('iPad Pro 12.9', 7, 1, 1500000.00, 'Apple', 'iPad Pro 12.9인치 M2 칩', 20, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'),
        ('Microsoft Surface Pro', 7, 2, 1200000.00, 'Microsoft', 'Microsoft Surface Pro 9', 15, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'),
        ('Lenovo Tab P11', 7, 1, 400000.00, 'Lenovo', 'Lenovo Tab P11 11인치', 50, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'),
        
        -- 남성의류 (8)
        ('남성 캐주얼 티셔츠', 8, 2, 25000.00, '유니클로', '편안한 남성용 캐주얼 티셔츠', 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop'),
        ('남성 정장', 8, 1, 150000.00, 'ZARA', '남성용 정장 세트', 30, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop'),
        ('남성 청바지', 8, 2, 45000.00, 'Levi\s', '남성용 스키니 진', 80, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop'),
        ('남성 후드티', 8, 1, 35000.00, 'Nike', '남성용 후드 티셔츠', 60, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop'),
        ('남성 폴로셔츠', 8, 2, 55000.00, 'Ralph Lauren', '남성용 폴로 셔츠', 40, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop'),
        ('남성 패딩', 8, 1, 120000.00, 'The North Face', '남성용 패딩 자켓', 25, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop'),
        ('남성 운동복', 8, 2, 65000.00, 'Adidas', '남성용 트레이닝 세트', 70, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'),
        ('남성 양말', 8, 1, 8000.00, 'Stance', '남성용 면 양말 5켤레', 200, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c5a?w=600&h=600&fit=crop'),
        
        -- 여성의류 (9)
        ('여성 원피스', 9, 2, 45000.00, 'ZARA', '여성용 여름 원피스', 80, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop'),
        ('여성 블라우스', 9, 1, 35000.00, 'H&M', '여성용 실크 블라우스', 60, 'https://images.unsplash.com/photo-1564257631407-3deb25e91aa5?w=600&h=600&fit=crop'),
        ('여성 스커트', 9, 2, 40000.00, 'Mango', '여성용 미니 스커트', 50, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=600&fit=crop'),
        ('여성 니트', 9, 1, 55000.00, 'COS', '여성용 니트 스웨터', 45, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop'),
        ('여성 코트', 9, 2, 180000.00, 'Massimo Dutti', '여성용 울 코트', 20, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop'),
        ('여성 청바지', 9, 1, 50000.00, 'Levi\s', '여성용 하이웨이스트 진', 75, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop'),
        ('여성 운동복', 9, 2, 70000.00, 'Lululemon', '여성용 요가 팬츠', 55, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'),
        ('여성 가방', 9, 1, 120000.00, 'Michael Kors', '여성용 크로스백', 30, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop'),
        
        -- 아동의류 (10)
        ('아동용 운동화', 10, 2, 35000.00, '나이키', '아동용 운동화 사이즈 200-230', 60, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'),
        ('아동용 티셔츠', 10, 1, 15000.00, '유니클로', '아동용 캐릭터 티셔츠', 120, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'),
        ('아동용 바지', 10, 2, 20000.00, 'Gap Kids', '아동용 면 바지', 90, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'),
        ('아동용 후드티', 10, 1, 25000.00, 'Adidas Kids', '아동용 후드 티셔츠', 70, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'),
        ('아동용 원피스', 10, 2, 30000.00, 'ZARA Kids', '아동용 여름 원피스', 50, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'),
        
        -- 책상 (11)
        ('책상 세트', 11, 1, 150000.00, '이케아', '책상과 의자가 포함된 세트', 20, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('스탠딩 책상', 11, 2, 200000.00, 'Fully', '전동 스탠딩 책상', 15, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('L자 책상', 11, 1, 180000.00, '이케아', 'L자형 컴퓨터 책상', 25, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('학생용 책상', 11, 2, 80000.00, '이케아', '학생용 책상 세트', 40, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('모니터 받침대', 11, 1, 30000.00, '이케아', '모니터 받침대', 100, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        
        -- 의자 (12)
        ('사무용 의자', 12, 2, 80000.00, '허먼밀러', '인체공학적 사무용 의자', 35, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('게이밍 의자', 12, 1, 120000.00, 'Secretlab', '게이밍 의자', 20, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('식탁 의자', 12, 2, 45000.00, '이케아', '식탁용 의자 4개 세트', 30, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('안락 의자', 12, 1, 150000.00, '이케아', '안락 의자', 15, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        ('바 의자', 12, 2, 25000.00, '이케아', '바 스툴', 50, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop'),
        
        -- 침대 (13)
        ('퀸사이즈 침대', 13, 1, 300000.00, '시몬스', '퀸사이즈 침대 프레임', 15, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop'),
        ('킹사이즈 침대', 13, 2, 400000.00, '시몬스', '킹사이즈 침대 프레임', 10, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop'),
        ('싱글 침대', 13, 1, 150000.00, '이케아', '싱글 침대 프레임', 25, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop'),
        ('침대 매트리스', 13, 2, 200000.00, '시몬스', '퀸사이즈 매트리스', 20, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop'),
        ('침대 커버', 13, 1, 50000.00, '이케아', '침대 커버 세트', 40, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop'),
        
        -- 과일 (14)
        ('신선한 사과 1kg', 14, 2, 8000.00, '농협', '신선한 국내산 사과 1kg', 200, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop'),
        ('바나나 1kg', 14, 1, 3000.00, '농협', '신선한 바나나 1kg', 300, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop'),
        ('오렌지 1kg', 14, 2, 5000.00, '농협', '제철 오렌지 1kg', 150, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop'),
        ('포도 500g', 14, 1, 6000.00, '농협', '샤인머스켓 500g', 100, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=600&fit=crop'),
        ('딸기 400g', 14, 2, 8000.00, '농협', '국내산 딸기 400g', 80, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop'),
        ('키위 6개', 14, 1, 4000.00, '농협', '제철 키위 6개', 120, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=600&fit=crop'),
        ('망고 2개', 14, 2, 7000.00, '농협', '제철 망고 2개', 60, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop'),
        ('레몬 5개', 14, 1, 3000.00, '농협', '신선한 레몬 5개', 200, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'),
        
        -- 채소 (15)
        ('유기농 당근 500g', 15, 2, 3000.00, '농협', '유기농 당근 500g', 150, 'https://images.unsplash.com/photo-1447175008436-170170753d52?w=600&h=600&fit=crop'),
        ('브로콜리 300g', 15, 1, 4000.00, '농협', '신선한 브로콜리 300g', 100, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop'),
        ('양파 1kg', 15, 2, 2000.00, '농협', '국내산 양파 1kg', 300, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop'),
        ('감자 1kg', 15, 1, 2500.00, '농협', '국내산 감자 1kg', 250, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop'),
        ('상추 200g', 15, 2, 1500.00, '농협', '신선한 상추 200g', 200, 'https://images.unsplash.com/photo-1622205313162-be1d5716a43b?w=600&h=600&fit=crop'),
        ('토마토 500g', 15, 1, 3500.00, '농협', '제철 토마토 500g', 120, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop'),
        ('오이 3개', 15, 2, 2000.00, '농협', '신선한 오이 3개', 180, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop'),
        ('고구마 1kg', 15, 1, 4000.00, '농협', '국내산 고구마 1kg', 100, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop'),
        
        -- 육류 (16)
        ('한우 등심 200g', 16, 2, 25000.00, '농협', '프리미엄 한우 등심 200g', 50, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('돼지고기 목살 500g', 16, 1, 8000.00, '농협', '신선한 돼지고기 목살 500g', 100, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('닭가슴살 1kg', 16, 2, 12000.00, '농협', '무항생제 닭가슴살 1kg', 80, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('양고기 500g', 16, 1, 30000.00, '농협', '프리미엄 양고기 500g', 30, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('오리고기 1kg', 16, 2, 15000.00, '농협', '신선한 오리고기 1kg', 60, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('소고기 다짐육 500g', 16, 1, 18000.00, '농협', '소고기 다짐육 500g', 70, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('돼지고기 삼겹살 1kg', 16, 2, 22000.00, '농협', '돼지고기 삼겹살 1kg', 90, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop'),
        ('닭다리 1kg', 16, 1, 10000.00, '농협', '닭다리 1kg', 110, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop');

        -- 상품 이미지 데이터 (메인 이미지만 추가)
        INSERT INTO product_images (product_id, image_url, image_order, is_main) VALUES
        (1, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', 1, true),
        (2, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', 1, true),
        (3, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop', 1, true),
        (4, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', 1, true),
        (5, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop', 1, true),
        (6, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 1, true),
        (7, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', 1, true),
        (8, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 1, true),
        (9, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', 1, true),
        (10, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', 1, true),
        (11, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 1, true),
        (12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 1, true),
        (13, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 1, true),
        (14, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 1, true),
        (15, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', 1, true),
        (16, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 1, true),
        (17, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=600&fit=crop', 1, true),
        (18, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', 1, true),
        (19, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', 1, true),
        (20, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop', 1, true),
        (21, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', 1, true),
        (22, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', 1, true),
        (23, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c5a?w=600&h=600&fit=crop', 1, true),
        (24, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop', 1, true),
        (25, 'https://images.unsplash.com/photo-1564257631407-3deb25e91aa5?w=600&h=600&fit=crop', 1, true),
        (26, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&h=600&fit=crop', 1, true),
        (27, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop', 1, true),
        (28, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop', 1, true),
        (29, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop', 1, true),
        (30, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', 1, true),
        (31, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop', 1, true),
        (32, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', 1, true),
        (33, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop', 1, true),
        (34, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop', 1, true),
        (35, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop', 1, true),
        (36, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop', 1, true),
        (37, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (38, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (39, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (40, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (41, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (42, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (43, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (44, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (45, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', 1, true),
        (46, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop', 1, true),
        (47, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop', 1, true),
        (48, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop', 1, true),
        (49, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop', 1, true),
        (50, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&h=600&fit=crop', 1, true),
        (51, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop', 1, true),
        (52, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop', 1, true),
        (53, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=600&fit=crop', 1, true),
        (54, 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=600&fit=crop', 1, true),
        (55, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=600&fit=crop', 1, true),
        (56, 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=600&fit=crop', 1, true),
        (57, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=600&fit=crop', 1, true),
        (58, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', 1, true),
        (59, 'https://images.unsplash.com/photo-1447175008436-170170753d52?w=600&h=600&fit=crop', 1, true),
        (60, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop', 1, true),
        (61, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop', 1, true),
        (62, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop', 1, true),
        (63, 'https://images.unsplash.com/photo-1622205313162-be1d5716a43b?w=600&h=600&fit=crop', 1, true),
        (64, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&h=600&fit=crop', 1, true),
        (65, 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=600&h=600&fit=crop', 1, true),
        (66, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop', 1, true),
        (67, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (68, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (69, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (70, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (71, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (72, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (73, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true),
        (74, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop', 1, true);

        -- 주문 데이터
        INSERT INTO orders (user_id, total_price, order_status) VALUES
        (1, 1525000.00, 'completed'),
        (2, 45000.00, 'pending'),
        (3, 80000.00, 'shipping');

        -- 주문 상세 데이터
        INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
        (1, 1, 1, 1500000.00),
        (1, 12, 1, 8000.00),
        (1, 13, 1, 3000.00),
        (1, 14, 1, 25000.00),
        (2, 7, 1, 45000.00),
        (3, 10, 1, 80000.00);

        RAISE NOTICE '데이터베이스 초기화 완료: 테이블 7개, 샘플 데이터 생성됨';
    ELSE
        RAISE NOTICE '데이터베이스가 이미 초기화되어 있습니다.';
    END IF;
END $$;

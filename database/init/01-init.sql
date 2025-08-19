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
        INSERT INTO products (product_name, category_id, product_price, company, description, quantity, main_img) VALUES
        ('iPhone 15 Pro', 5, 1500000.00, 'Apple', '최신 아이폰 15 Pro 256GB', 50, 'https://example.com/iphone15pro.jpg'),
        ('Samsung Galaxy S24', 5, 1200000.00, 'Samsung', '삼성 갤럭시 S24 256GB', 45, 'https://example.com/galaxys24.jpg'),
        ('MacBook Pro 14인치', 6, 2800000.00, 'Apple', 'M3 칩 탑재 맥북 프로 14인치', 30, 'https://example.com/macbookpro.jpg'),
        ('LG Gram 노트북', 6, 1800000.00, 'LG', '초경량 LG Gram 15인치 노트북', 25, 'https://example.com/lggram.jpg'),
        ('iPad Air', 7, 800000.00, 'Apple', 'iPad Air 5세대 64GB', 40, 'https://example.com/ipadair.jpg'),
        ('남성 캐주얼 티셔츠', 8, 25000.00, '유니클로', '편안한 남성용 캐주얼 티셔츠', 100, 'https://example.com/menshirt.jpg'),
        ('여성 원피스', 9, 45000.00, 'ZARA', '여성용 여름 원피스', 80, 'https://example.com/womendress.jpg'),
        ('아동용 운동화', 10, 35000.00, '나이키', '아동용 운동화 사이즈 200-230', 60, 'https://example.com/kidsshoes.jpg'),
        ('책상 세트', 11, 150000.00, '이케아', '책상과 의자가 포함된 세트', 20, 'https://example.com/deskset.jpg'),
        ('사무용 의자', 12, 80000.00, '허먼밀러', '인체공학적 사무용 의자', 35, 'https://example.com/officechair.jpg'),
        ('퀸사이즈 침대', 13, 300000.00, '시몬스', '퀸사이즈 침대 프레임', 15, 'https://example.com/queenbed.jpg'),
        ('신선한 사과 1kg', 14, 8000.00, '농협', '신선한 국내산 사과 1kg', 200, 'https://example.com/apples.jpg'),
        ('유기농 당근 500g', 15, 3000.00, '농협', '유기농 당근 500g', 150, 'https://example.com/carrots.jpg'),
        ('한우 등심 200g', 16, 25000.00, '농협', '프리미엄 한우 등심 200g', 50, 'https://example.com/beef.jpg');

        -- 상품 이미지 데이터
        INSERT INTO product_images (product_id, image_url, image_order, is_main) VALUES
        (1, 'https://example.com/iphone15pro_1.jpg', 1, true),
        (1, 'https://example.com/iphone15pro_2.jpg', 2, false),
        (1, 'https://example.com/iphone15pro_3.jpg', 3, false),
        (2, 'https://example.com/galaxys24_1.jpg', 1, true),
        (2, 'https://example.com/galaxys24_2.jpg', 2, false),
        (3, 'https://example.com/macbookpro_1.jpg', 1, true),
        (3, 'https://example.com/macbookpro_2.jpg', 2, false),
        (4, 'https://example.com/lggram_1.jpg', 1, true),
        (5, 'https://example.com/ipadair_1.jpg', 1, true),
        (6, 'https://example.com/menshirt_1.jpg', 1, true),
        (7, 'https://example.com/womendress_1.jpg', 1, true),
        (8, 'https://example.com/kidsshoes_1.jpg', 1, true),
        (9, 'https://example.com/deskset_1.jpg', 1, true),
        (10, 'https://example.com/officechair_1.jpg', 1, true),
        (11, 'https://example.com/queenbed_1.jpg', 1, true),
        (12, 'https://example.com/apples_1.jpg', 1, true),
        (13, 'https://example.com/carrots_1.jpg', 1, true),
        (14, 'https://example.com/beef_1.jpg', 1, true);

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

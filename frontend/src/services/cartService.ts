import { Product } from './productService';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  img: string;
}

class CartService {
  private getCartKey(userId?: number): string {
    return userId ? `shopping_cart_${userId}` : 'shopping_cart_guest';
  }

  // 장바구니에 상품 추가
  addToCart(product: Product, quantity: number = 1, userId?: number): void {
    const cart = this.getCart(userId);
    
    // 이미 장바구니에 있는 상품인지 확인
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // 기존 상품이 있으면 수량만 증가
      existingItem.quantity += quantity;
    } else {
      // 새 상품 추가
      const newItem: CartItem = {
        id: Math.floor(Math.random() * 1000000), // 더 작은 임시 ID 생성
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: quantity,
        img: product.img,
      };
      cart.push(newItem);
    }
    
    this.saveCart(cart, userId);
  }

  // 장바구니에서 상품 제거
  removeFromCart(productId: number, userId?: number): void {
    const cart = this.getCart(userId);
    const updatedCart = cart.filter(item => item.productId !== productId);
    this.saveCart(updatedCart, userId);
  }

  // 장바구니 상품 수량 변경
  updateQuantity(productId: number, quantity: number, userId?: number): void {
    const cart = this.getCart(userId);
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        // 수량이 0 이하면 상품 제거
        this.removeFromCart(productId, userId);
      } else {
        item.quantity = quantity;
        this.saveCart(cart, userId);
      }
    }
  }

  // 장바구니 조회
  getCart(userId?: number): CartItem[] {
    try {
      const cartKey = this.getCartKey(userId);
      const cartData = localStorage.getItem(cartKey);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('장바구니 데이터 파싱 오류:', error);
      return [];
    }
  }

  // 장바구니 저장
  private saveCart(cart: CartItem[], userId?: number): void {
    try {
      const cartKey = this.getCartKey(userId);
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error('장바구니 저장 오류:', error);
    }
  }

  // 장바구니 비우기
  clearCart(userId?: number): void {
    const cartKey = this.getCartKey(userId);
    localStorage.removeItem(cartKey);
  }

  // 장바구니 상품 개수
  getCartItemCount(userId?: number): number {
    const cart = this.getCart(userId);
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // 장바구니 총 금액
  getCartTotal(userId?: number): number {
    const cart = this.getCart(userId);
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export const cartService = new CartService();

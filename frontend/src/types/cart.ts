export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  sku: string;
  unit: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  isApplied: boolean;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
}
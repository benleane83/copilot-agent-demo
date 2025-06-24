import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

// Mock component to test cart functionality
function TestCartComponent() {
  const { addToCart, items, getTotalItems, getCartSummary, applyCoupon, coupon, clearCart } = useCart();

  return (
    <div>
      <button
        onClick={() => addToCart(1, 'Test Product', 10.99, 'test.png', 'TEST001', 'each', 2)}
        data-testid="add-to-cart"
      >
        Add to Cart
      </button>
      <button
        onClick={() => clearCart()}
        data-testid="clear-cart"
      >
        Clear Cart
      </button>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="cart-items">{items.length}</div>
      <div data-testid="total-price">{getCartSummary().grandTotal.toFixed(2)}</div>
      <input
        data-testid="coupon-input"
        onChange={(e) => {
          if (e.target.value === 'SAVE10') {
            applyCoupon('SAVE10');
          }
        }}
      />
      <div data-testid="coupon-applied">{coupon ? 'yes' : 'no'}</div>
    </div>
  );
}

describe('Cart Context', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should add items to cart', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const totalItems = screen.getByTestId('total-items');
    const cartItems = screen.getByTestId('cart-items');

    expect(totalItems.textContent).toBe('0');
    expect(cartItems.textContent).toBe('0');

    fireEvent.click(addButton);

    expect(totalItems.textContent).toBe('2');
    expect(cartItems.textContent).toBe('1');
  });

  it('should calculate total price correctly', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const totalPrice = screen.getByTestId('total-price');

    fireEvent.click(addButton);

    // 2 items * $10.99 + $10 shipping = $31.98
    expect(totalPrice.textContent).toBe('31.98');
  });

  it('should apply coupon correctly', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const couponInput = screen.getByTestId('coupon-input');
    const couponApplied = screen.getByTestId('coupon-applied');
    const totalPrice = screen.getByTestId('total-price');

    fireEvent.click(addButton);
    expect(couponApplied.textContent).toBe('no');

    fireEvent.change(couponInput, { target: { value: 'SAVE10' } });
    expect(couponApplied.textContent).toBe('yes');

    // 2 * $10.99 = $21.98, 10% discount = $2.20, shipping = $10, total = $29.78
    expect(totalPrice.textContent).toBe('29.78');
  });
});
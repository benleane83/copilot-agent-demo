import { useCart } from '../../context/CartContext';

export default function CartSummary() {
  const { items, getTotalPrice, discount, couponCode } = useCart();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const total = getTotalPrice();

  // Simple shipping calculation
  const shipping = subtotal > 100 ? 0 : 9.99;
  const finalTotal = total + shipping;

  return (
    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex justify-between text-gray-300">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-green-400">
          <span>Discount ({couponCode}):</span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}

      {/* Shipping */}
      <div className="flex justify-between text-gray-300">
        <span>Shipping:</span>
        <span>
          {shipping === 0 ? (
            <span className="text-green-400">FREE</span>
          ) : (
            `$${shipping.toFixed(2)}`
          )}
        </span>
      </div>

      {/* Free shipping message */}
      {subtotal < 100 && subtotal > 0 && (
        <div className="text-sm text-blue-400">
          Add ${(100 - subtotal).toFixed(2)} more for free shipping!
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-600" />

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold text-light">
        <span>Total:</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
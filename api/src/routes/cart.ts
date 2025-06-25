/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing shopping cart
 */

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */

import express from 'express';
import { Cart, CartItem } from '../models/cart';
import { Coupon } from '../models/coupon';
import { products as seedProducts } from '../seedData';

const router = express.Router();

// In-memory storage for carts and coupons
let carts: Cart[] = [];
let cartIdCounter = 1;

// Sample coupons for testing
const coupons: Coupon[] = [
  {
    couponId: 1,
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 50,
    isActive: true,
    description: '10% off orders over $50'
  },
  {
    couponId: 2,
    code: 'WELCOME5',
    discountType: 'fixed',
    discountValue: 5,
    isActive: true,
    description: '$5 off your order'
  },
  {
    couponId: 3,
    code: 'BIGDEAL',
    discountType: 'percentage',
    discountValue: 25,
    minimumOrder: 200,
    isActive: true,
    description: '25% off orders over $200'
  }
];

// Helper function to find or create cart for user
const findOrCreateCart = (userId: string): Cart => {
  let cart = carts.find(c => c.userId === userId);
  if (!cart) {
    cart = {
      cartId: cartIdCounter++,
      userId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    carts.push(cart);
  }
  return cart;
};

// Helper function to calculate cart totals
const calculateCartTotals = (cart: Cart) => {
  const subtotal = cart.items.reduce((total, item) => {
    const product = seedProducts.find(p => p.productId === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  let discount = 0;
  if (cart.couponCode) {
    const coupon = coupons.find(c => c.code === cart.couponCode && c.isActive);
    if (coupon) {
      if (!coupon.minimumOrder || subtotal >= coupon.minimumOrder) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
      }
    }
  }

  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0; // Free shipping over $100
  const total = subtotal - discount + shipping;

  return { subtotal, discount, shipping, total };
};

// Get user's cart
router.get('/:userId', (req, res) => {
  const cart = findOrCreateCart(req.params.userId);
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Add item to cart
// @ts-ignore - Express TypeScript compatibility issue
router.post('/:userId', (req, res) => {
  const cart = findOrCreateCart(req.params.userId);
  const { productId, quantity }: CartItem = req.body;

  // Validate product exists
  const product = seedProducts.find(p => p.productId === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Find existing item or add new one
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  if (existingItemIndex >= 0) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  cart.updatedAt = new Date();
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Update item quantity (using query parameter)
// @ts-ignore - Express TypeScript compatibility issue
router.put('/:userId', (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { productId, quantity } = req.body;

  const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.updatedAt = new Date();
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Remove item from cart (using query parameter)
// @ts-ignore - Express TypeScript compatibility issue
router.delete('/:userId', (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { productId } = req.query;
  const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId as string));
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  cart.items.splice(itemIndex, 1);
  cart.updatedAt = new Date();
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Apply coupon (using body)
// @ts-ignore - Express TypeScript compatibility issue
router.post('/:userId/coupon', (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const { couponCode } = req.body;
  const coupon = coupons.find(c => c.code === couponCode && c.isActive);
  
  if (!coupon) {
    return res.status(400).json({ error: 'Invalid coupon code' });
  }

  const subtotal = cart.items.reduce((total, item) => {
    const product = seedProducts.find(p => p.productId === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
    return res.status(400).json({ 
      error: `Minimum order value of $${coupon.minimumOrder} required for this coupon` 
    });
  }

  cart.couponCode = couponCode;
  cart.updatedAt = new Date();
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Remove coupon
// @ts-ignore - Express TypeScript compatibility issue
router.delete('/:userId/coupon', (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  delete cart.couponCode;
  delete cart.discount;
  cart.updatedAt = new Date();
  const totals = calculateCartTotals(cart);
  res.json({ ...cart, ...totals });
});

// Get available coupons (for testing/demo purposes)
router.get('/:userId/coupons', (req, res) => {
  res.json(coupons.filter(c => c.isActive));
});

export default router;
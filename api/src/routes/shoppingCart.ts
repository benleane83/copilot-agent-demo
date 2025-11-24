/**
 * @swagger
 * tags:
 *   name: ShoppingCart
 *   description: API endpoints for managing shopping carts
 */

/**
 * @swagger
 * /api/cart/{cartId}:
 *   get:
 *     summary: Get a shopping cart by ID
 *     tags: [ShoppingCart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shopping cart ID
 *     responses:
 *       200:
 *         description: Shopping cart found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       404:
 *         description: Shopping cart not found
 *   delete:
 *     summary: Empty a shopping cart
 *     tags: [ShoppingCart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shopping cart ID
 *     responses:
 *       200:
 *         description: Shopping cart emptied successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *
 * /api/cart/{cartId}/items:
 *   post:
 *     summary: Add a product to the shopping cart
 *     tags: [ShoppingCart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shopping cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *
 * /api/cart/{cartId}/items/{productId}:
 *   put:
 *     summary: Update product quantity in the shopping cart
 *     tags: [ShoppingCart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shopping cart ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       404:
 *         description: Product not found in cart
 *   delete:
 *     summary: Remove a product from the shopping cart
 *     tags: [ShoppingCart]
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shopping cart ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       404:
 *         description: Product not found in cart
 */

import express from 'express';
import { ShoppingCart } from '../models/shoppingCart';
import { ShoppingCartItem } from '../models/shoppingCartItem';
import { products as seedProducts } from '../seedData';

const router = express.Router();

// In-memory storage for shopping carts
let carts: Map<string, ShoppingCart> = new Map();

// Helper function to calculate total amount
const calculateTotal = (items: ShoppingCartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get or create a cart
const getOrCreateCart = (cartId: string): ShoppingCart => {
  if (!carts.has(cartId)) {
    carts.set(cartId, {
      cartId,
      items: [],
      totalAmount: 0
    });
  }
  return carts.get(cartId)!;
};

// Get a shopping cart by ID
router.get('/:cartId', (req, res) => {
  const cart = getOrCreateCart(req.params.cartId);
  res.json(cart);
});

// Add a product to the shopping cart
router.post('/:cartId/items', (req, res) => {
  const cart = getOrCreateCart(req.params.cartId);
  const { productId, quantity } = req.body;
  
  // Find the product to get its price
  const product = seedProducts.find(p => p.productId === productId);
  if (product) {
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }
    
    // Recalculate total
    cart.totalAmount = calculateTotal(cart.items);
    
    res.json(cart);
  } else {
    res.status(404).send('Product not found');
  }
});

// Update product quantity in the shopping cart
router.put('/:cartId/items/:productId', (req, res) => {
  const cart = getOrCreateCart(req.params.cartId);
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;
  
  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate total
    cart.totalAmount = calculateTotal(cart.items);
    
    res.json(cart);
  } else {
    res.status(404).send('Product not found in cart');
  }
});

// Remove a product from the shopping cart
router.delete('/:cartId/items/:productId', (req, res) => {
  const cart = getOrCreateCart(req.params.cartId);
  const productId = parseInt(req.params.productId);
  
  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex !== -1) {
    cart.items.splice(itemIndex, 1);
    
    // Recalculate total
    cart.totalAmount = calculateTotal(cart.items);
    
    res.json(cart);
  } else {
    res.status(404).send('Product not found in cart');
  }
});

// Empty a shopping cart
router.delete('/:cartId', (req, res) => {
  const cart = getOrCreateCart(req.params.cartId);
  cart.items = [];
  cart.totalAmount = 0;
  res.json(cart);
});

// Export function to reset carts for testing
export const resetCarts = () => {
  carts = new Map();
};

export default router;

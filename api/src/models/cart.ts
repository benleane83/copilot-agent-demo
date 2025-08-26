/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - unitPrice
 *       properties:
 *         productId:
 *           type: integer
 *           description: The unique identifier for the product
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: The quantity of the product in the cart
 *         unitPrice:
 *           type: number
 *           format: float
 *           description: The unit price of the product at the time it was added to cart
 *         subtotal:
 *           type: number
 *           format: float
 *           description: The subtotal for this cart item (quantity * unitPrice)
 *     Cart:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *           description: Array of items in the cart
 *         subtotal:
 *           type: number
 *           format: float
 *           description: The subtotal of all items in the cart
 *         total:
 *           type: number
 *           format: float
 *           description: The total amount including any taxes or fees
 *         itemCount:
 *           type: integer
 *           description: Total number of items in the cart
 */

export interface CartItem {
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    total: number;
    itemCount: number;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: The ID of the product in the cart
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the cart
 *           minimum: 1
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *       properties:
 *         cartId:
 *           type: integer
 *           description: The unique identifier for the cart
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the cart
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *           description: The items in the cart
 *         couponCode:
 *           type: string
 *           description: Applied coupon code
 *         discount:
 *           type: number
 *           format: float
 *           description: Discount amount from coupon
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the cart was last updated
 */

export interface CartItem {
    productId: number;
    quantity: number;
}

export interface Cart {
    cartId: number;
    userId: string;
    items: CartItem[];
    couponCode?: string;
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
}
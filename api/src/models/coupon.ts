/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       required:
 *         - code
 *         - discountType
 *         - discountValue
 *       properties:
 *         couponId:
 *           type: integer
 *           description: The unique identifier for the coupon
 *         code:
 *           type: string
 *           description: The coupon code
 *         discountType:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Type of discount (percentage or fixed amount)
 *         discountValue:
 *           type: number
 *           format: float
 *           description: The discount value (percentage or fixed amount)
 *         minimumOrder:
 *           type: number
 *           format: float
 *           description: Minimum order value required to use this coupon
 *         isActive:
 *           type: boolean
 *           description: Whether the coupon is active
 *         description:
 *           type: string
 *           description: Description of the coupon
 */

export interface Coupon {
    couponId: number;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minimumOrder?: number;
    isActive: boolean;
    description?: string;
}
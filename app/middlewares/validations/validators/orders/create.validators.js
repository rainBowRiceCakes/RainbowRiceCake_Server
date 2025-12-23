/**
 * @file app/middlewares/validations/validators/orders/create.validation.js
 * @description orders 등록 정보 검사 핸들러
 * 251223 v1.0.0 BSONG init
 */

import order from '../../fields/order.field.js';

export default [
  order.email,
  order.name,
]

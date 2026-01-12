/**
 * @file app/middlewares/validations/validators/partner.create.validator.js
 * @description 매장 정보검사 핸들러
 * 251224 v1.0.0 wook init
 */

import partner from "../../fields/partner.field.js";

export default [
  partner.businessNum,
  partner.krName,
  partner.enName,
  partner.manager,
  partner.phone,
  partner.status,
  partner.address,
  partner.lat,
  partner.lng,
];
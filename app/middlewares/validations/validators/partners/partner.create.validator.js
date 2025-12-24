/**
 * @file app/middlewares/validations/validators/partner.create.validator.js
 * @description 매장 정보검사 핸들러
 * 251224 v1.0.0 wook init
 */

import partnerField from "../../fields/partner.field.js";

export default [
  partnerField.address,
  partnerField.businessNum,
  partnerField.enName,
  partnerField.krName,
  partnerField.logoImg,
  partnerField.manager,
  partnerField.phone,
  partnerField.userId,
  partnerField.lat,
  partnerField.lng,
]
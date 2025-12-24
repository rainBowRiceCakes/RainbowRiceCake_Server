/**
 * @file app/middlewares/validations/validators/partner.form.validator.js
 * @description 매장 form 정보 검사 핸들러
 * 251224 v1.0.0 jun init
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
]
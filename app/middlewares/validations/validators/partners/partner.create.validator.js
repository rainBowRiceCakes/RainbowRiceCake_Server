/**
 * @file app/middlewares/validations/validators/create.validator.js
 * @description 파트너 정보검사 핸들러
 * 251229 v1.0.0 jun init
 */

import partner from '../../fields/partner.field.js'

export default [
  partner.manager,
  partner.phone,
  partner.krName,
  partner.enName,
  partner.businessNum,
  partner.address,
  partner.logoImg,
  partner.lat,
  partner.lng
];
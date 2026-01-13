/**
 * @file app/middlewares/validations/validators/riders/rider.update.validator.js
 * @description 라이더 정보검사 핸들러
 * 251223 v1.0.0 wook init
 * 251229 v1.1.0 BSONG update add what the rider can update on their profile
 */

import rider from '../../fields/rider.field.js'

export default [
  rider.address,
  rider.phone,
]

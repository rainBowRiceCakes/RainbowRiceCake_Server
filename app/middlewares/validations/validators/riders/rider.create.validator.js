/**
 * @file app/middlewares/validations/validators/create.validator.js
 * @description 라이더 정보검사 핸들러
 * 251223 v1.0.0 wook init
 */

import rider from '../../fields/rider.field.js'

export default [ rider.address, rider.bank, rider.bankNum, rider.licenseImg, rider.phone, rider.lat, rider.lng ]
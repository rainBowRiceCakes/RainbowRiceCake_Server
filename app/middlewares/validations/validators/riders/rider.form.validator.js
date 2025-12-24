/**
 * @file app/middlewares/validations/validators/rider.form.validator.js
 * @description 라이더 제휴 폼 정보 검사 핸들러
 * 251224 v1.0.0 jun init
 */

import rider from '../../fields/rider.field.js'

export default [ rider.address, rider.bank, rider.bankNum, rider.licenseImg, rider.phone ]
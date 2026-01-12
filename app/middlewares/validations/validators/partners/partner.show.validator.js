/**
 * @file app/middlewares/validations/validators/show.notice.validator.js
 * @description 어드민이 확인하는 partner 검사 핸들러
 * 251226 v1.0.0 BSONG init
 */

import partner from '../../fields/partner.field.js';

export default [ 
    partner.partnerId
];
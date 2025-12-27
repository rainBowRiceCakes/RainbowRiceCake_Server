/**
 * @file app/middlewares/validations/validators/partner.update.validator.js
 * @description 파트너 본인의 정보 수정 시, 검사 핸들러
 * 251226 v1.0.0 BSONG init
 */

import partner from '../../fields/partner.field.js';

export default [ 
    partner.businessNum,
    partner.krName,
    partner.enName,
    partner.manager,
    partner.phone,
    partner.logoImg,
    partner.address,
    partner.lat,
    partner.lng
];
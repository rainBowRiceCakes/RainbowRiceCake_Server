/**
 * @file app/middlewares/validations/validators/send.validator.js
 * @description 공지발송 검사 핸들러
 * 251223 v1.0.0 wook init
 */

import { content, targetRole, title } from '../../fields/notice.field.js';

export default [ content, targetRole, title ];
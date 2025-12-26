/**
 * @file app/middlewares/validations/validaors/auth/login.validator.js
 * @description 로그인용 유효성 체크
 * 251223 v1.0.0 wook init
 */

import userField from "../../fields/user.field.js";

export default [ userField.email ];
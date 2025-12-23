/**
 * @file app/middlewares/validations/validators/create.validator.js
 * @description 호텔등록 정보 검사 핸들러
 * 251222 v1.0.0 wook init
 */

import hotel from '../../fields/hotel.field.js';

export default [
  hotel.address,
  hotel.hotelEnName,
  hotel.hotelKrName,
  hotel.lat,
  hotel.lng,
  hotel.manager,
  hotel.phone,
]

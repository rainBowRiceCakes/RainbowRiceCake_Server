/**
 * @file routes/hotel.router.js
 * @description 호텔 관련 라우터
 * 251222 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import hotelsController from '../app/controllers/hotels.controller.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import createValidator from '../app/middlewares/validations/validators/hotels/create.validator.js';
import findPKValidator from '../app/middlewares/validations/validators/hotels/findPK.validator.js';

const hotelRouter = express.Router();

// Hotel table에 id값으로 정보 가져오기
hotelRouter.get('/:id', authMiddleware, findPKValidator, validationHandler, hotelsController.hotelFindByPK)
// Hotel table에 있는 정보 모두 가져오기
hotelRouter.get('/', authMiddleware, hotelsController.hotelShow)
// Hotel table에 정보 등록하기 ※ JWT로 유저id(PK)를 받아와야 함. req.user.id
hotelRouter.post('/', authMiddleware, createValidator, validationHandler, hotelsController.hotelCreate)

export default hotelRouter;
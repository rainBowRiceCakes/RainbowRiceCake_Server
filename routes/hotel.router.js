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

hotelRouter.get('/:id',
  /* #swagger.tags = ['Hotels']
  #swagger.summary = '어드민용 호텔 정보 조회'
  #swagger.description = '어드민이 호텔 정보를 조회합니다.' */
  authMiddleware,
  findPKValidator,
  validationHandler,
  hotelsController.hotelFindByPK)

hotelRouter.get('/',
  /* #swagger.tags = ['Hotels']
  #swagger.summary = '어드민용 호텔들 LIST 조회'
  #swagger.description = '어드민이 호텔들을 조회합니다.' */
  authMiddleware,
  hotelsController.hotelShow)

hotelRouter.post('/',
  /* #swagger.tags = ['Hotels']
  #swagger.summary = '어드민용 호텔 등록'
  #swagger.description = '어드민이 호텔을 등록합니다.' */
  authMiddleware,
  createValidator,
  validationHandler,
  hotelsController.hotelCreate)

export default hotelRouter;
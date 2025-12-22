/**
 * @file routes/hotel.router.js
 * @description 호텔 관련 라우터
 * 251222 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import hotelsController from '../app/controllers/hotels.controller.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import createValidation from '../app/middlewares/validations/validators/hotels/create.validation.js';

const hotelRouter = express.Router();

hotelRouter.get('/', authMiddleware, hotelsController.hotelShow)
hotelRouter.post('/', authMiddleware, createValidation, validationHandler, hotelsController.hotelCreate)

export default hotelRouter;
/**
 * @file routes/admin.router.js
 * @description 어드민 관련 라우터
 * 251223 v1.0.0 wook init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import adminsController from '../app/controllers/admins.controller.js';
import riderCreateValidator from '../app/middlewares/validations/validators/riders/rider.create.validator.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import partnerCreateValidator from '../app/middlewares/validations/validators/partners/partner.create.validator.js';

const adminRouter = express.Router();

adminRouter.put('/rider', authMiddleware, riderCreateValidator, validationHandler , adminsController.riderUpdate)
adminRouter.post('/partner', authMiddleware, partnerCreateValidator, validationHandler , adminsController.partnerUpdate)

export default adminRouter;
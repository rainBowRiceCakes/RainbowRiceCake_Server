/**
 * @file routes/question.router.js
 * @description 질의응답 관련 라우터
 * 251223 v1.0.0 BSONG init
 */

import express from 'express';
import authMiddleware from '../app/middlewares/auth/auth.middleware.js';
import questionsController from '../app/controllers/questions.controller.js';
import validationHandler from '../app/middlewares/validations/validationHandler.js';
import createValidation from '../app/middlewares/validations/validators/questions/create.validator.js';
import indexValidator from '../app/middlewares/validations/validators/questions/index.validator.js';
import showValidator from '../app/middlewares/validations/validators/questions/show.validator.js';

const questionRouter = express.Router();

questionRouter.get('/', authMiddleware, indexValidator, validationHandler, questionsController.index);
questionRouter.get('/:id', authMiddleware, showValidator, validationHandler, questionsController.show);
questionRouter.post('/', authMiddleware, createValidation, validationHandler, questionsController.store);

export default questionRouter;

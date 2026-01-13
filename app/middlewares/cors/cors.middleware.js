/**
 * @file app/middlewares/cors/cors.middleware.js
 * @description cors Middleware
 * 260112 pbj init
 */

import cors from 'cors';
import customError from '../../errors/custom.error.js';
import { CORS_ERROR } from '../../../configs/responseCode.config.js';

const allowedOrigins = [
  'https://app2.green-meerkat.kro.kr',
  'https://app3.green-meerkat.kro.kr',
];

export default cors({
  origin: function (origin, callback) {
    // origin이 없거나(ex. Postman || ServerToServe), 허용된 목록에 있으면
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.APP_MODE === 'dev') {
      callback(null, true); // 허용
    } else {
      callback(customError('Not allowed by CORS', CORS_ERROR)); // 거부
    }
  },
 credentials: true,
});
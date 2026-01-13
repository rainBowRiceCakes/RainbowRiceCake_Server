/**
 * @file app.js
 * @description Entry Point
 * 251210 v1.0.0 wook 최초 생성
 */

import express from 'express';
import './configs/env.config.js';
import cookieParser from 'cookie-parser';
import errorHandler from './app/errors/errorHandler.js';
import notFoundRouter from './routes/notFound.router.js';
import authRouter from './routes/auth.router.js';
import hotelRouter from './routes/hotel.router.js';
import noticeRouter from './routes/notice.router.js';
import riderRouter from './routes/rider.router.js';
import partnerRouter from './routes/partner.router.js';
import adminRouter from './routes/admin.router.js';
import questionRouter from './routes/question.router.js';
import userRouter from './routes/user.router.js';
import orderRouter from './routes/order.router.js';
import fileRouter from './routes/file.router.js';
import profileRouter from './routes/profile.router.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import settlementRouter from './routes/settlement.router.js';
import { initInvoiceScheduler } from './app/schedulers/invoice.schedule.js';
import invoiceRouter from './routes/invoice.router.js';
import { initSettlementScheduler } from './app/schedulers/settlementScheduler.js';
import { initTransferScheduler } from './app/schedulers/transferScheduler.js';
import pathUtil from './app/utils/path/path.util.js';
import { initAutoPayScheduler } from './app/schedulers/autoPay.scheduler.js';
import corsMiddleware from './app/middlewares/cors/cors.middleware.js';

const app = express();
app.use(corsMiddleware);
app.use(express.json()); // JSON 요청 파싱 처리
app.use(cookieParser()); // 쿠키파서

const swaggerFile = JSON.parse(
  fs.readFileSync('./swagger_output.json', 'utf-8')
);

// ---------------------
// Swagger UI
// ---------------------
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
// ---------------------
// 라우터 정의
// ---------------------
app.use('/api/auth', authRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/riders', riderRouter);
app.use('/api/partners', partnerRouter);
app.use('/api/admins', adminRouter);
app.use('/api/questions', questionRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/files', fileRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/settlements', settlementRouter);
app.use('/api/invoices', invoiceRouter);

// ---------------------
// 사진 프론트에 보여주는 처리
app.use('/storage', express.static('storage'));
app.use(process.env.ACCESS_FILE_QUESTION_IMAGE_PATH, express.static(pathUtil.getQuestionsImagePath()));
app.use(process.env.ACCESS_FILE_RIDER_LICENSE_IMAGE_PATH, express.static(pathUtil.getLicensesImagePath()));

// "/files/logos" 로 들어오는 요청은 실제 "storage/images/logos" 폴더의 파일을 보여준다.
app.use(process.env.ACCESS_FILE_PARTNER_LOGO_IMAGE_PATH, express.static(process.env.FILE_PARTNER_LOGO_IMAGE_PATH));

// ---------------------
// 404 처리
// ---------------------
app.use(notFoundRouter);

// ---------------------
// 뷰 반환 처리
// ---------------------
// 퍼블릭 정적파일 제공 활성화
// app.use('/', express.static(process.env.APP_DIST_PATH));
// // React 뷰 반환
// app.get(/^(?!\/files\/.*).*/, (req, res) => {
//   return res.sendFile(pathUtil.getViewDirPath());
// })

// ---------------------
// 에러 핸들러 등록
// ---------------------
app.use(errorHandler);

// ---------------------
// 해당 Port로 express 실행
// ---------------------
initAutoPayScheduler();
initInvoiceScheduler();
initSettlementScheduler();
initTransferScheduler();   // ★ 송금 기능 실행
const PORT = Number(process.env.APP_PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

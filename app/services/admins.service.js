/**
 * @file app/serivces/admins.service.js
 * @description admins Service
 * 251223 wook init
 */

import db from "../models/index.js";
import adminRepository from "../repositories/admin.repository.js";
import hotelRepository from "../repositories/hotel.repository.js";
import noticeRepository from "../repositories/notice.repository.js";
import orderRepository from "../repositories/order.repository.js";
import partnerRepository from "../repositories/partner.repository.js";
import questionRepository from "../repositories/question.repository.js";
import riderRepository from "../repositories/rider.repository.js";
import userRepository from "../repositories/user.repository.js";
import { startOfDay, endOfDay, subDays, format, differenceInMinutes } from 'date-fns';

/**
 * admin이 rider테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderUpdate(data) {
  await db.sequelize.transaction(async t => {
    // riderPK로 레코드 하나 가져오기
    const result = await riderRepository.findByPk(t, data.id);
    // 가져온 레코드에 수정값(data)집어넣기
    result.status = data.status
    result.bank = data.bank
    result.bankNum = data.bankNum
    result.address = data.address
    result.phone = data.phone
    result.isWorking = data.isWorking
    result.licenseImg = data.licenseImg
    // 레코드 하나만 save처리
    await adminRepository.riderUpdate(t, result);

    // rider의 user_id로 userByPK받아오기
    const userData = await userRepository.riderToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    userData.name = data.rider_user.name
    if(data.status === "RES") {
      // 상태가 RES(승인)로 바뀌면 user권한 DLV로 변경
      userData.role = "DLV"
      // 상태가 REQ(대기), REJ(반려)로 바뀌면 user권한 COM으로 변경
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderDelete(id) {  
  await riderRepository.riderDelete(null, id);
  return
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function userDelete(id) {  
  await db.sequelize.transaction(async t => {
    // rider정보 삭제
    const riderInfo = await riderRepository.findByUserId(t, id)
    if(riderInfo) {
      await riderRepository.riderDeleteUser(t, id)
    }

    // partner정보 삭제
    const partnerInfo = await partnerRepository.findByUserId(t, id)
    if(partnerInfo) {
      await partnerRepository.partnerDeleteUser(t, id)
    }

    await userRepository.userDelete(t, id);
    return
  })
}

/**
 * admin이 partner테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await partnerRepository.findByPk(t, data.id);
    // 가져온 레코드에 수정값(data)집어넣기
    result.businessNum = data.businessNum
    result.krName = data.krName
    result.enName = data.enName
    result.manager = data.manager
    result.address= data.address
    result.status= data.status
    result.phone= data.phone
    result.logoImg= data.logoImg
    result.lat= data.lat
    result.lng= data.lng
    // 레코드 하나만 save처리
    await adminRepository.partnerUpdate(t, result);

    // partner의 user_id로 userByPK받아오기
    const userData = await userRepository.partnerToUserPK(t, data.userId)
    // user의 role바뀌는 처리 추가
    if(data.status === "RES") {
      // 상태가 RES(승인)로 바뀌면 user권한 DLV로 변경
      userData.role = "PTN"
      // 상태가 REQ(대기), REJ(반려)로 바뀌면 user권한 COM으로 변경
    } else userData.role = "COM"
    await userRepository.save(t, userData)
    return
  })
}

/**
 * admin이 hotel테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await hotelRepository.findByPk(t, data.id);
    // 가져온 레코드에 수정값(data)집어넣기
    result.krName = data.krName
    result.enName = data.enName
    result.manager = data.manager
    result.address= data.address
    result.status= data.status
    result.phone= data.phone
    result.lat= data.lat
    result.lng= data.lng
    // 레코드 하나만 save처리
    await adminRepository.hotelUpdate(t, result);
    
    return
  })
}

/**
 * admin이 hotel테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getOrderDetail(orderCode) {
    // partnerPK로 레코드 하나 가져오기
    return await orderRepository.findByOrderCodeWithDetails(null, orderCode);
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function createNewOrder(data) {
  return await adminRepository.orderCreate(null, data);
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function orderUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await orderRepository.findByOrderCodeWithDetails(t, data.orderCode);
    result.name = data.name
    result.email = data.email
    result.cntS = data.cntS
    result.cntM = data.cntM
    result.cntL = data.cntL
    result.status = data.status
    result.price = data.price
    result.hotelId = data.hotelId
    
    await adminRepository.orderUpdate(t, result);
    
    return
  })
}

/**
 * admin이 notice테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await noticeRepository.findByPk(t, data.id);
    result.title = data.title
    result.content = data.content
    result.targetRole = data.targetRole
    result.status = data.status
    
    await adminRepository.save(t, result);
    
    return
  })
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeDelete(id) {  
  await noticeRepository.noticeDelete(null, id);
  return
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function orderDelete(id) {  
  await orderRepository.orderDelete(null, id);
  return
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelDelete(id) {  
  await hotelRepository.hotelDelete(null, id);
  return
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerDelete(id) {  
  await partnerRepository.partnerDelete(null, id);
  return
}

/**
 * admin이 partner테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
*/
async function partnerCreate(data) {
  await partnerRepository.create(null, data);
  return
}

/**
 * admin이 notice테이블에 강제로 정보 삭제하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function qnaDelete(id) {  
  await questionRepository.qnaDelete(null, id);
  return
}

/**
 * admin이 qna테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function qnaUpdate(data) {
  await db.sequelize.transaction(async t => {
    // partnerPK로 레코드 하나 가져오기
    const result = await questionRepository.findByPk(t, data.id);
    result.res = data.res
    result.status = data.status

    await adminRepository.save(t, result);
    
    return
  })
}

/**
 * admin 대시보드 데이터 통합 조회(차트 + 요약 + 긴급 주문 현황)
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
// -----------------------[Chart]-----------------------
async function getDashboardStats() {
  const today = new Date();

  // 오늘 날짜 범위 계산 (00:00:00 ~ 23:59:59)
  const dateRange = {
    start: startOfDay(today),
    end: endOfDay(today)
  };

  // 최근 n일 통계 가져오기
  const chartData = await orderRepository.getDailyOrderCounts(7);

  // [데이터 가공] 빈 날짜 채우기 + 배열 분리 작업
  const labels = [];
  const counts = [];

  // 최근 10일 날짜 생성 (예: 2025-12-27 ~ 2026-01-05)
  for (let i = 6; i >= 0; i--) {
    const targetDate = subDays(today, i);
    const dateString = format(targetDate, 'yyyy-MM-dd');
    
    // DB 데이터에서 해당 날짜가 있는지 찾기
    const found = chartData.find(item => item.date === dateString);
    
    // 결과 배열에 넣기
    labels.push(dateString);       // X축 라벨
    counts.push(found ? found.count : 0); // 데이터가 없으면 0으로 채움
  }

  // -----------------------[Summary]-----------------------
  // [Summary] 오늘의 요약 데이터 가져오기
  const summaryData = await orderRepository.getDashboardSummary(null, dateRange);

  // -----------------------[Urgent]-----------------------
  // 긴급 주문 데이터 가져오기 (Repo 호출)
  const urgentOrdersRaw = await orderRepository.findUrgentOrders();

  // [가공] 프론트엔드에 보여줄 형태로 변환 (지연 시간 계산)
  const now = new Date();

  const urgentOrders = urgentOrdersRaw.map(order => {
    // 지연 시간 계산 (분 단위)
    const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
    const diffMinutes = differenceInMinutes(now, orderDate);
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;

    return {
      id: order.id,
      // 주문번호 매핑
      orderCode: order.orderCode || 0,
      
      // 출발, 도착지
      partnerName: order.order_partner?.krName || '업체미정',
      hotelName: order.order_hotel?.krName || '호텔미정',

      // 상태값 매핑
      status: order.status || 'req',
      // 지연 시간 포맷팅 (예: "02:15" 또는 "2시간 15분")
      delayTime: `${hours}시간 ${mins}분` 
    };
  });

  // 데이터 병합 후 리턴
  return {
    recentDeliveryChart: { labels, counts }, // 차트 데이터
    summary: summaryData,                    // 상단 요약 데이터
    urgentOrders: urgentOrders               // 긴급 주문 현황 추가
  };
}

export default {
  riderUpdate,
  riderDelete,
  userDelete,
  partnerUpdate,
  hotelUpdate,
  getOrderDetail,
  createNewOrder,
  orderUpdate,
  noticeUpdate,
  noticeDelete,
  orderDelete,
  hotelDelete,
  partnerDelete,
  partnerCreate,
  qnaDelete,
  qnaUpdate,
  getDashboardStats,
}
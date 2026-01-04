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
import { format, subDays } from 'date-fns';

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
async function getOrderDetail(id) {
    // partnerPK로 레코드 하나 가져오기
    return await orderRepository.findByPkWithDetails(null, id);
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
    const result = await orderRepository.findByPk(t, data.id);
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
 * 최근 배송 통계 (일별 건수 집계 + 0건 채우기)
 */
async function getRecentDeliveryStats() {
  const daysToCheck = 10;
  // Repository에서 일별 카운트 가져옴 (쿼리 결과: [{date: '2024-01-01', count: 5}, ...])
  const dbData = await orderRepository.getDailyOrderCounts(daysToCheck);
  
  const dataMap = {};
  dbData.forEach(item => {
    dataMap[item.date] = item.count;
  });

  const labels = [];
  const counts = [];
  
  // 오늘부터 과거 daysToCheck일까지 역순 or 정순 루프
  for (let i = daysToCheck - 1; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const labelStr = format(d, 'M/d');

    labels.push(labelStr);
    counts.push(parseInt(dataMap[dateStr] || 0)); // 데이터 없으면 0
  }

  return { labels, counts };
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
  getRecentDeliveryStats,
}
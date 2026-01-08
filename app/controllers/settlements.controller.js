/**
 * @file app/controllers/settlements.controller.js
 * @description 유저 관련 컨트롤러
 * 260102 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import settlementsService from "../services/settlements.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 이번 달 총 거래액
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function monthTotalAmount(req, res, next) {
  try {
    const { year, month } = req.query;
    const result = await settlementsService.monthTotalAmount({ year, month });
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    return next(error)
  }
}

/**
 * 정산내역 상세 조회
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function settlementShow(req, res, next) {
    try {
        const { year, month } = req.query; // year와 month를 쿼리 파라미터로 받음

        // settlementsService.settlementShow 함수를 year, month 파라미터로 호출하여 해당 월의 모든 데이터를 조회
        const allSettlements = await settlementsService.settlementShow({ year, month });

        const result = {
            settlements: allSettlements, // 전체 정산 내역
            // 클라이언트에서 페이지네이션을 처리할 것이므로, 서버에서는 pagination 정보를 보내지 않음
        }

        return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
    } catch (error) {
        return next(error)
    }
}

/**
 * 특정 월의 통계 데이터 조회
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getStatistics(req, res, next) {
    try {
        const { year, month } = req.query;
        const result = await settlementsService.getStatistics({ year, month });
        return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
    } catch (error) {
        return next(error);
    }
}

/**
 * 최근 3개월 매출 합계 조회
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getLastThreeMonthsTotalAmount(req, res, next) {
    try {
        const result = await settlementsService.lastThreeMonthsTotalAmount();
        return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
    } catch (error) {
        return next(error);
    }
}

/**
 * 특정 정산내역 상세 조회
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function getSettlementDetail(req, res, next) {
  try {
    const { id } = req.params;
    const result = await settlementsService.getSettlementDetail({ id });
    if (!result) {
      return res.status(404).send(createBaseResponse({ code: 'NOT_FOUND', message: '정산 내역을 찾을 수 없습니다.' }, null));
    }
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * 거부된 정산내역 재시도
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function retrySettlement(req, res, next) {
  try {
    const { id } = req.params;
    const { bankAccount, bankCode, memo } = req.body; // 모달에서 전달받을 수정된 정보 및 메모
    
    // 서비스 계층으로 재시도 로직 위임
    const result = await settlementsService.retrySettlement({ id, bankAccount, bankCode, memo });
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export default {
  monthTotalAmount,
  settlementShow,
  getStatistics,
  getLastThreeMonthsTotalAmount,
  getSettlementDetail, // 새로 추가
  retrySettlement, // 새로 추가
}
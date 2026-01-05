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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const { status, search } = req.query;

        const { count, rows } = await settlementsService.settlementShow({ page, limit, status, search });

        const totalPages = Math.ceil(count / limit);

        const result = {
            settlements: rows,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
            }
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

export default {
  monthTotalAmount,
  settlementShow,
  getStatistics,
}
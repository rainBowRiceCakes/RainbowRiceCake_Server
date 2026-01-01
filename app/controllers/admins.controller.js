/**
 * @file app/controllers/admins.controller.js
 * @description 어드민 관련 컨트롤러
 * 251223 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import adminsService from "../services/admins.service.js";
import ordersService from "../services/orders.service.js";
import partnersService from "../services/partners.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * admin이 rider테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function riderUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.riderUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 partner테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.partnerUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 hotel테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelUpdate(req, res, next) {
  try {
    const data = req.body

    await adminsService.hotelUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 정보 조회하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
*/
async function orderIndex(req, res, next) {
  try {
    const data = {
      from: req.query.from,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 9
    }
    
    const result = await ordersService.getOrdersListAdmin(data)
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result))
  } catch (error) {
    next(error)
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function orderUpdate(req, res, next) {
  try {
    const data = req.body
    await adminsService.orderUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
*/
async function orderCreate(req, res, next) {
  try {
    const data = req.body
    await ordersService.createNewOrder(data);
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
*/
async function partnerCreate(req, res, next) {
  try {
    const data = req.body
    await adminsService.partnerCreate(data);
    
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * Get details of order history (주문 히스토리 DETAIL 조회)
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
*/
async function show(req, res, next) {
  try {
    const id = req.params.id;
    
    const result = await adminsService.getOrderDetail(id);
    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeUpdate(req, res, next) {
  try {
    const data = req.body
    await adminsService.noticeUpdate(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 notice테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function noticeDelete(req, res, next) {
  try {
    const id = req.params.id
    await adminsService.noticeDelete(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function orderDelete(req, res, next) {
  try {
    const id = req.params.id
    await adminsService.orderDelete(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function hotelDelete(req, res, next) {
  try {
    const id = req.params.id
    await adminsService.hotelDelete(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}

/**
 * admin이 order테이블에 강제로 정보 등록하는 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function partnerDelete(req, res, next) {
  try {
    const id = req.params.id
    await adminsService.partnerDelete(id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS))
  } catch (error) {
    return next(error);
  }
}


export default {
  riderUpdate,
  partnerUpdate,
  hotelUpdate,
  orderIndex,
  orderUpdate,
  show,
  orderCreate,
  partnerCreate,
  noticeUpdate,
  noticeDelete,
  orderDelete,
  hotelDelete,
  partnerDelete,
}
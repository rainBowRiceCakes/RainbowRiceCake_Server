/**
 * @file app/controllers/orders.controller.js
 * @description question 관련 컨트롤러
 * 251223 v1.0.0 BSONG init
 */

import { SUCCESS } from '../../configs/responseCode.config.js';
import OrdersService from '../services/orders.service.js';
import { createBaseResponse } from '../utils/createBaseResponse.util.js';

// --------------------------------------------------------------------------------------
// public--------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

/**
 * Orders 리스트 조회 컨트롤러 처리
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function index(req, res, next) {
  try {
    const page = req.query?.page ? parseInt(req.query.page) : 1; //toInt가 쿼리쪽에서 작동X

    const { count, rows } = await OrdersService.pagination(page);

    const responseData = {
      page: page,
      limit: 6,
      count: count,
      Orders: rows,
    };

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, responseData));
  } catch (error) {
    return next(error);
  }
}

/**
 * Orders 상세 조회 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function show(req, res, next) {
  try {
    const result = await OrdersService.show(req.params.id);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

/**
 * Orders 작성 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function store(req, res, next) {
  try {
    const data = {
      userId: req.user.id, // auth middleware에서 set up한 값
      email: req.body.email,
      name: req.body.name,
    };

    const result = await OrdersService.create(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

/**
 * Orders update status 컨트롤러
 * @param {import("express").Request} req - Request 객체
 * @param {import("express").Response} res - Response 객체
 * @param {import("express").NextFunction} next - NextFuction 객체
 * @returns
 */
async function update(req, res, next) {
  try {
    const data = {
      userId: req.user.id, // auth middleware에서 set up한 값
      riderId: req.body.riderId,
      status: req.body.status,
    };

    const result = await OrdersService.update(data);

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch(error) {
    return next(error);
  }
}

export default {
  index,
  show,
  store,
  update
};

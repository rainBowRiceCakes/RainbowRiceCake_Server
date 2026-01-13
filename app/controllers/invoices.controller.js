/**
 * @file app/controllers/invoices.controller.js
 * @description 청구서(Invoice) 관련 컨트롤러
 * 260103 v1.0.0 wook init
 */

import { SUCCESS } from "../../configs/responseCode.config.js";
import invoicesService from "../services/invoices.service.js";
import { createBaseResponse } from "../utils/createBaseResponse.util.js";

/**
 * 청구서 이메일 발송 처리
 * @param {import("express").Request} req - 리퀘스트 객체
 * @param {import("express").Response} res - 레스폰스 객체
 * @param {import("express").NextFunction} next - next 객체
 * @return {import("express").Response}
 */
async function sendInvoiceEmailPartner(req, res, next) {
  try {
    const { partnerId, year, month } = req.body;

    const result = await invoicesService.processAndSendInvoice({ partnerId, year, month });

    return res.status(SUCCESS.status).send(createBaseResponse(SUCCESS, result));
  } catch (error) {
    return next(error);
  }
}

export default {
  sendInvoiceEmailPartner,
};
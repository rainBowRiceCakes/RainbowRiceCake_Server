/**
 * @file app/repositories/settlement.repository.js
 * @description Settlement Repository
 * 260102 v1.0.0 wook 초기 생성
 */

import db from '../models/index.js';

const { Settlement } = db;

/**
 * 이메일로 유저 검색
 * @param {import("sequelize").Transaction} t 
 * @param {string}  
 * @returns 
 */
async function monthTotalAmount(t = null) {
  return await Settlement.sum(
      'totalAmount',
    {
      transaction: t
    }
  );
}

export default {
  monthTotalAmount,
}
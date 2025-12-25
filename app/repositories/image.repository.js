/**
 * @file app/repositories/image.repository.js
 * @description Image Repository (이미지 생성)
 * 251225 v1.0.0 BSONG init
 */

import db from '../models/index.js';
const { Image } = db;

/**
 * Create a new image record (이미지 레코드 생성)
 * @param {import("sequelize").Transaction|null} t
 * @param {object} data - { dlvId, img, type }
 * @returns {Promise<import("../models/Image.js").Image>}
 */
async function create(t = null, data) {
  return await Image.create(data, { transaction: t });
}

export default {
  create,
};

/**
 * @file app/middlewares/order/rder.middleware.js
 * @description Custom middlewares for order-related routes.
 * 251225 v1.0.0 BSONG init
 */

import orderRepository from '../../repositories/order.repository.js';
import myError from '../../errors/customs/my.error.js';
import ROLE from '../auth/configs/role.enum.js';
import { 
  NOT_FOUND_ERROR, 
  FORBIDDEN_ERROR,
} from '../../../configs/responseCode.config.js';

/**
 * 역할별 주문 필터를 req.orderFilter에 설정
 */
export function setOrderAccessFilter(req, res, next) {
  const { id: userId, role } = req.user;
  
  req.orderFilter = {};
  
  switch(role) {
    case ROLE.DLV:
      req.orderFilter.riderId = userId;
      break;
      
    case ROLE.PTN:
      req.orderFilter.partnerId = userId;
      break;
      
    case ROLE.ADM:
      // 필터 없음 - 모든 주문 조회 가능
      break;
      
    default:
      return next(myError('유효하지 않은 사용자 역할입니다.', FORBIDDEN_ERROR));
  }
  
  next();
}

/**
 * 주문 존재 여부만 확인 (가벼운 체크)
 * "이 주문이 DB에 있는가?" 만 확인
 */
export async function checkOrderExists(req, res, next) {
  try {
    const { orderId } = req.params;
    const exists = await orderRepository.existsByPk(null, orderId);

    if (!exists) {
      throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 라이더 역할 확인
 * "이 사람이 라이더인가?" 만 확인
 */
export function requireRiderRole(req, res, next) {
  try {
    const { role } = req.user;
    
    if (role !== ROLE.DLV && role !== ROLE.ADM) {
      throw myError('라이더만 수행할 수 있는 작업입니다.', FORBIDDEN_ERROR);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 파트너 역할 확인
 * "이 사람이 파트너인가?" 만 확인
 */
export function requirePartnerRole(req, res, next) {
  try {
    const { role } = req.user;
    
    if (role !== ROLE.PTN && role !== ROLE.ADM) {
      throw myError('파트너만 수행할 수 있는 작업입니다.', FORBIDDEN_ERROR);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

export default {
  setOrderAccessFilter,
  checkOrderExists,
  requireRiderRole,
  requirePartnerRole,
};

/**
//  * 주문 데이터를 로드 (여러 미들웨어에서 사용할 때)
//  */
// export async function loadOrder(req, res, next) {
//   try {
//     const { orderId } = req.params;
//     const order = await orderRepository.findByPk(null, orderId);

//     if (!order) {
//       throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
//     }

//     req.order = order;
//     next();
//   } catch (error) {
//     next(error);
//   }
// }

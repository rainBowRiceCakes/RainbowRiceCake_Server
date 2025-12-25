/**
 * @file app/middlewares/order/rder.middleware.js
 * @description Custom middlewares for order-related routes.
 * 251225 v1.0.0 BSONG init
 */

import orderRepository from '../../repositories/order.repository.js';
import myError from '../../errors/customs/my.error.js';
import { 
  NOT_FOUND_ERROR, 
  FORBIDDEN_ERROR,
  UNMATCHING_USER_ERROR, 
  BAD_REQUEST_ERROR 
} from '../../../configs/responseCode.config.js';
import ROLE from '../auth/configs/role.enum.js';

/**
 * 역할별 주문 필터를 req.orderFilter에 설정
 * getTodayOrders, getOrdersList에서 사용
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
 * :orderId로 주문을 조회하고 req.order에 첨부
 */
export async function checkOrderExists(req, res, next) {
  try {
    const { orderId } = req.params;
    const order = await orderRepository.findByPk(null, orderId);

    if (!order) {
      throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 상태가 'req'인지 확인
 * checkOrderExists 이후 실행 필수
 */
export function checkOrderStatusIsReq(req, res, next) {
  try {
    if (req.order.status !== 'req') {
      throw myError('이미 처리된 주문입니다.', BAD_REQUEST_ERROR);
    }
    next();
  } catch(error) {
    next(error);
  }
}

/**
 * 주문의 담당 라이더인지 확인
 * checkOrderExists 이후 실행 필수
 */
export function authorizeRiderForOrder(req, res, next) {
  try {
    const { id: userId, role } = req.user;
    
    // 어드민은 모든 작업 가능
    if (role === ROLE.ADM) {
      return next();
    }
    
    if (req.order.rider_id !== userId) {
      throw myError('주문을 처리할 권한이 없습니다.', UNMATCHING_USER_ERROR);
    }
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 주문 조회 권한 확인 (ADMIN, 담당 라이더, 생성한 파트너)
 * checkOrderExists 이후 실행 필수
 */
export function authorizeUserForOrder(req, res, next) {
  try {
    const { id: userId, role } = req.user;
    const { rider_id, partner_id } = req.order;

    const hasAccess = 
      role === ROLE.ADM || 
      userId === rider_id || 
      userId === partner_id;

    if (!hasAccess) {
      throw myError('주문 정보를 조회할 권한이 없습니다.', FORBIDDEN_ERROR);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * 라이더가 주문을 수락할 수 있는지 확인 (주문이 'req' 상태여야 함)
 * checkOrderExists 이후 실행 필수
 */
export function canRiderAcceptOrder(req, res, next) {
  try {
    const { role } = req.user;
    
    if (role !== ROLE.DLV && role !== ROLE.ADM) {
      throw myError('라이더만 주문을 수락할 수 있습니다.', FORBIDDEN_ERROR);
    }
    
    if (req.order.status !== 'req') {
      throw myError('이미 처리된 주문입니다.', BAD_REQUEST_ERROR);
    }
    
    if (req.order.rider_id) {
      throw myError('이미 다른 라이더가 수락한 주문입니다.', BAD_REQUEST_ERROR);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

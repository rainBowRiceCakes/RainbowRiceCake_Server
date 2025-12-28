// validators/orders/order.validator.js
import order from '../../fields/order.field.js';

/**
 * 주문 생성 (POST /orders) 파트너가 하는 일
 */
const store = [
  order.email,
  order.name,
  order.hotelId,
  order.price,
  order.cntS,
  order.cntM,
  order.cntL,
];

/**
 * 주문 매칭 (POST /orders/:orderId/match) 라이더가 하는 일
 */
const match = [
  order.orderId,
];

/**
 * 사진 업로드 (POST /orders/:orderId/pickup-photo, /orders/:orderId/complete-photo)
 */
const uploadPhoto = [
  order.orderId,
];


/**
 * 오늘 주문 조회 (GET /orders/today)
 */
const todayIndex = [
  order.tab,
  order.page,
];

/**
 * 주문 히스토리 조회 (GET /orders)
 */
const index = [
  order.page,
  order.limit,
  order.statusQuery,
  order.from,
  order.to,
];

/**
 * 주문 상세 조회 (GET /orders/:orderId)
 */
const show = [
  order.orderId,
];

export default {
  store,
  match,
  uploadPhoto,
  todayIndex,
  index,
  show,
};

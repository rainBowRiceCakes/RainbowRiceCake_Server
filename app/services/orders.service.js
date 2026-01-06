/**
 * @file app/serivces/orders.service.js
 * @description orders Service (주문 등록, 오늘 자 탭별 주문 리스트 조회, 주문 히스토리 리스트 및 상세 조회)
 * 251225 v1.0.0 BSONG init
 * 251225 v1.1.0 BSONG update - 상태별 주문 목록 및 카운트 조회 기능 추가, 그리고 주문 히스토리 상세 조회 기능 추가
 */

import db from '../models/index.js';
import orderRepository from "../repositories/order.repository.js";
import riderRepository from "../repositories/rider.repository.js";
import hotelRepository from "../repositories/hotel.repository.js";
import imageRepository from "../repositories/image.repository.js";
import myError from "../errors/customs/my.error.js";
import {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  FORBIDDEN_ERROR,
  CONFLICT_ERROR
} from "../../configs/responseCode.config.js";
import dayjs from 'dayjs';
import { Op } from 'sequelize';
import ROLE from '../middlewares/auth/configs/role.enum.js';
import partnerRepository from '../repositories/partner.repository.js';

// --- 1. ORDER WORKFLOW FOR PARNERS (파트너와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Create a new order (주문 등록 - partner 가 생성)
 * @param {*} data
 * @returns
*/
async function createNewOrder({ userId, orderData }) {
  return await db.sequelize.transaction(async t => {
    const { firstName, lastName, email, hotelId, plans = [], price } = orderData;

    // 1. [핵심 수정] User ID로 실제 Partner PK 조회
    // 컨트롤러에서 넘긴 partnerId가 User 테이블의 ID이므로, 
    // orders 테이블의 FK인 partners.id를 찾아야 합니다.
    const partner = await partnerRepository.findByUserId(t, userId);
    if (!partner) {
      throw myError('파트너 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // 2. plans 배열 가공 (CamelCase 스키마 기준)
    const safePlans = plans || [];
    const cntS = safePlans.find(p => p.id === 'basic')?.quantity || 0;
    const cntM = safePlans.find(p => p.id === 'standard')?.quantity || 0;
    const cntL = safePlans.find(p => p.id === 'premium')?.quantity || 0;

    // 3. 주문 데이터 검증
    if (cntS + cntM + cntL !== 1) {
      throw myError('한 번에 하나의 플랜만 주문 가능합니다.', BAD_REQUEST_ERROR);
    }

    const SERVER_PRICES = { basic: 5000, standard: 8000, premium: 10000 };

    const calculatedPrice = safePlans.reduce((sum, p) => {
      const unitPrice = SERVER_PRICES[p.id] || 0;
      return sum + (unitPrice * p.quantity);
    }, 0);

    if (price !== calculatedPrice) {
      throw myError('결제 금액 정보가 일치하지 않습니다.', BAD_REQUEST_ERROR);
    }

    // 4. 주문 객체 생성 (실제 Partner PK인 partner.id 사용)
    const newOrderData = {
      partnerId: partner.id, // userId(12) 대신 조회된 partner.id를 주입
      email,
      name: fullName,
      hotelId,
      price: calculatedPrice,
      cntS,
      cntM,
      cntL,
      status: 'req',
    };

    const order = await orderRepository.create(t, newOrderData);

    // 5. 생성된 데이터를 상세 정보와 함께 반환
    const result = await orderRepository.findByPkWithDetails(t, order.id);

    if (!result) {
      // 간혹 생성 직후 조회가 안되는 경우를 대비해 생성된 데이터라도 반환
      return order;
    }

    return result;
  });
}
// --- 2. ORDER WORKFLOW FOR RIDERS (라이더와 관련된 당일 내 이뤄지는 주문) ---
/**
 * Match Rider to Order (주문 매칭 - rider 가 수락)
 * @param {object} data
 * @param {number} data.orderId
 * @param {number} data.riderId
 * @returns {Promise<any>}
 */
async function matchOrder({ orderId, riderId }) {
  return await db.sequelize.transaction(async t => {
    // 1. 주문 조회
    const order = await orderRepository.findByPk(t, orderId);
    if (!order) {
      throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    // 2. 주문 상태 확인 - "수락 가능한가?"
    if (order.status !== 'req') {
      throw myError('이미 처리된 주문입니다.', BAD_REQUEST_ERROR);
    }

    // 3. 이미 다른 라이더가 수락했는지 확인
    if (order.riderId) {
      throw myError('이미 다른 라이더가 수락한 주문입니다.', CONFLICT_ERROR);
    }

    // 4. 라이더 존재 확인
    const rider = await riderRepository.findByUserId(t, riderId);
    if (!rider) {
      throw myError('라이더 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    // // 5. 라이더 활성 상태 확인
    // if (rider.status !== 'active') {
    //   throw myError('현재 배달 가능한 상태가 아닙니다.', FORBIDDEN_ERROR);
    // }

    // // 6. 라이더의 진행중인 주문 개수 확인 (예: 최대 3개)
    // const inProgressCount = await orderRepository.getInProgressCountByRider(t, riderId);
    // if (inProgressCount >= 3) {
    //   throw myError('진행 중인 주문이 너무 많습니다. (최대 3개)', BAD_REQUEST_ERROR);
    // }

    // 5. 주문 업데이트 (Repository가 처리)
    await orderRepository.updateToMatched(t, orderId, rider.id);

    // 6. 업데이트된 주문 조회
    return await orderRepository.findByPkWithDetails(t, orderId);
  });
}

/**
 * Upload pickup photo
 * 픽업 사진 업로드 + 주문 상태 변경 (match → pick)
 */
async function uploadPickupPhoto({ orderId, riderId, photoPath }) {
  return await db.sequelize.transaction(async t => {
    // 1. 주문 조회
    const order = await orderRepository.findByPk(t, orderId);
    if (!order) {
      throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    // 2. 권한 확인 - "이 라이더가 이 주문의 담당자인가?"
    const rider = await riderRepository.findByUserId(t, riderId); // 12로 라이더(3) 조회
    if (!rider || order.riderId !== rider.id) {
      throw myError('이 주문을 처리할 권한이 없습니다.', FORBIDDEN_ERROR);
    }

    // 3. 주문 상태 확인 - "픽업 사진을 업로드할 수 있는 상태인가?"
    if (order.status !== 'mat') {
      throw myError('픽업 사진은 매칭 후에만 업로드할 수 있습니다.', BAD_REQUEST_ERROR);
    }

    // 4. 중복 확인 - "이미 픽업 사진이 있는가?"
    const hasPickupImage = await imageRepository.existsByOrderAndType(t, orderId, 'PICK');
    if (hasPickupImage) {
      throw myError('이미 픽업 사진이 등록되었습니다.', CONFLICT_ERROR);
    }

    // 5. 이미지 저장
    const image = await imageRepository.create(t, {
      dlvId: orderId,
      img: photoPath,
      type: 'PICK',
    });

    // 6. 주문 상태 업데이트 (match → pick)
    await orderRepository.updateToPicked(t, orderId);

    // 7. 업데이트된 주문 조회
    const updatedOrder = await orderRepository.findByPkWithDetails(t, orderId);

    // 8. 알림 전송 (선택)
    // await notificationService.sendOrderPicked(updatedOrder);

    return {
      order: updatedOrder,
      image: image,
    };
  });
}

/**
 * Upload complete photo
 * 완료 사진 업로드 + 주문 상태 변경 (pick → com)
 */
async function uploadCompletePhoto({ orderId, riderId, photoPath }) {
  return await db.sequelize.transaction(async t => {
    // 1. 주문 조회
    const order = await orderRepository.findByPk(t, orderId);
    if (!order) {
      throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    // 2. 권한 확인 - "이 라이더가 이 주문의 담당자인가?"
    const rider = await riderRepository.findByUserId(t, riderId); // 12로 라이더(3) 조회
    if (!rider || order.riderId !== rider.id) {
      throw myError('이 주문을 처리할 권한이 없습니다.', FORBIDDEN_ERROR);
    }

    // 3. 주문 상태 확인 - "완료 사진을 업로드할 수 있는 상태인가?"
    if (order.status !== 'pick') {
      throw myError('완료 사진은 픽업 후에만 업로드할 수 있습니다.', BAD_REQUEST_ERROR);
    }

    // 4. 이미 완료 사진이 있는지 확인
    const hasCompleteImage = await imageRepository.existsByOrderAndType(t, orderId, 'COM');
    if (hasCompleteImage) {
      throw myError('이미 완료 사진이 등록되었습니다.', CONFLICT_ERROR);
    }

    // 5. 이미지 저장
    const image = await imageRepository.create(t, {
      dlvId: orderId,
      img: photoPath,
      type: 'COM',
    });

    // 6. 주문 완료 처리 (pick → com)
    await orderRepository.updateToCompleted(t, orderId);

    // 7. 업데이트된 주문 조회
    const updatedOrder = await orderRepository.findByPkWithDetails(t, orderId);

    // 8. 정산 처리 (선택)
    // await settlementService.processOrderSettlement(updatedOrder);

    return {
      order: updatedOrder,
      image: image,
    };
  });
}

// --- 3. ORDER WORKFLOW FOR RIDERS & PARTNERS & ADMIN (기사/점주/어드민) ---
/**
 * Get today's orders by tab
 * @param {Object} filter - 미들웨어에서 설정한 필터 { riderId, partnerId } or {}
 * @param {string} tab - 'waiting' | 'inprogress' | 'completed'
 * @param {number} page
 */
async function getTodayOrders({ filter, tab, page }) {
  return await db.sequelize.transaction(async t => {
    const limit = 9;
    const offset = limit * (page - 1);

    // 오늘 날짜 범위
    const startOfDay = dayjs().startOf('day').toDate();
    const endOfDay = dayjs().endOf('day').toDate();

    // 탭별 상태 매핑
    const statusMap = {
      waiting: ['req'],
      inprogress: ['mat'],
      completed: ['com'],
    };

    const statuses = statusMap[tab] || ['req'];

    // Repository를 통한 조회
    const result = await orderRepository.findTodayOrdersByTab(t, {
      filter,
      statuses,
      today: { start: startOfDay, end: endOfDay },
      limit,
      offset
    });

    // 응답 데이터 구성 (비즈니스 로직)
    return {
      orders: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
      tab,
      date: dayjs().format('YYYY-MM-DD'),
    };
  });
}

// ------------------------------------------ 2026.01.05 추가
/**
 * Get details of order history 상세 조회 (Detail)
*/
async function getOrderDetail({ orderCode }) {
  return await db.sequelize.transaction(async t => {
    // 1. 주문 조회
    const order = await orderRepository.findByOrderCode(t, orderCode);

  if (!order) {
    throw myError('주문을 찾을 수 없습니다.', NOT_FOUND_ERROR);
  }

    // 3. 이미지 조회
    const images = await imageRepository.findAllByOrderId(t, order.id);

    // 4. 응답 데이터 구성 (비즈니스 로직)
    const pickupImage = images.find(img => img.type === 'PICK');
    const completeImage = images.find(img => img.type === 'COM');

    return {
      order,
      images: {
        pickup: pickupImage || null,
        complete: completeImage || null,
      },
      timeline: {
        created: order.createdAt,
        matched: order.matchedAt,
        picked: order.pickedAt,
        completed: order.completedAt,
      },
    };
  });
}

/**
 * 일반 유저용 배송 현황 조회 (주문 PK로만 조회)
 * @param {Object} data { dlvId }
*/
async function getDeliveryStatus(dlvId) {
  return await db.sequelize.transaction(async (t) => {
    // 1. 레포지토리의 findByIdOnly를 사용하여 주문 상세 정보 조회/Hotel과 Rider 정보를 Include
    const order = await orderRepository.findByIdOnly(t, dlvId);

    // 2. 주문 존재 여부 확인
    if (!order) {
      throw myError('해당 주문 번호에 대한 배송 정보를 찾을 수 없습니다.', NOT_FOUND_ERROR);
    }

    // 3. 해당 주문과 연결된 모든 이미지(픽업 사진, 완료 사진) 조회
    // imageRepository는 dlvId를 기준으로 이미지를 찾습니다.
    const images = await imageRepository.findAllByOrderId(t, dlvId);
    // 타입별 사진 분류 (PICK: 픽업, COM: 완료)
    const pickupImage = images.find(img => img.type === 'PICK');
    const completeImage = images.find(img => img.type === 'COM');

    // 4. 유저에게 보여줄 응답 데이터 구성
    return {
      dlvId: order.id,
      status: order.status, // 'req', 'match', 'pick', 'com' 상태값
      customerName: order.name, // 주문자 이름
      departure: {
        partnerName: order.order_partner ? order.order_partner.krName : null, // 출발지 매장명
        address: order.order_partner ? order.order_partner.address : null, // 출발지 매장명
      },
      destination: {
        hotelName: order.order_hotel ? order.order_hotel.krName : null, // 도착지 호텔명
        address: order.order_hotel ? order.order_hotel.address : null // 도착지 주소
      },
      deliveryInfo: {
        riderPhone: order.order_rider ? order.order_rider.phone : null, // 기사 연락처
      },
      timeline: {
        orderedAt: order.createdAt, // 주문 시간
        pickedAt: pickupImage ? pickupImage.createdAt : null, // 픽업 사진 등록 시간
        completedAt: completeImage ? completeImage.createdAt : null // 완료 사진 등록 시간
      },
      images: {
        pickup: pickupImage ? pickupImage.img : null,
        complete: completeImage ? completeImage.img : null
      }
    };
  });
}

/**
 * Admin에서 사용 할 order history 주문 히스토리 LIST 3개월치 조회
 * @param {Object} filter - 미들웨어에서 설정한 필터
*/
async function getOrdersListAdmin({ from, page, limit, statusExclude, orderCode, deliveryStatus, paymentStatus, startDate, endDate }) {
  return await db.sequelize.transaction(async t => {
    const offset = limit * (page - 1);

    // 오늘 기준 3개월 전 ~ 오늘
    // 날짜 필터가 있는 경우 dateRange를 해당 필터로 재정의합니다.
    const dateRange = {};
    if (startDate && endDate) {
      dateRange.start = dayjs(startDate).startOf('day').toDate();
      dateRange.end = dayjs(endDate).endOf('day').toDate();
    } else if (from) { // from은 3개월치 시작일 지정용
      dateRange.start = dayjs(from).startOf('day').toDate();
      dateRange.end = dayjs().endOf('day').toDate();
    } else { // 기본값: 오늘로부터 3개월 전
      dateRange.start = dayjs().subtract(3, 'month').startOf('day').toDate();
      dateRange.end = dayjs().endOf('day').toDate();
    }

    const where = {};

    // orderCode 필터
    if (orderCode) {
      where.orderCode = { [Op.like]: `%${orderCode}%` }; // 부분 일치 검색
    }

    // deliveryStatus 필터
    if (deliveryStatus) {
      where.status = deliveryStatus;
    }

    // paymentStatus 필터 (현재 DB 스키마에 paymentStatus 필드가 명확하지 않으므로, status와 연계)
    if (paymentStatus) {
      // paymentStatus 필드가 별도로 있다면 해당 필드를 사용
      // if (paymentStatus === 'completed') {
      //   where.paymentStatus = 'completed';
      // } else if (paymentStatus === 'pending') {
      //   where.paymentStatus = 'pending';
      // }
      // 현재는 status 필터에 포함하여 처리
      if (paymentStatus === 'completed') {
        // 'completed' 결제는 'com', 'pick', 'mat' 상태 주문에 해당한다고 가정
        where.status = { [Op.in]: ['com', 'pick', 'mat'] };
      } else if (paymentStatus === 'pending') {
        // 'pending' 결제는 'req' 상태 주문에 해당한다고 가정
        where.status = 'req';
      }
      // 'failed' 등 다른 상태는 필요에 따라 추가
    }

    // statusExclude 필터 (기존 로직 유지, 다른 status 필터와 충돌 방지)
    if (statusExclude && !where.status) { // status가 아직 설정되지 않았을 때만 적용
      where.status = { [Op.notIn]: [statusExclude] };
    } else if (statusExclude && where.status && where.status[Op.in]) {
      // 이미 Op.in으로 status가 설정된 경우, statusExclude를 제외
      where.status[Op.in] = where.status[Op.in].filter(s => s !== statusExclude);
    } else if (statusExclude && where.status === statusExclude) {
      // 단일 status가 statusExclude와 같은 경우, 필터링 하지 않도록 함 (결과 없음)
      // 또는 빈 배열을 반환하도록 할 수 있음
      return {
        orders: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        filters: { from, orderCode, deliveryStatus, paymentStatus, startDate, endDate },
      };
    }

    // Repository를 통한 조회
    const result = await orderRepository.findOrderHistoryThreeMonth(t, {
      dateRange,
      limit,
      offset,
      where, // 새로운 where 객체 전달
    });

    // 응답 데이터 구성
    return {
      orders: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
      },
      filters: { from, orderCode, deliveryStatus, paymentStatus, startDate, endDate },
    };
  });
}

// ------------------------------------------ 2026.01.01 추가
/**
 * 주문 목록 조회 (Rider/Partner 공통)
 * @param {Object} params
 * @param {string} params.userId - 사용자 ID
 * @param {string} params.role - 'DLV' | 'PTN'
 * @param {string|string[]} params.status - 주문 상태 (단일 또는 배열)
 * @param {string} params.date - 'today' | 'all' (기본값: 'all')
 * @param {number} params.page - 페이지 번호 (기본값: 1)
 * @param {number} params.limit - 페이지당 항목 수 (기본값: 20)
 */
export const getOrdersList = async ({ userId, role, status, date, page, limit }) => {
  const where = {};

  const statusArray = status
    ? (Array.isArray(status) ? status : [status])
    : [];

  // ------------------------------------------ 2026.01.02 sara 추가(관리자, 일반 유저 추가)
  // 역할별 필터링 (관리자/라이더/파트너/일반유저 구분)
  if (role === ROLE.ADM) {
    // 관리자: 모든 주문 조회 (where 필터 없음)
  } else if (role === ROLE.DLV) {
    // 라이더: '내가 수락한 주문' + '대기 중인 주문' 포함
    const rider = await riderRepository.findByUserId(null, userId);

    if (!rider) {
      console.warn(`[OrdersService] 유저 ID(${userId})에 해당하는 라이더 정보가 없습니다.`);
      return { rows: [], count: 0 };
    }

    // 💡 핵심: statusArray에 'req'가 포함되어 있는지 체크
    const isWaitingTab = statusArray.includes('req');

    if (isWaitingTab) {
      // '대기 중' 탭: riderId 필터 없이 전체 목록 노출
    } else {
      // '진행 중(mat, pick)' 또는 '완료(com)' 탭: 
      // 반드시 "내가(로그인한 라이더)" 수락한 주문만 필터링
      where.riderId = rider.id;
    }
  } else if (role === ROLE.PTN) {
    // 💡 파트너(상점): 본인 가게에 들어온 주문만 조회
    // 1. 유저 ID로 파트너/상점 정보를 먼저 가져옵니다.
    const partner = await partnerRepository.findByUserId(null, userId);

    if (!partner) {
      console.warn(`[OrdersService] 유저 ID(${userId})에 해당하는 파트너 정보가 없습니다.`);
      return { rows: [], count: 0 };
    }

    // 2. 해당 파트너의 ID(또는 shopId)로 주문을 필터링합니다.
    where.partnerId = partner.id;
    // 만약 DB 구조가 shopId 기준이라면 where.shopId = partner.shopId; 로 변경하세요.
  } else if (role === ROLE.COM) {
    // 일반 유저: '본인이 주문한 내역'만 조회
    // 1. 전달받은 userId(숫자 PK)를 사용하여 유저 정보를 조회합니다.
    const user = await db.User.findByPk(userId);

    if (!user) {
      console.warn(`[OrdersService] 유저 ID(${userId})에 해당하는 정보를 찾을 수 없습니다.`);
      return { data: [], pagination: { totalItems: 0, totalPages: 0, currentPage: page, itemsPerPage: limit } };
    }
    // 2. 조회된 유저의 이메일을 사용하여 주문을 필터링합니다.
    where.email = user.email;
  }

  // 2. 상태 필터 (DB 쿼리용)
  if (statusArray.length > 0 && !statusArray.includes('all')) {
    // 배열 안에 값이 여러 개면 [Op.in]으로 처리됩니다.
    where.status = { [Op.in]: statusArray };
  }

  // 날짜 필터
  if (date === 'today') {
    where.createdAt = {
      [Op.between]: [
        dayjs().startOf('day').toDate(),
        dayjs().endOf('day').toDate()
      ]
    };
  }

  // 페이지네이션 설정
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 9;
  const offset = (pageNum - 1) * limitNum;

  // Repository 호출
  try {
    const result = await orderRepository.findOrdersList(null, {
      where,
      limit: limitNum,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    const formattedOrders = result.rows.map(order => {
      const pickImg = order.order_image.find(img => img.type === 'PICK')?.img || null;
      const comImg = order.order_image.find(img => img.type === 'COM')?.img || null;

      let sml = 'S';
      if (order.cntL > 0) sml = 'L';
      else if (order.cntM > 0) sml = 'M';


      return {
        id: order.id,
        order_code: order.orderCode,
        status: order.status,
        partner_name: order.order_partner?.krName,
        hotel_name: order.order_hotel?.krName,
        price: order.price,
        name: order.name,
        sml,
        images: {
          pick_img: pickImg,
          arr_img: comImg,
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }
    })

    // 💡 프론트엔드에서 요구하는 pagination 정보를 함께 리턴합니다.
    return {
      data: formattedOrders, // 실제 주문 목록 배열
      pagination: {
        totalItems: result.count, // 전체 개수 (예: 5개)
        totalPages: Math.ceil(result.count / limitNum), // 전체 페이지 수 (예: 5/5 = 1)
        currentPage: pageNum,
        itemsPerPage: limitNum
      }
    }
  } catch (error) {
    console.error('주문 목록 조회 중 오류:', error);
    throw error;
  }

};

// ------------------------------------------ 2026.01.04 추가
export const getHourlyOrderStats = async ({ userId, role }) => {
  const where = {};

  try {
    if (role === 'PTN') { // ROLE.PTN 대신 임시로 문자열 비교나 로그 확인
      const partner = await partnerRepository.findByUserId(null, userId);
      if (partner) where.partnerId = partner.id;
    }

    // 여기서 Op가 에러 날 가능성이 높음!
    where.createdAt = {
      [Op.between]: [
        dayjs().startOf('day').toDate(),
        dayjs().endOf('day').toDate()
      ]
    };
    const result = await orderRepository.findOrdersList(null, {
      where,
      attributes: ['createdAt']
    });

    // 1. 시간대별 기본 객체 생성
    const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}시`,
      count: 0
    }));

    // 2. 데이터 매핑 (result.rows 혹은 result가 배열인지 확인 필요)
    const rows = result.rows || result;
    rows.forEach(order => {
      const hour = dayjs(order.createdAt).hour();
      hourlyCounts[hour].count += 1;
    });

    // ⭐⭐⭐ 이 줄이 반드시 있어야 합니다! ⭐⭐⭐
    return hourlyCounts;
  } catch (err) {
    console.error('서비스 내부 진짜 에러:', err); // 이게 서버 터미널에 찍힙니다.
    throw err; // 컨트롤러의 catch로 던짐
  }
};

export default {
  createNewOrder,
  matchOrder,
  uploadPickupPhoto,
  uploadCompletePhoto,
  getTodayOrders,
  getOrdersListAdmin,
  getDeliveryStatus,
  getOrdersList,
  getOrderDetail,
  getHourlyOrderStats
};

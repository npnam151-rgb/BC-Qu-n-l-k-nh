export type OutletType = 'Điểm cũ' | 'Điểm mới';

// ==========================================
// 1. DỮ LIỆU BÁO CÁO SALE SỈ (THEO ĐIỂM)
// ==========================================
export interface SingleVisitReportData {
  date: string;
  reporter: string;
  visitOrder: string; // Điểm đi thứ mấy trong ngày (1, 2, 3...)
  outletType: OutletType; // Điểm cũ / Điểm mới
  restaurantName: string; // Tên điểm bán
  address: string; // Địa chỉ điểm bán
  evaluationOrProposal: string; // Đánh giá/ Đề xuất
  stockBom30L: string; // Tồn kho Bom 30L
  stockBom50L: string; // Tồn kho Bom 50L
  stockKeg1L: string; // Tồn kho Keg 1L
  orderBom30L: string; // Đặt hàng Bom 30L
  orderBom50L: string; // Đặt hàng Bom 50L
  orderKeg1L: string; // Đặt hàng Keg 1L
}

export const createDefaultVisitReport = (
  reporter: string = '',
  visitOrder: string = '1'
): SingleVisitReportData => ({
  date: new Date().toISOString().split('T')[0],
  reporter,
  visitOrder,
  outletType: 'Điểm cũ',
  restaurantName: '',
  address: '',
  evaluationOrProposal: '',
  stockBom30L: '',
  stockBom50L: '',
  stockKeg1L: '',
  orderBom30L: '',
  orderBom50L: '',
  orderKeg1L: '',
});

export const SAMPLE_VISIT_DATA: SingleVisitReportData = {
  date: new Date().toISOString().split('T')[0],
  reporter: 'Phạm Ngọc Thương',
  visitOrder: '1',
  outletType: 'Điểm cũ',
  restaurantName: 'Cơm Thảo',
  address: '72 Nguyễn Khang, Cầu Giấy, Hà Nội',
  evaluationOrProposal: 'Khách đông, bia tiêu thụ đều, chủ quán đề xuất cấp thêm 2 khay đựng cốc',
  stockBom30L: '',
  stockBom50L: '6',
  stockKeg1L: '',
  orderBom30L: '',
  orderBom50L: '',
  orderKeg1L: '6',
};

// ==========================================
// 2. DỮ LIỆU BÁO CÁO QUẢN LÝ KÊNH (BC QL KÊNH)
// ==========================================
export interface ChannelManagerReportData {
  date: string; // Ngày
  salesRepName: string; // Tên NV Sale
  // Nhóm 1: Kết quả chăm sóc điểm bán
  visitedCount: string; // Số điểm ghé trong ngày
  newCustomers: string; // Khách hàng mới
  ordersCount: string; // Đơn hàng
  volume: string; // Sản lượng
  situation: string; // Tình hình
  // Nhóm 2: Tổng kết công việc trong ngày
  potentialCustomers: string; // Khách tiềm năng
  decliningRiskCustomers: string; // Khách giảm/ khách có nguy cơ mất
  marketIssues: string; // Vấn đề thị trường
  proposal: string; // Đề xuất
}

export const createDefaultChannelReport = (
  salesRepName: string = ''
): ChannelManagerReportData => ({
  date: new Date().toISOString().split('T')[0],
  salesRepName,
  visitedCount: '',
  newCustomers: '',
  ordersCount: '',
  volume: '',
  situation: '',
  potentialCustomers: '',
  decliningRiskCustomers: '',
  marketIssues: '',
  proposal: '',
});

export const SAMPLE_CHANNEL_DATA: ChannelManagerReportData = {
  date: new Date().toISOString().split('T')[0],
  salesRepName: 'Phạm Ngọc Thương',
  visitedCount: '8',
  newCustomers: '2 khách: Quán Lẩu 99 (Cầu Giấy), Bia Hơi Tuấn (Nam Từ Liêm)',
  ordersCount: '6 đơn',
  volume: '16 bom 50L, 8 bom 30L, 10 keg 1L',
  situation: 'Cuối tuần khách tăng mạnh, các quán lấy thêm bia dự phòng. Vệ sinh đường ống tốt.',
  potentialCustomers: 'Quán Nướng Mộc (Trần Thái Tông) quan tâm hợp tác đầu tháng tới; Nhà hàng Phố Biển hẹn thứ 4 thử mẫu bia.',
  decliningRiskCustomers: 'Quán Bia Đạt (Cổ Nhuế) giảm 30% sản lượng do đối thủ bia hơi khác chiết khấu sâu hơn.',
  marketIssues: 'Hãng đối thủ đang tặng tủ bảo quản và chiết khấu thêm 5% cho các quán mở mới tại khu vực Cầu Giấy.',
  proposal: 'Đề xuất duyệt chính sách khuyến mãi tặng áo đồng phục và hỗ trợ cấp thêm 1 vòi rót đôi cho 2 điểm mới.',
};

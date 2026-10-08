export type OutletType = 'Điểm cũ' | 'Điểm mới';

// ==========================================
// 1. DỮ LIỆU BÁO CÁO SALE SỈ (THEO ĐIỂM)
// ==========================================
export interface SingleVisitReportData {
  date: string;
  reporter: string;
  visitOrder: string;
  outletType: OutletType;
  restaurantName: string;
  address: string;
  evaluationOrProposal: string;
  stockBom30L: string;
  stockBom50L: string;
  stockKeg1L: string;
  orderBom30L: string;
  orderBom50L: string;
  orderKeg1L: string;
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

// =========================================================================
// 2. DỮ LIỆU BÁO CÁO QUẢN LÝ KÊNH (DO QUẢN LÝ LÀM, ĐIỀN CHO 5 SALE & PHẦN CHUNG)
// =========================================================================
export interface SaleRepData {
  id: number; // 1, 2, 3, 4, 5
  salesRepName: string; // Tên NV Sale
  visitedCount: string; // Số điểm ghé trong ngày
  newCustomers: string; // Khách hàng mới
  ordersCount: string; // Đơn hàng
  volume: string; // Sản lượng
  situation: string; // Tình hình
}

export interface ChannelManagerReportData {
  managerName: string; // Tên Quản lý lập báo cáo
  date: string; // Ngày báo cáo
  sales: SaleRepData[]; // Thông tin kết quả chăm sóc của 5 NV Sale
  // Phần tổng kết công việc trong ngày là phần chung:
  potentialCustomers: string; // Khách tiềm năng (chung)
  decliningRiskCustomers: string; // Khách giảm/ khách có nguy cơ mất (chung)
  marketIssues: string; // Vấn đề thị trường (chung)
  proposal: string; // Đề xuất (chung)
}

export const isSaleActive = (sale: SaleRepData): boolean => {
  return Boolean(sale.salesRepName && sale.salesRepName.trim() !== '');
};

export const clearAllSaleRepStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ql_kenh_manager_name');
    localStorage.removeItem('ql_kenh_sales_rep');
    for (let i = 1; i <= 50; i++) {
      localStorage.removeItem(`ql_sale_rep_${i}`);
    }
  }
};

export const createDefault5Sales = (clearStorage: boolean = false): SaleRepData[] => {
  if (clearStorage) {
    clearAllSaleRepStorage();
  }
  return [1, 2, 3, 4, 5].map((id) => {
    const savedName = (!clearStorage && typeof window !== 'undefined') 
      ? localStorage.getItem(`ql_sale_rep_${id}`) || '' 
      : '';
    return {
      id,
      salesRepName: savedName,
      visitedCount: '',
      newCustomers: '',
      ordersCount: '',
      volume: '',
      situation: '',
    };
  });
};

export const createDefaultChannelReport = (
  managerName: string = ''
): ChannelManagerReportData => ({
  managerName,
  date: new Date().toISOString().split('T')[0],
  sales: createDefault5Sales(),
  potentialCustomers: '',
  decliningRiskCustomers: '',
  marketIssues: '',
  proposal: '',
});

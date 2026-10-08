import React, { useState, useEffect } from 'react';
import { ChannelManagerReportData, SaleRepData } from '../types';
import { 
  Calendar, 
  User, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  FileText, 
  AlertTriangle, 
  Globe, 
  Lightbulb, 
  RotateCcw,
  Store,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Check,
  Plus,
  Trash2
} from 'lucide-react';

interface ChannelManagerReportFormProps {
  data: ChannelManagerReportData;
  onChange: (data: ChannelManagerReportData) => void;
  onReset: () => void;
}

export function ChannelManagerReportForm({
  data,
  onChange,
  onReset,
}: ChannelManagerReportFormProps) {
  // Tab hiện tại trong danh sách Sale
  const [activeSaleIndex, setActiveSaleIndex] = useState<number>(0);
  // Chế độ xem: 'single' (từng Sale) hoặc 'all' (tất cả Sale)
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  // Thông báo sau khi bấm Xóa trắng form
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Ghi nhớ tên Quản lý vào localStorage
  useEffect(() => {
    if (!data.managerName) {
      const savedManager = typeof window !== 'undefined' 
        ? localStorage.getItem('ql_kenh_manager_name') || localStorage.getItem('ql_kenh_sales_rep') || '' 
        : '';
      if (savedManager) {
        onChange({ ...data, managerName: savedManager });
      }
    }
  }, []);

  const handleManagerNameChange = (val: string) => {
    if (typeof window !== 'undefined') {
      if (val.trim()) {
        localStorage.setItem('ql_kenh_manager_name', val);
      } else {
        localStorage.removeItem('ql_kenh_manager_name');
      }
    }
    onChange({ ...data, managerName: val });
  };

  // Cập nhật thông tin của 1 NV Sale cụ thể
  const handleSaleChange = (index: number, field: keyof SaleRepData, value: string) => {
    const updatedSales = [...data.sales];
    const currentSale = { ...updatedSales[index], [field]: value };
    updatedSales[index] = currentSale;

    // Nếu sửa tên NV Sale, lưu nhớ tên vào localStorage (nếu rỗng thì xóa luôn khỏi storage)
    if (field === 'salesRepName') {
      if (typeof window !== 'undefined') {
        if (value.trim()) {
          localStorage.setItem(`ql_sale_rep_${index + 1}`, value);
        } else {
          localStorage.removeItem(`ql_sale_rep_${index + 1}`);
        }
      }
    }

    onChange({
      ...data,
      sales: updatedSales,
    });
  };

  // Thêm nhân viên sale mới (+)
  const handleAddSale = () => {
    const newId = data.sales.length + 1;
    const newSale: SaleRepData = {
      id: newId,
      salesRepName: '',
      visitedCount: '',
      newCustomers: '',
      ordersCount: '',
      volume: '',
      situation: '',
    };
    const updated = [...data.sales, newSale];
    onChange({
      ...data,
      sales: updated,
    });
    setActiveSaleIndex(updated.length - 1);
  };

  // Xử lý Reset form
  const handleTriggerReset = () => {
    onReset();
    setActiveSaleIndex(0);
    setResetMessage('Đã reset');
    setTimeout(() => {
      setResetMessage(null);
    }, 2000);
  };

  // Xóa bớt 1 nhân viên sale
  const handleRemoveSale = (idxToRemove: number) => {
    if (data.sales.length <= 1) return;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`ql_sale_rep_${idxToRemove + 1}`);
    }
    const updated = data.sales.filter((_, i) => i !== idxToRemove).map((s, idx) => ({
      ...s,
      id: idx + 1,
    }));
    onChange({
      ...data,
      sales: updated,
    });
    if (activeSaleIndex >= updated.length) {
      setActiveSaleIndex(Math.max(0, updated.length - 1));
    }
  };

  // Kiểm tra 1 sale đã được điền dữ liệu chưa
  const isSaleFilled = (sale: SaleRepData) => {
    return Boolean(
      (sale.salesRepName && sale.salesRepName.trim()) ||
      (sale.visitedCount && sale.visitedCount.trim()) ||
      (sale.newCustomers && sale.newCustomers.trim()) ||
      (sale.ordersCount && sale.ordersCount.trim()) ||
      (sale.volume && sale.volume.trim()) ||
      (sale.situation && sale.situation.trim())
    );
  };

  // Số lượng sale có tên (sẽ được lưu và báo cáo)
  const namedSalesCount = data.sales.filter(s => Boolean(s.salesRepName && s.salesRepName.trim())).length;

  // Tổng số điểm ghé của các sale có tên
  const totalVisited = data.sales.reduce((sum, s) => {
    const count = parseInt(s.visitedCount || '0', 10);
    return sum + (isNaN(count) ? 0 : count);
  }, 0);

  return (
    <div className="space-y-5">
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full flex items-center gap-1.5 border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Báo cáo Quản lý kênh ({namedSalesCount}/{data.sales.length} Sale có tên)
          </span>
          {totalVisited > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              Tổng ghé: {totalVisited} điểm
            </span>
          )}
          {resetMessage && (
            <span className="text-xs font-bold px-2.5 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200 animate-in fade-in flex items-center gap-1">
              <Check className="w-3 h-3 text-rose-600" />
              {resetMessage}
            </span>
          )}
        </div>

        {/* Nút Reset */}
        <button
          type="button"
          onClick={handleTriggerReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. THÔNG TIN QUẢN LÝ & NGÀY */}
      <div className="bg-white p-5 rounded-xl shadow-2xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">1. Thông tin Quản lý lập báo cáo</h2>
            <p className="text-[11px] text-slate-500">Người phụ trách tổng hợp kết quả của các nhân viên sale</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Tên Quản lý kênh <span className="text-rose-500">*</span>
            </label>
            <input
              id="manager-name-input"
              type="text"
              value={data.managerName}
              onChange={(e) => handleManagerNameChange(e.target.value)}
              placeholder="VD: Nguyễn Văn Nam, Minh Tuấn..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Tự động ghi nhớ cho các lần báo cáo sau</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Ngày báo cáo <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. KẾT QUẢ CHĂM SÓC ĐIỂM BÁN */}
      <div className="bg-white p-5 rounded-xl shadow-2xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Kết quả chăm sóc điểm bán ({data.sales.length} NV Sale)</h2>
              <p className="text-[11px] text-slate-500">Tất cả các Sale đều được lưu & báo cáo khi có tên (bỏ trống tên sẽ không lưu)</p>
            </div>
          </div>

          {/* Toggle Chế độ xem: Từng sale vs Tất cả sale */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'single' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Từng Sale
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'all' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả Sale ({data.sales.length})
            </button>
          </div>
        </div>

        {/* Thanh Tab chọn Sale kèm nút (+) THÊM SALE */}
        <div className="flex flex-wrap items-center gap-1.5">
          {data.sales.map((sale, idx) => {
            const hasName = Boolean(sale.salesRepName && sale.salesRepName.trim());
            const filled = isSaleFilled(sale);
            const isActive = activeSaleIndex === idx && viewMode === 'single';
            return (
              <button
                key={sale.id}
                type="button"
                onClick={() => {
                  setActiveSaleIndex(idx);
                  setViewMode('single');
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center min-w-[78px] ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : hasName
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : filled
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>Sale {idx + 1}</span>
                  {hasName && !isActive && <Check className="w-3 h-3 text-emerald-600" />}
                </div>
                <span className={`text-[10px] truncate max-w-[90px] font-medium ${isActive ? 'text-blue-100' : hasName ? 'text-emerald-900 font-semibold' : 'text-slate-400'}`}>
                  {sale.salesRepName ? sale.salesRepName : '(Chưa tên)'}
                </span>
              </button>
            );
          })}

          {/* NÚT (+) THÊM SALE */}
          <button
            type="button"
            onClick={handleAddSale}
            className="py-2 px-3.5 rounded-xl text-xs font-bold transition-all border-2 border-dashed border-blue-500 bg-blue-50/80 hover:bg-blue-100 text-blue-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs h-[46px]"
            title="Thêm nhân viên Sale mới (Sale 6, Sale 7...)"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Thêm (+)</span>
          </button>
        </div>

        {/* Khối nhập liệu: Chế độ Từng Sale */}
        {viewMode === 'single' && (
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-blue-100 text-blue-900 rounded-md">
                  NV Sale số {activeSaleIndex + 1}
                </span>
                {data.sales[activeSaleIndex].salesRepName ? (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Sẽ lưu & báo cáo
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    (Nhập tên để lưu & xuất báo cáo)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Sale {activeSaleIndex + 1} / {data.sales.length}
                </span>
                {data.sales.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSale(activeSaleIndex)}
                    className="p-1 hover:bg-rose-100 text-rose-500 rounded-md transition-colors cursor-pointer"
                    title={`Xóa Sale ${activeSaleIndex + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Input form của Sale hiện tại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên NV Sale {activeSaleIndex + 1} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.sales[activeSaleIndex].salesRepName}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'salesRepName', e.target.value)}
                  placeholder="VD: Thế anh, Ngần, Thương, Minh..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điểm ghé trong ngày
                </label>
                <input
                  type="text"
                  value={data.sales[activeSaleIndex].visitedCount}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'visitedCount', e.target.value)}
                  placeholder="VD: 5, 8 điểm..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Khách hàng mới
                </label>
                <input
                  type="text"
                  value={data.sales[activeSaleIndex].newCustomers}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'newCustomers', e.target.value)}
                  placeholder="VD: 1 khách mới: Lẩu 99..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn hàng
                </label>
                <input
                  type="text"
                  value={data.sales[activeSaleIndex].ordersCount}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'ordersCount', e.target.value)}
                  placeholder="VD: 4 đơn..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sản lượng
                </label>
                <input
                  type="text"
                  value={data.sales[activeSaleIndex].volume}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'volume', e.target.value)}
                  placeholder="VD: 16 to 12 nhỏ, 5 bom 50L..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tình hình chăm sóc điểm bán (của Sale này)
                </label>
                <textarea
                  rows={2}
                  value={data.sales[activeSaleIndex].situation}
                  onChange={(e) => handleSaleChange(activeSaleIndex, 'situation', e.target.value)}
                  placeholder="Ghi nhận tình hình các điểm bán sale này đã ghé: khách đông, tồn kho, phản ánh..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Nút chuyển nhanh giữa các Sale */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                type="button"
                disabled={activeSaleIndex === 0}
                onClick={() => setActiveSaleIndex(Math.max(0, activeSaleIndex - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sale trước</span>
              </button>

              <button
                type="button"
                onClick={handleAddSale}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-300 cursor-pointer transition-colors"
                title="Thêm thêm nhân viên Sale mới"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                <span>(+) Thêm Sale</span>
              </button>

              <button
                type="button"
                disabled={activeSaleIndex === data.sales.length - 1}
                onClick={() => setActiveSaleIndex(Math.min(data.sales.length - 1, activeSaleIndex + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs disabled:opacity-40 cursor-pointer"
              >
                <span>Sale tiếp theo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Khối nhập liệu: Chế độ Xem tất cả Sale cùng lúc */}
        {viewMode === 'all' && (
          <div className="space-y-4">
            {data.sales.map((sale, idx) => (
              <div key={sale.id} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                      NV Sale {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {sale.salesRepName ? (
                        <span className="text-emerald-700 font-bold">{sale.salesRepName} (Sẽ lưu)</span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa điền tên (Sẽ bỏ qua)</span>
                      )}
                    </span>
                  </div>

                  {data.sales.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSale(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                      title={`Xóa Sale ${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tên NV Sale:</label>
                    <input
                      type="text"
                      value={sale.salesRepName}
                      onChange={(e) => handleSaleChange(idx, 'salesRepName', e.target.value)}
                      placeholder="VD: Thế anh, Ngần..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số điểm ghé:</label>
                    <input
                      type="text"
                      value={sale.visitedCount}
                      onChange={(e) => handleSaleChange(idx, 'visitedCount', e.target.value)}
                      placeholder="VD: 5"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Khách mới:</label>
                    <input
                      type="text"
                      value={sale.newCustomers}
                      onChange={(e) => handleSaleChange(idx, 'newCustomers', e.target.value)}
                      placeholder="VD: 1 khách..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Đơn hàng:</label>
                    <input
                      type="text"
                      value={sale.ordersCount}
                      onChange={(e) => handleSaleChange(idx, 'ordersCount', e.target.value)}
                      placeholder="VD: 4 đơn"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sản lượng:</label>
                    <input
                      type="text"
                      value={sale.volume}
                      onChange={(e) => handleSaleChange(idx, 'volume', e.target.value)}
                      placeholder="VD: 16 to 12 nhỏ..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tình hình chăm sóc:</label>
                    <textarea
                      rows={2}
                      value={sale.situation}
                      onChange={(e) => handleSaleChange(idx, 'situation', e.target.value)}
                      placeholder="Tình hình điểm bán của sale này..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Nút thêm sale ở chế độ xem tất cả */}
            <button
              type="button"
              onClick={handleAddSale}
              className="w-full py-2.5 bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Thêm nhân viên Sale mới</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. TỔNG KẾT CÔNG VIỆC TRONG NGÀY (PHẦN CHUNG) */}
      <div className="bg-white p-5 rounded-xl shadow-2xs border border-purple-200 ring-2 ring-purple-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-purple-950">3. Tổng kết công việc trong ngày (Phần chung)</h2>
              <p className="text-[11px] text-purple-700 font-medium">Đánh giá chung toàn kênh do Quản lý tổng kết</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-300 rounded-md">
            Phần chung
          </span>
        </div>

        {/* Khách tiềm năng */}
        <div>
          <label className="block text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Khách tiềm năng (toàn kênh)
          </label>
          <textarea
            rows={2}
            value={data.potentialCustomers}
            onChange={(e) => onChange({ ...data, potentialCustomers: e.target.value })}
            placeholder="VD: Danh sách các quán, khách hàng tiềm năng mà 5 sale đang tiếp cận, lịch hẹn thử bia..."
            className="w-full px-3.5 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Khách giảm/ khách có nguy cơ mất */}
        <div>
          <label className="block text-xs font-semibold text-rose-800 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Khách giảm / Khách có nguy cơ mất (toàn kênh)
          </label>
          <textarea
            rows={2}
            value={data.decliningRiskCustomers}
            onChange={(e) => onChange({ ...data, decliningRiskCustomers: e.target.value })}
            placeholder="VD: Các quán giảm sản lượng, chuyển qua đối thủ bia khác, phàn nàn chất lượng/giá hoặc nguy cơ mất..."
            className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Vấn đề thị trường */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Vấn đề thị trường
          </label>
          <textarea
            rows={2}
            value={data.marketIssues}
            onChange={(e) => onChange({ ...data, marketIssues: e.target.value })}
            placeholder="VD: Động thái của các hãng đối thủ cạnh tranh, chính sách tài trợ, giá bán bia hơi khu vực, thời tiết..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Đề xuất */}
        <div>
          <label className="block text-xs font-semibold text-indigo-800 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            Đề xuất của Quản lý kênh
          </label>
          <textarea
            rows={3}
            value={data.proposal}
            onChange={(e) => onChange({ ...data, proposal: e.target.value })}
            placeholder="VD: Đề xuất duyệt cấp thêm vòi rót/cốc cho các điểm mới, chính sách chiết khấu kích cầu, hỗ trợ giao vận..."
            className="w-full px-3.5 py-2.5 bg-indigo-50/40 border border-indigo-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Chân form */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={handleTriggerReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

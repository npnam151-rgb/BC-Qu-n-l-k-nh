import React, { useEffect } from 'react';
import { ChannelManagerReportData } from '../types';
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
  CheckCircle2
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
  // Ghi nhớ tên NV Sale vào localStorage
  useEffect(() => {
    if (!data.salesRepName) {
      const savedName = localStorage.getItem('ql_kenh_sales_rep') || localStorage.getItem('sale_si_reporter');
      if (savedName) {
        onChange({ ...data, salesRepName: savedName });
      }
    }
  }, []);

  const handleRepNameChange = (val: string) => {
    localStorage.setItem('ql_kenh_sales_rep', val);
    onChange({ ...data, salesRepName: val });
  };

  return (
    <div className="space-y-5">
      {/* Top Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full flex items-center gap-1.5 border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            Biểu mẫu Báo cáo Quản lý kênh
          </span>
        </div>

        {/* Nút Reset form */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors shadow-2xs cursor-pointer"
          title="Xóa trắng toàn bộ dữ liệu để nhập lại từ đầu"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Xóa trắng</span>
        </button>
      </div>

      {/* 1. THÔNG TIN CHUNG */}
      <div className="bg-white p-5 rounded-xl shadow-2xs border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">1. Thông tin chung</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Tên NV Sale <span className="text-rose-500">*</span>
            </label>
            <input
              id="sales-rep-name-input"
              type="text"
              value={data.salesRepName}
              onChange={(e) => handleRepNameChange(e.target.value)}
              placeholder="VD: Phạm Ngọc Thương, Nam..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Tự động ghi nhớ cho các lần sau</span>
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
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">2. Kết quả chăm sóc điểm bán</h2>
              <p className="text-[11px] text-slate-500">Gồm 6 chỉ tiêu chăm sóc và sản lượng trong ngày</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            Nhóm 1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Số điểm ghé trong ngày */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              Số điểm ghé trong ngày <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data.visitedCount}
              onChange={(e) => onChange({ ...data, visitedCount: e.target.value })}
              placeholder="VD: 5, 8 điểm..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Khách hàng mới */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Khách hàng mới
            </label>
            <input
              type="text"
              value={data.newCustomers}
              onChange={(e) => onChange({ ...data, newCustomers: e.target.value })}
              placeholder="VD: 2 khách: Quán Lẩu 99, Bia Hơi Tuấn..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Đơn hàng */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
              Đơn hàng
            </label>
            <input
              type="text"
              value={data.ordersCount}
              onChange={(e) => onChange({ ...data, ordersCount: e.target.value })}
              placeholder="VD: 6 đơn, 4 đơn lẻ..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Sản lượng */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Sản lượng
            </label>
            <input
              type="text"
              value={data.volume}
              onChange={(e) => onChange({ ...data, volume: e.target.value })}
              placeholder="VD: 16 bom 50L, 8 bom 30L, 10 keg 1L..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Tình hình */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Tình hình chăm sóc điểm bán
          </label>
          <textarea
            rows={3}
            value={data.situation}
            onChange={(e) => onChange({ ...data, situation: e.target.value })}
            placeholder="Tình hình bán hàng tại các quán đã ghé: khách đông hay vắng, tồn bia, bảo quản đường ống, thái độ chủ quán..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* 3. TỔNG KẾT CÔNG VIỆC TRONG NGÀY */}
      <div className="bg-white p-5 rounded-xl shadow-2xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">3. Tổng kết công việc trong ngày</h2>
              <p className="text-[11px] text-slate-500">Đánh giá khách hàng, thị trường và đề xuất giải pháp</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
            Nhóm 2
          </span>
        </div>

        {/* Khách tiềm năng */}
        <div>
          <label className="block text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Khách tiềm năng
          </label>
          <textarea
            rows={2}
            value={data.potentialCustomers}
            onChange={(e) => onChange({ ...data, potentialCustomers: e.target.value })}
            placeholder="VD: Quán Nướng Mộc (Trần Thái Tông) quan tâm hợp tác đầu tháng tới; Nhà hàng Hải Sản Phố hẹn thử bia..."
            className="w-full px-3.5 py-2.5 bg-emerald-50/30 border border-emerald-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Khách giảm/ khách có nguy cơ mất */}
        <div>
          <label className="block text-xs font-semibold text-rose-800 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Khách giảm / Khách có nguy cơ mất
          </label>
          <textarea
            rows={2}
            value={data.decliningRiskCustomers}
            onChange={(e) => onChange({ ...data, decliningRiskCustomers: e.target.value })}
            placeholder="VD: Quán Bia Đạt (Cổ Nhuế) giảm 40% sản lượng do đối thủ bia hơi khác chào giá rẻ hơn..."
            className="w-full px-3.5 py-2.5 bg-rose-50/30 border border-rose-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none resize-none leading-relaxed"
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
            placeholder="VD: Động thái đối thủ tung chương trình tặng tủ bảo quản/áo, giá thị trường biến động, thời tiết ảnh hưởng sức mua..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Đề xuất */}
        <div>
          <label className="block text-xs font-semibold text-indigo-800 mb-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
            Đề xuất
          </label>
          <textarea
            rows={3}
            value={data.proposal}
            onChange={(e) => onChange({ ...data, proposal: e.target.value })}
            placeholder="VD: Đề xuất duyệt hỗ trợ thêm 1 vòi rót đôi và áo đồng phục cho 2 điểm mở mới; điều chỉnh mức chiết khấu..."
            className="w-full px-3.5 py-2.5 bg-indigo-50/30 border border-indigo-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Nút Reset form phụ ở chân biểu mẫu */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset form (Xóa trắng)</span>
        </button>
      </div>
    </div>
  );
}

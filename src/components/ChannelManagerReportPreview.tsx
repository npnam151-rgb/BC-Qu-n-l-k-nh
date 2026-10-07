import React, { forwardRef } from 'react';
import { ChannelManagerReportData } from '../types';
import { 
  TrendingUp, 
  Store, 
  Calendar, 
  User, 
  Users, 
  ShoppingCart, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Lightbulb
} from 'lucide-react';

interface ChannelManagerReportPreviewProps {
  data: ChannelManagerReportData;
}

export const ChannelManagerReportPreview = forwardRef<HTMLDivElement, ChannelManagerReportPreviewProps>(
  ({ data }, ref) => {
    const formattedDate = data.date
      ? new Date(data.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '...';

    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 w-[780px] min-w-[780px] mx-auto p-7 shadow-xs border border-slate-200"
        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
      >
        {/* Header phiếu */}
        <div className="border-b-2 border-blue-900 pb-4 mb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-md tracking-wider uppercase mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
                Kênh Quản Lý Bán Sỉ
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                BÁO CÁO QUẢN LÝ KÊNH
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Kết quả chăm sóc điểm bán & Tổng kết công việc trong ngày
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Ngày báo cáo
              </div>
              <div className="text-base font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Dải thông tin NV Sale */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Tên NV Sale:</span>
              <span className="font-extrabold text-slate-900 text-base">
                {data.salesRepName || '(Chưa nhập tên)'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Chỉ số KPI nổi bật trong ngày */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-center">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
              Điểm ghé trong ngày
            </div>
            <div className="text-xl font-black text-blue-950 mt-1">
              {data.visitedCount ? `${data.visitedCount} điểm` : '0'}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              Khách hàng mới
            </div>
            <div className="text-sm font-black text-emerald-950 mt-1.5 truncate" title={data.newCustomers}>
              {data.newCustomers || '0'}
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-center">
            <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
              Đơn hàng
            </div>
            <div className="text-sm font-black text-amber-950 mt-1.5 truncate" title={data.ordersCount}>
              {data.ordersCount || '0'}
            </div>
          </div>

          <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-center">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
              Sản lượng
            </div>
            <div className="text-sm font-black text-indigo-950 mt-1.5 truncate" title={data.volume}>
              {data.volume || '0'}
            </div>
          </div>
        </div>

        {/* BẢNG TỔNG HỢP CHI TIẾT */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs"></span>
              BẢNG TỔNG HỢP CHI TIẾT TRONG NGÀY
            </div>
          </div>

          <div className="rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                {/* Dòng 1 Header nhóm */}
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold uppercase text-[11px]">
                  <th colSpan={6} className="py-2.5 px-3 border-r border-slate-300 bg-emerald-100/80 text-emerald-950">
                    <div className="flex items-center justify-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-emerald-700" />
                      KẾT QUẢ CHĂM SÓC ĐIỂM BÁN
                    </div>
                  </th>
                  <th colSpan={4} className="py-2.5 px-3 bg-purple-100/80 text-purple-950">
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
                      TỔNG KẾT CÔNG VIỆC TRONG NGÀY
                    </div>
                  </th>
                </tr>
                {/* Dòng 2 Header cột chi tiết */}
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-300 font-bold text-[10px]">
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-emerald-50/50 w-[11%]">Tên NV Sale</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-emerald-50/50 w-[9%]">Số điểm ghé</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-emerald-50/50 w-[11%]">Khách mới</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-emerald-50/50 w-[9%]">Đơn hàng</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-emerald-50/50 w-[11%]">Sản lượng</th>
                  <th className="py-2 px-1.5 border-r border-slate-300 bg-emerald-50/50 w-[11%]">Tình hình</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-purple-50/50 w-[10%]">Khách tiềm năng</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-purple-50/50 w-[10%]">Khách giảm/nguy cơ</th>
                  <th className="py-2 px-1.5 border-r border-slate-200 bg-purple-50/50 w-[9%]">Vấn đề thị trường</th>
                  <th className="py-2 px-1.5 bg-purple-50/50 w-[9%]">Đề xuất</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-[11px] font-semibold text-slate-800 divide-x divide-slate-200 align-top">
                  <td className="py-2.5 px-1.5 text-center font-bold text-slate-900 break-words">
                    {data.salesRepName || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-center font-black text-blue-700">
                    {data.visitedCount || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10.5px] leading-tight break-words">
                    {data.newCustomers || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-center font-bold text-amber-700 break-words">
                    {data.ordersCount || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-center font-bold text-indigo-700 break-words">
                    {data.volume || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10px] leading-tight break-words line-clamp-3">
                    {data.situation || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10px] leading-tight break-words line-clamp-3 bg-purple-50/10">
                    {data.potentialCustomers || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10px] leading-tight break-words line-clamp-3 bg-purple-50/10">
                    {data.decliningRiskCustomers || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10px] leading-tight break-words line-clamp-3 bg-purple-50/10">
                    {data.marketIssues || '-'}
                  </td>
                  <td className="py-2.5 px-1.5 text-left text-[10px] leading-tight break-words line-clamp-3 bg-purple-50/10">
                    {data.proposal || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CHI TIẾT NỘI DUNG 2 NHÓM - HIỂN THỊ ĐẦY ĐỦ ĐỂ ĐỌC TRÊN ẢNH ZALO/FACEBOOK */}
        <div className="space-y-4">
          {/* 1. KẾT QUẢ CHĂM SÓC ĐIỂM BÁN (DIỄN GIẢI CHI TIẾT) */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                1. KẾT QUẢ CHĂM SÓC ĐIỂM BÁN
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                Chi tiết tình hình điểm ghé
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Khách hàng mới:</span>
                <span className="font-bold text-slate-800">
                  {data.newCustomers || '(Chưa có khách mới trong ngày)'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Đơn hàng & Sản lượng:</span>
                <span className="font-bold text-slate-800">
                  {data.ordersCount ? `${data.ordersCount}` : '0 đơn'} • {data.volume || '0 sản lượng'}
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                Tình hình chăm sóc & ghi nhận tại điểm bán:
              </span>
              <p className="text-slate-800 font-normal leading-relaxed whitespace-pre-line">
                {data.situation || '(Không có ghi chú thêm về tình hình)'}
              </p>
            </div>
          </div>

          {/* 2. TỔNG KẾT CÔNG VIỆC TRONG NGÀY (4 KHỐI RÕ RÀNG) */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                2. TỔNG KẾT CÔNG VIỆC TRONG NGÀY
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                Đánh giá khách hàng & giải pháp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Khách tiềm năng */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Khách tiềm năng</span>
                </div>
                <p className="text-emerald-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                  {data.potentialCustomers || '(Không có)'}
                </p>
              </div>

              {/* Khách giảm / khách có nguy cơ mất */}
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Khách giảm / Khách có nguy cơ mất</span>
                </div>
                <p className="text-rose-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                  {data.decliningRiskCustomers || '(Không có)'}
                </p>
              </div>

              {/* Vấn đề thị trường */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Vấn đề thị trường</span>
                </div>
                <p className="text-blue-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                  {data.marketIssues || '(Không có ghi nhận đặc biệt)'}
                </p>
              </div>

              {/* Đề xuất */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Đề xuất</span>
                </div>
                <p className="text-indigo-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                  {data.proposal || '(Không có đề xuất)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Phiếu */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>Hệ thống Báo cáo Quản lý Kênh</span>
          </div>
          <div className="font-semibold text-slate-700">
            Người lập: {data.salesRepName || 'NV Sale'}
          </div>
        </div>
      </div>
    );
  }
);

ChannelManagerReportPreview.displayName = 'ChannelManagerReportPreview';

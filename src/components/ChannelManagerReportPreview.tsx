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

    // Tính tổng số điểm ghé của 5 sale
    const totalVisited = data.sales.reduce((sum, s) => {
      const count = parseInt(s.visitedCount || '0', 10);
      return sum + (isNaN(count) ? 0 : count);
    }, 0);

    return (
      <div
        ref={ref}
        className="bg-white text-slate-900 w-[800px] min-w-[800px] mx-auto p-7 shadow-xs border border-slate-200"
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
                Tổng hợp kết quả 5 NV Sale & Đánh giá công việc chung trong ngày
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

          {/* Dải thông tin Quản lý & Tổng quan */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Quản lý lập báo cáo:</span>
              <span className="font-extrabold text-slate-900 text-base">
                {data.managerName || '(Chưa nhập tên Quản lý)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                5 Nhân viên Sale
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                Tổng ghé: {totalVisited} điểm
              </span>
            </div>
          </div>
        </div>

        {/* BẢNG KẾT QUẢ CHĂM SÓC ĐIỂM BÁN CỦA 5 SALE */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-emerald-600 rounded-xs"></span>
              KẾT QUẢ CHĂM SÓC ĐIỂM BÁN (5 NV SALE)
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">
              Chi tiết từng nhân viên phụ trách
            </span>
          </div>

          <div className="rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold text-[10.5px]">
                  <th className="py-2.5 px-2 border-r border-slate-300 bg-emerald-50/70 w-[5%] text-slate-800">STT</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 bg-emerald-50/70 w-[18%] text-left text-slate-900">Tên NV Sale</th>
                  <th className="py-2.5 px-2 border-r border-slate-300 bg-emerald-50/70 w-[10%]">Số điểm ghé</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 bg-emerald-50/70 w-[18%] text-left">Khách hàng mới</th>
                  <th className="py-2.5 px-2 border-r border-slate-300 bg-emerald-50/70 w-[11%]">Đơn hàng</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 bg-emerald-50/70 w-[16%]">Sản lượng</th>
                  <th className="py-2.5 px-3 bg-emerald-50/70 w-[22%] text-left">Tình hình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.sales.map((sale, idx) => (
                  <tr key={sale.id} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="py-2.5 px-2 border-r border-slate-200 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-left font-bold text-slate-900">
                      {sale.salesRepName || `Sale ${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 text-center font-black text-blue-700 text-sm">
                      {sale.visitedCount || '-'}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-left text-[11px] leading-snug">
                      {sale.newCustomers || '-'}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 text-center font-bold text-amber-700">
                      {sale.ordersCount || '-'}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-indigo-700 text-[11px]">
                      {sale.volume || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-left text-[10.5px] leading-snug text-slate-700 whitespace-pre-line">
                      {sale.situation || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TỔNG KẾT CÔNG VIỆC TRONG NGÀY (PHẦN CHUNG) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-purple-200">
            <div className="text-xs font-black uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-purple-600 rounded-xs"></span>
              TỔNG KẾT CÔNG VIỆC TRONG NGÀY (PHẦN CHUNG)
            </div>
            <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Chung toàn kênh
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Khách tiềm năng */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Khách tiềm năng</span>
              </div>
              <p className="text-emerald-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                {data.potentialCustomers || '(Không có)'}
              </p>
            </div>

            {/* Khách giảm / khách có nguy cơ mất */}
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Khách giảm / Khách có nguy cơ mất</span>
              </div>
              <p className="text-rose-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                {data.decliningRiskCustomers || '(Không có)'}
              </p>
            </div>

            {/* Vấn đề thị trường */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Vấn đề thị trường</span>
              </div>
              <p className="text-blue-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                {data.marketIssues || '(Không có ghi nhận đặc biệt)'}
              </p>
            </div>

            {/* Đề xuất */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Đề xuất Quản lý</span>
              </div>
              <p className="text-indigo-950 font-normal leading-relaxed whitespace-pre-line pt-0.5">
                {data.proposal || '(Không có đề xuất)'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Phiếu */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div>
            <span>Hệ thống Báo cáo Quản lý Kênh</span>
          </div>
          <div className="font-semibold text-slate-700">
            Quản lý phụ trách: {data.managerName || 'Quản lý'}
          </div>
        </div>
      </div>
    );
  }
);

ChannelManagerReportPreview.displayName = 'ChannelManagerReportPreview';

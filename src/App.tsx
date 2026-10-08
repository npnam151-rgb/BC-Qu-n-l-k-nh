import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { ChannelManagerReportForm } from './components/ChannelManagerReportForm';
import { ChannelManagerReportPreview } from './components/ChannelManagerReportPreview';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { 
  ChannelManagerReportData,
  createDefaultChannelReport
} from './types';

// Webhook Google Apps Script URL
const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxWKIm74psex5-61MTbeSZKTyA5_K8GBE2MzZ3iOcn7bu1ekM7NqvGXDOJLmz88iDGQ/exec";

export default function App() {
  // Dữ liệu Báo cáo Quản lý kênh
  const [channelData, setChannelData] = useState<ChannelManagerReportData>(() => {
    const savedManager = typeof window !== 'undefined' 
      ? localStorage.getItem('ql_kenh_manager_name') || localStorage.getItem('ql_kenh_sales_rep') || '' 
      : '';
    return createDefaultChannelReport(savedManager);
  });

  // Trạng thái xuất báo cáo & lưu Sheets
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Ref xem trước để chụp ảnh
  const channelPreviewRef = useRef<HTMLDivElement>(null);

  // Modal Popup states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [modalFileName, setModalFileName] = useState<string>('BaoCao_QLKenh.png');
  const [isBlockedWarning, setIsBlockedWarning] = useState(false);

  // Reset form Quản lý kênh: Xóa số liệu ngày hôm nay nhưng giữ lại tên Quản lý và tên 5 NV Sale
  const handleResetChannelForm = () => {
    setChannelData({
      ...channelData,
      sales: channelData.sales.map((s) => ({
        ...s,
        visitedCount: '',
        newCustomers: '',
        ordersCount: '',
        volume: '',
        situation: '',
      })),
      potentialCustomers: '',
      decliningRiskCustomers: '',
      marketIssues: '',
      proposal: '',
    });
    setExportSuccess(false);
  };

  // Lưu Báo cáo Quản lý kênh vào Google Sheets (sheet "BC QL kênh" tại 2 file)
  const saveChannelReportToGoogleSheets = async (data: ChannelManagerReportData): Promise<boolean> => {
    const payload = {
      sheetName: "BC QL kênh",
      date: data.date,
      managerName: data.managerName ? data.managerName.trim() : '',
      reporter: data.managerName ? data.managerName.trim() : '',
      // Tên gộp 5 sale làm fallback cho các script cũ
      salesRepName: data.sales.map((s, idx) => (s.salesRepName && s.salesRepName.trim()) ? s.salesRepName.trim() : `Sale ${idx + 1}`).join(', '),
      sales: data.sales.map((s, idx) => {
        const cleanName = (s.salesRepName && s.salesRepName.trim()) ? s.salesRepName.trim() : `Sale ${idx + 1}`;
        return {
          id: s.id || idx + 1,
          salesRepName: cleanName,
          name: cleanName,
          reporter: cleanName,
          visitedCount: s.visitedCount ? String(s.visitedCount).trim() : '',
          newCustomers: s.newCustomers ? s.newCustomers.trim() : '',
          ordersCount: s.ordersCount ? s.ordersCount.trim() : '',
          volume: s.volume ? s.volume.trim() : '',
          situation: s.situation ? s.situation.trim() : '',
        };
      }),
      potentialCustomers: data.potentialCustomers ? data.potentialCustomers.trim() : '',
      decliningRiskCustomers: data.decliningRiskCustomers ? data.decliningRiskCustomers.trim() : '',
      marketIssues: data.marketIssues ? data.marketIssues.trim() : '',
      proposal: data.proposal ? data.proposal.trim() : '',
    };

    if (!GOOGLE_SHEET_WEBHOOK_URL) {
      console.log("Chưa cấu hình Google Sheets Webhook URL.");
      return false;
    }

    const payloadString = JSON.stringify(payload);

    try {
      setSheetStatus('saving');

      // Trên iOS Safari / WebKit: keepalive: true ngăn trình duyệt hủy kết nối nền
      const fetchPromise = fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payloadString,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 7000)
      );

      await Promise.race([fetchPromise, timeoutPromise]);
      setSheetStatus('success');
      return true;
    } catch (error) {
      console.warn("fetch gặp lỗi hoặc timeout, kích hoạt sendBeacon fallback...", error);
      
      // Fallback 1 cho iOS Safari / WebKit: sendBeacon miễn nhiễm với việc hủy request
      try {
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([payloadString], { type: 'text/plain;charset=utf-8' });
          const sent = navigator.sendBeacon(GOOGLE_SHEET_WEBHOOK_URL, blob);
          if (sent) {
            setSheetStatus('success');
            return true;
          }
        }
      } catch (beaconErr) {
        console.warn("sendBeacon fallback lỗi:", beaconErr);
      }

      setSheetStatus('error');
      return false;
    }
  };

  // Tạo ảnh chất lượng cao
  const generateReportImageDataUrl = async (): Promise<string | null> => {
    if (!channelPreviewRef.current) return null;

    const isMobile = typeof navigator !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Zalo/i.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );

    // Chiến lược 1: toPng chất lượng cao
    try {
      const dataUrl = await toPng(channelPreviewRef.current, {
        quality: 0.98,
        pixelRatio: isMobile ? 1.5 : 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        cacheBust: true,
      });
      if (dataUrl && dataUrl.length > 200) {
        return dataUrl;
      }
    } catch (e1) {
      console.warn('Lần 1 capture toPng lỗi, thử chế độ tương thích...', e1);
    }

    // Chiến lược 2: toPng chế độ nhẹ
    try {
      const dataUrl = await toPng(channelPreviewRef.current, {
        quality: 0.92,
        pixelRatio: 1,
        backgroundColor: '#ffffff',
        skipFonts: true,
        cacheBust: false,
      });
      if (dataUrl && dataUrl.length > 200) {
        return dataUrl;
      }
    } catch (e2) {
      console.warn('Lần 2 capture toPng lỗi, thử fallback toBlob...', e2);
    }

    // Chiến lược 3: toBlob fallback
    try {
      const blob = await toBlob(channelPreviewRef.current, {
        quality: 0.95,
        pixelRatio: 1.25,
        backgroundColor: '#ffffff',
        skipFonts: true,
      });
      if (blob) {
        return URL.createObjectURL(blob);
      }
    } catch (e3) {
      console.error('Tất cả phương thức capture ảnh đều thất bại:', e3);
    }

    return null;
  };

  // Mở Popup ảnh để chạm giữ lưu vào điện thoại
  const handleOpenModalPreview = async () => {
    if (!channelPreviewRef.current) return;

    try {
      setIsExporting(true);
      setValidationError(null);
      const dataUrl = await generateReportImageDataUrl();
      if (!dataUrl) throw new Error('Không thể tạo ảnh');

      const dateStr = channelData.date || new Date().toISOString().split('T')[0];
      const cleanManager = channelData.managerName ? channelData.managerName.trim().replace(/\s+/g, '_') : 'QuanLy';
      const fileName = `BaoCao_QLKenh_${cleanManager}_${dateStr}.png`;

      setModalImageUrl(dataUrl);
      setModalFileName(fileName);
      setIsBlockedWarning(false);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to generate preview modal', err);
      setValidationError('Không thể tạo ảnh xem trước. Vui lòng kiểm tra lại trình duyệt.');
    } finally {
      setIsExporting(false);
    }
  };

  // Xuất báo cáo (Tạo ảnh & Lưu Google Sheets)
  const handleExportReport = async () => {
    if (!channelData.managerName.trim()) {
      setValidationError('Vui lòng nhập "Tên Quản lý kênh" trước khi xuất báo cáo!');
      const el = document.getElementById('manager-name-input');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!channelPreviewRef.current) return;

    setIsExporting(true);
    setExportSuccess(false);
    setValidationError(null);
    setSheetStatus('idle');

    try {
      const dataUrl = await generateReportImageDataUrl();
      if (!dataUrl) throw new Error('Không thể tạo ảnh');

      const dateStr = channelData.date || new Date().toISOString().split('T')[0];
      const cleanManager = channelData.managerName.trim().replace(/\s+/g, '_');
      const fileName = `BaoCao_QLKenh_${cleanManager}_${dateStr}.png`;

      setModalImageUrl(dataUrl);
      setModalFileName(fileName);

      // 1. Lưu dữ liệu lên Google Sheets và AWAIT hoàn tất để iOS WebKit không ngắt kết nối
      await saveChannelReportToGoogleSheets(channelData);

      // 2. Kiểm tra thiết bị iOS / Mobile
      const isIOS = typeof navigator !== 'undefined' && (
        /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      );
      const isMobile = isIOS || (typeof navigator !== 'undefined' && /Android|webOS|BlackBerry|IEMobile|Opera Mini|Zalo/i.test(navigator.userAgent));
      const isIframe = typeof window !== 'undefined' && window.self !== window.top;

      let downloadTriggered = false;
      // Trên iOS Safari: KHÔNG kích hoạt link.click() vì Safari sẽ coi đó là điều hướng hủy fetch mạng
      // Thay vào đó modal sẽ mở ngay lập tức để người dùng chạm giữ lưu ảnh vào Album
      if (!isIOS) {
        try {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          downloadTriggered = true;
        } catch (downloadErr) {
          console.warn('Direct download click failed or blocked:', downloadErr);
          downloadTriggered = false;
        }
      }

      setIsBlockedWarning(!downloadTriggered || isMobile || isIframe);
      setIsModalOpen(true);
      setExportSuccess(true);

    } catch (err) {
      console.error('Failed to export report', err);
      setValidationError('Có lỗi xảy ra khi tạo ảnh báo cáo. Vui lòng kiểm tra lại trình duyệt và thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header chính */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  Báo Cáo Quản Lý Kênh
                </h1>
              </div>
            </div>

            {/* Các nút hành động trên Header */}
            <div className="flex items-center gap-2">
              <button
                id="header-export-button"
                onClick={handleExportReport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang xuất báo cáo...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Xuất báo cáo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Banner hướng dẫn Zalo In-App Browser */}
      {typeof navigator !== 'undefined' && /Zalo/i.test(navigator.userAgent) && (
        <div className="bg-blue-600 text-white px-4 py-2 text-xs sm:text-sm font-medium shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className="bg-white text-blue-700 font-bold px-1.5 py-0.5 rounded text-[11px] shrink-0">
              Zalo
            </span>
            <span className="leading-snug">
              Vui lòng bấm dấu <strong>(•••)</strong> ở góc trên bên phải → chọn <strong>"Mở bằng trình duyệt"</strong> (Safari / Chrome) để tải ảnh về máy.
            </span>
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 sm:pb-8">
        {/* Cảnh báo Validation */}
        {validationError && (
          <div className="mb-6 p-4 rounded-xl border bg-amber-50 border-amber-300 text-amber-900 flex items-center justify-between gap-3 shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="font-bold text-sm text-amber-950">{validationError}</p>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 px-2 py-1 bg-amber-100 rounded-md cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        )}

        {/* Thông báo thành công */}
        {exportSuccess && (
          <div className="mb-6 p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 animate-in fade-in slide-in-from-top-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm text-emerald-900">
                  {sheetStatus === 'error' 
                    ? 'Đã xuất báo cáo dạng ảnh thành công! (Lưu ý: Chưa kết nối được Google Sheets)' 
                    : 'Đã xuất báo cáo và lưu dữ liệu thành công!'}
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Ảnh đã sẵn sàng để gửi vào nhóm chat. Bạn có thể bấm chạm giữ ảnh để lưu vào album.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {modalImageUrl && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xem lại ảnh</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* BỐ CỤC CHÍNH (FORM BÊN TRÁI, PREVIEW BÊN PHẢI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột trái: Form nhập liệu Báo cáo Quản lý kênh */}
          <div className="lg:col-span-7 space-y-6">
            <ChannelManagerReportForm
              data={channelData}
              onChange={setChannelData}
              onReset={handleResetChannelForm}
            />
          </div>

          {/* Cột phải: Xem trước phiếu chụp ảnh */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Ảnh phiếu Quản lý kênh
                </h2>
                <p className="text-xs text-slate-500">
                  Mẫu xuất ảnh PNG gửi Zalo/báo cáo
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="preview-section-modal-button"
                  type="button"
                  onClick={handleOpenModalPreview}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-md border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  title="Mở ảnh dạng Popup để chạm giữ lưu vào máy"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mở popup</span>
                </button>
              </div>
            </div>
            
            <div className="bg-slate-200/90 p-2 sm:p-3 rounded-xl overflow-x-auto shadow-inner border border-slate-300">
              <div className="min-w-fit mx-auto bg-white rounded-lg shadow-sm">
                <ChannelManagerReportPreview
                  data={channelData}
                  ref={channelPreviewRef}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Thanh công cụ chân trang trên Điện thoại */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-slate-200 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.05)] z-30 flex items-center gap-2">
        <button
          id="mobile-preview-modal-button"
          type="button"
          onClick={handleOpenModalPreview}
          disabled={isExporting}
          className="flex-1 flex justify-center items-center gap-1.5 px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Xem ảnh</span>
        </button>

        <button
          id="mobile-export-button"
          onClick={handleExportReport}
          disabled={isExporting}
          className="flex-2 flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang xuất...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </>
          )}
        </button>
      </div>

      {/* Modal xem trước & lưu ảnh */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={modalImageUrl}
        fileName={modalFileName}
        isBlockedWarning={isBlockedWarning}
      />
    </div>
  );
}

'use client';
import React, { useRef, useState } from 'react';
import { Order } from '../api/orderApi';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceGeneratorProps {
  order: Order;
  buttonVariant?: "default" | "outline" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ order, buttonVariant = "outline", buttonSize = "sm", className = "" }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);

    try {
      // Bật hiển thị tạm thời
      invoiceRef.current.style.display = 'block';

      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ThriftSwap_HoaDon_${order.id.substring(0, 8).toUpperCase()}.pdf`);

    } catch (error) {
      console.error("Lỗi tạo PDF:", error);
    } finally {
      // Ẩn lại
      if (invoiceRef.current) {
        invoiceRef.current.style.display = 'none';
      }
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={generatePDF}
        disabled={isGenerating}
        className={`rounded-full ${className}`}
      >
        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
        Tải Hóa Đơn
      </Button>

      {/* Hidden Invoice Template */}
      <div
        ref={invoiceRef}
        style={{
          display: 'none',
          width: '794px', // A4 width at 96dpi
          padding: '40px',
          backgroundColor: 'white',
          color: 'black',
          position: 'absolute',
          left: '-9999px',
          top: 0
        }}
        className="font-sans"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#000' }}>THRIFTSWAP</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Nền tảng đấu giá & trao đổi đồ cũ số 1</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '24px', margin: 0, color: '#000' }}>HÓA ĐƠN MUA HÀNG</h2>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Mã ĐH: #{order.id.substring(0, 8).toUpperCase()}</p>
            <p style={{ margin: '2px 0 0 0', color: '#666' }}>Ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>THÔNG TIN NGƯỜI MUA</h3>
            <p style={{ margin: '3px 0' }}><strong>Khách hàng:</strong> {order.buyerName}</p>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>THÔNG TIN NGƯỜI BÁN</h3>
            <p style={{ margin: '3px 0' }}><strong>Cửa hàng:</strong> {order.sellerName}</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left', fontWeight: 'bold' }}>Sản phẩm</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>Mã vận đơn</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 'bold' }}>Số lượng</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.productTitle}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{order.trackingCode || 'Chưa có'}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>{order.quantity}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(order.totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0' }}>Trạng thái giao dịch:</h4>
            <div style={{ display: 'inline-block', padding: '5px 15px', backgroundColor: order.status === 'COMPLETED' ? '#e6f4ea' : '#fef7e0', color: order.status === 'COMPLETED' ? '#137333' : '#b06000', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
              {order.status}
            </div>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '15px', maxWidth: '300px' }}>
              * Hóa đơn này được tạo tự động bởi hệ thống ThriftSwap và có giá trị như chứng từ điện tử hợp lệ.
            </p>
          </div>

          <div style={{ textAlign: 'right', width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '18px' }}>
              <span>Tổng thanh toán:</span>
              <strong style={{ color: '#d32f2f' }}>{formatCurrency(order.totalAmount)}</strong>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <QRCodeSVG value={`https://thrift-swap.vercel.app/orders/verify?id=${order.id}`} size={100} />
              <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>Quét mã để xác thực hóa đơn</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center', color: '#999', fontSize: '12px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          Cảm ơn quý khách đã sử dụng dịch vụ của ThriftSwap!<br />
          Website: https://thrift-swap.vercel.app
        </div>
      </div>
    </>
  );
};

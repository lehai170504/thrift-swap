import { ShieldCheck, Wallet, RefreshCw, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Chính sách Escrow | Thriftly',
  description: 'Tìm hiểu về hệ thống thanh toán trung gian an toàn tuyệt đối trên Thriftly.',
};

export default function EscrowPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-blue-900 to-slate-900"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Link href="/">
            <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-white/10 mb-8 rounded-full px-6 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
            </Button>
          </Link>
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-400/30">
              <ShieldCheck className="w-10 h-10 text-blue-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Thanh toán an toàn với <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">
                Hệ thống Escrow
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Giao dịch đồ cũ chưa bao giờ an tâm đến thế. Tiền của bạn được giữ an toàn trên hệ thống trung gian và chỉ được chuyển đi khi bạn đã hoàn toàn hài lòng với món đồ nhận được.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4">Escrow hoạt động như thế nào?</h2>
            <p className="text-neutral-500 text-lg">Quy trình 3 bước đơn giản bảo vệ quyền lợi tối đa cho cả người mua và người bán.</p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-primary/30 to-emerald-200 z-0"></div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-blue-50 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">1</div>
                  <Wallet className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Tạm giữ tiền (Hold)</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Khi bạn thanh toán đơn hàng, tiền sẽ được trừ vào ví nhưng <span className="font-semibold text-neutral-900">chưa chuyển cho người bán</span>. Số tiền này được Thriftly "Giam giữ" an toàn.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-primary/10 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold border-2 border-white">2</div>
                  <RefreshCw className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Giao hàng & Kiểm tra</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Người bán tiến hành đóng gói và giao hàng. Bạn nhận hàng, kiểm tra kỹ lưỡng xem có đúng mô tả, hình ảnh và tình trạng đã cam kết hay không.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-emerald-50 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">3</div>
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Hoàn tất (Release)</h3>
                <p className="text-neutral-500 leading-relaxed">
                  Nếu mọi thứ ổn thoả, bạn nhấn nút "Đã nhận hàng". Lúc này hệ thống mới <span className="font-semibold text-neutral-900">mở khóa tiền</span> và cộng thẳng vào ví người bán.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ/Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-blue-50 rounded-[2.5rem] p-8 md:p-12 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-8 text-center">Tại sao bạn nên yên tâm?</h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h4 className="font-bold text-lg text-neutral-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Chuyện gì xảy ra nếu hàng bị lỗi/không đúng mô tả?
                </h4>
                <p className="text-neutral-600 pl-4">
                  Tiền vẫn đang nằm trong hệ thống Escrow của Thriftly! Bạn chỉ cần nhấn báo cáo lỗi trong vòng 3 ngày kể từ khi nhận hàng. Đội ngũ quản trị viên sẽ xem xét bằng chứng và <span className="font-semibold text-neutral-900">hoàn lại 100% tiền</span> về ví của bạn nếu người bán có gian lận.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <h4 className="font-bold text-lg text-neutral-900 mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Người bán có sợ bị người mua "bùng" tiền không?
                </h4>
                <p className="text-neutral-600 pl-4">
                  Hoàn toàn không! Một khi trạng thái đơn hàng là "Đã thanh toán (Escrow)", điều đó chứng tỏ tiền thật 100% của người mua đã được nạp và khóa lại trong hệ thống. Người bán có thể yên tâm giao hàng mà không sợ rủi ro "bùng hàng, bom hàng".
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/wallet">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg font-bold shadow-lg shadow-blue-200">
                  Nạp tiền vào ví ngay
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fdfbf7] dark:bg-zinc-950/40 text-muted-foreground pt-24 pb-12 mt-12 border-t border-border/30">
      <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">

          {/* Column 1: Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-border/50 group-hover:scale-105 transition-transform duration-300">
                <img src="/logo.png?v=2" alt="Thriftly Logo" className="w-[120%] h-[120%] object-contain" />
              </div>
              <span className="text-3xl font-serif font-medium tracking-tight text-foreground">
                Thriftly.
              </span>
            </Link>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-base font-medium">
              Nền tảng thanh lý và đấu giá đồ cũ thông minh, an toàn và minh bạch. Giao dịch yên tâm tuyệt đối với hệ thống thanh toán trung gian Escrow hiện đại.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.629 5.903-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-foreground font-heading font-bold mb-6 uppercase text-xs tracking-[0.15em]">Khám phá</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/products" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Phòng đấu giá trực tiếp</Link></li>
              <li><Link href="/products?sort=popular" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Danh mục nổi bật</Link></li>
              <li><Link href="/products?sort=newest" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Sản phẩm mới nhất</Link></li>
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h3 className="text-foreground font-heading font-bold mb-6 uppercase text-xs tracking-[0.15em]">Hỗ trợ</h3>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="/how-it-works" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Cách thức hoạt động</Link></li>
              <li><Link href="/escrow" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Thanh toán Escrow</Link></li>
              <li><Link href="/report" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Báo cáo vi phạm</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-foreground font-heading font-bold mb-6 uppercase text-xs tracking-[0.15em]">Chính sách</h3>
            <ul className="space-y-4">
              <li><Link href="/policies?tab=terms" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="/policies?tab=privacy" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Bảo mật thông tin</Link></li>
              <li><Link href="/policies?tab=refund" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Chính sách hoàn tiền</Link></li>
              <li><Link href="/policies?tab=dispute-resolution" className="text-muted-foreground hover:text-foreground font-medium transition-colors">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm font-medium">
            © 2026 Thriftly. All rights reserved. Designed with <span className="text-red-500 mx-1">♥</span> for the community.
          </p>
          <div className="flex gap-3">
            <div className="w-14 h-9 bg-white dark:bg-zinc-900 rounded-lg border border-border/50 shadow-sm flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider">VISA</div>
            <div className="w-14 h-9 bg-white dark:bg-zinc-900 rounded-lg border border-border/50 shadow-sm flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider">MASTER</div>
            <div className="w-14 h-9 bg-white dark:bg-zinc-900 rounded-lg border border-border/50 shadow-sm flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-wider">MOMO</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

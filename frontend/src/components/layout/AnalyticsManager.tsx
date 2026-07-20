'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function AnalyticsManager() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Hàm kiểm tra trạng thái consent
    const checkConsent = () => {
      const consent = localStorage.getItem('thriftly-cookie-consent');
      setHasConsent(consent === 'accepted');
    };

    // Kiểm tra lần đầu khi load
    checkConsent();

    // Lắng nghe sự thay đổi của localStorage trong trường hợp user vừa ấn nút "Chấp nhận"
    // (Lưu ý: storage event thường chỉ kích hoạt giữa các tab khác nhau, nên ta cần dispatch event thủ công nếu muốn phản hồi ngay lập tức trên cùng 1 tab, 
    // hoặc đơn giản hơn là load lại trang khi user đổi ý định)
    window.addEventListener('cookie-consent-changed', checkConsent);

    return () => {
      window.removeEventListener('cookie-consent-changed', checkConsent);
    };
  }, []);

  if (!hasConsent) return null;

  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <>
      {/* Google Analytics */}
      {GA_TRACKING_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {FB_PIXEL_ID && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}

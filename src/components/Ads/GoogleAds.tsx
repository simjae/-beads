import React, { useEffect } from "react";

const GoogleAds: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.setAttribute("data-ad-client", "YOUR_GOOGLE_ADS_CLIENT_ID"); // 구글 광고 클라이언트 ID 추가
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="YOUR_GOOGLE_ADS_CLIENT_ID"
      data-ad-slot="YOUR_AD_SLOT"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default GoogleAds;

import React, { useEffect } from "react";

const OtherAdPlatform: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "URL_TO_OTHER_AD_PLATFORM_SCRIPT";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="other-ad-platform">{/* 광고 표시 영역 */}</div>;
};

export default OtherAdPlatform;

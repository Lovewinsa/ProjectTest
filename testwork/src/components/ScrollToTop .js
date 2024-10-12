import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // 경로 변경 시 스크롤을 맨 위로 올림
  }, [pathname]);

  return null;
};

export default ScrollToTop;
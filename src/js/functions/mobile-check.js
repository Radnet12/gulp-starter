export const mobileCheck = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const htmlEl = document.querySelector("html");

  if (/android/i.test(userAgent)) {
    htmlEl.classList.add("android");
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    htmlEl.classList.add("ios");
    return "iOS";
  }

  return "unknown";
};

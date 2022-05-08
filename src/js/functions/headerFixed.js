export const headerFixed = () => {
  // When user scroll the page, fulfill scroll function
  window.addEventListener("scroll", () => {
    scrollGo();
  });

  // Getting header
  let header = document.querySelector(".header");

  // Get the offset of the header
  let sticky = header.offsetTop;

  // Adding class "sticky" to the header, when you rich the position.
  // Deleting "sticky"
  function scrollGo() {
    if (window.pageYOffset > sticky) {
      header.classList.add("header--fixed");
    } else {
      header.classList.remove("header--fixed");
    }
  }
  scrollGo();
};

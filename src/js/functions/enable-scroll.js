export const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block"),
    body = document.body,
    pagePosition = parseInt(body.dataset.position, 10);

  fixBlocks.forEach((el) => {
    el.style.paddingRight = "0px";
  });

  body.style.paddingRight = "";
  body.style.top = "";

  body.classList.remove("lock");

  window.scroll({
    top: pagePosition,
    left: 0,
  });

  body.removeAttribute("data-position");
};

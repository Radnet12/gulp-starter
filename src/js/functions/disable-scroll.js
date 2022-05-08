export const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll(".fixed-block"),
    body = document.body,
    pagePosition = window.scrollY,
    paddingOffset = `${window.innerWidth - body.offsetWidth}px`;

  fixBlocks.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });

  body.classList.add("lock");

  body.dataset.position = pagePosition;

  body.style.paddingRight = paddingOffset;
  body.style.top = `-${pagePosition}px`;
};

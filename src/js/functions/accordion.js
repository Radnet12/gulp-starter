export const accordion = (
  accordionParentSelector,
  accordionHeadClass,
  accordionItemSelector,
  accordionActiveClass,
  openOneItem = false
) => {
  const accordionParent = document.querySelector(accordionParentSelector);

  if (accordionParent) {
    accordionParent.addEventListener("click", (e) => {
      if (e.target.classList.contains(accordionHeadClass)) {
        if (openOneItem) {
          const accordionActiveItems = accordionParent.querySelectorAll(
            `.${accordionActiveClass}`
          );

          if (accordionActiveItems.length > 0) {
            accordionActiveItems.forEach((item) => {
              item.classList.remove(accordionActiveClass);

              let accordionBody = item.lastElementChild;

              accordionBody.style.maxHeight = "";
            });
          }
        }

        let itemParent = e.target.closest(accordionItemSelector);
        let accordionBody = itemParent.lastElementChild;

        itemParent.classList.toggle(accordionActiveClass);

        if (accordionBody.style.maxHeight) {
          accordionBody.style.maxHeight = "";
        } else {
          accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
        }
      }
    });
  }
};

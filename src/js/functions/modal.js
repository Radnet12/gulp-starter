import { disableScroll } from "./disable-scroll";
import { enableScroll } from "./enable-scroll";

export const modals = () => {
  // действия с модальным окном
  function actionsWithModal(currentModal, isAdd, timeout) {
    // Ищём открытое модальное окно, елементы с фиксированным позиционированием и ищем тег body
    const activeModal = document.querySelector(".modal.show");

    // Делаем действия если нужно открыть или же закрыть модальное окно
    if (isAdd === "open") {
      // Открытие модального окна

      // Проверяем есть ли помимо данного модального окна уже открытое модальное окно
      if (activeModal) {
        // Если есть, скрываем его и убираем overflow: hidden у body
        activeModal.classList.remove("show");
        enableScroll();
      }

      // Открываем нужное модальное окно, убираем прокрутку у страницы,
      // задаем отступ body для того, чтобы не было визуального смещения страницы
      currentModal.classList.add("show");

      disableScroll();
    } else if (isAdd === "close") {
      // Убираем класс активноси у модального окна
      currentModal.classList.remove("show");

      // Запускаем таймер, который ждет окончание анимации скрытия
      // модального окна, чтобы не было прыжка страницы при закрытии
      setTimeout(() => {
        enableScroll();
      }, timeout);
    }
  }

  // функция привязки модального окна
  function bindModal(
    triggerSelector,
    modalSelector,
    closeSelector = null,
    timeout = 300,
    closeOverOverlay = true
  ) {
    // Находим все триггеры, которые открывают модальное окно и находим само модальное окно
    const triggers = document.querySelectorAll(triggerSelector),
      modal = document.querySelector(modalSelector);

    // Перебираем триггеры и добавляем обработчик событий, которые открывает модальное окно
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        actionsWithModal(modal, "open");
      });
    });

    // Обработчик клика по крестику
    if (closeSelector) {
      const close = modal.querySelector(closeSelector);

      close.addEventListener("click", () => {
        actionsWithModal(modal, "close", timeout);
      });
    }

    // Обработчик события по клику на черную прослойку
    if (closeOverOverlay) {
      modal.addEventListener("click", (e) => {
        if (!e.target.closest(".modal__content")) {
          actionsWithModal(modal, "close", timeout);
        }
      });
    }
  }

  // функция для показа модального окна через какое-то определенное время
  function showModalByTime(selector, time) {
    setTimeout(() => {
      const modal = document.querySelector(selector);
      modal.classList.add("show");
      document.body.classList.add("lock");
    }, time);
  }
};

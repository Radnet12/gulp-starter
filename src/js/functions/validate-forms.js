// import JustValidate from "just-validate";
// import Inputmask from "inputmask";

export const validateForms = (
  selector,
  rules,
  onSuccessSend,
  onFailSend,
  options = null,
  translation = null,
  locale = null
) => {
  const form = document?.querySelector(selector);
  const telSelector = form?.querySelector('input[type="tel"]');

  if (!form) {
    console.error("Нет такого селектора!");
    return false;
  }

  if (!rules) {
    console.error("Вы не передали правила валидации!");
    return false;
  }

  if (telSelector) {
    const inputMask = new Inputmask("+7 (999) 999-99-99");
    inputMask.mask(telSelector);

    for (let item of rules) {
      if (item.tel) {
        item.rules.push({
          rule: "function",
          validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
          },
          errorMessage: item.telError,
        });
      }
    }
  }

  const validation = new JustValidate(selector, options, translation);

  if (translation && locale) {
    validation.setCurrentLocale(locale);
  }

  for (let item of rules) {
    validation.addField(item.ruleSelector, item.rules);
  }

  validation.onSuccess(async (event) => {
    let formData = new FormData(event.target);

    const response = await fetch("mail.php", {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      console.error("Ошибка при отправке!");
      onFailSend();
      return false;
    }

    console.log("Отправлено");
    onSuccessSend();

    event.target.reset();
  });

  validation.onFail((fields) => {
    console.log("fields", fields);
  });
};

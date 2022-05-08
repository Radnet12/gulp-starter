"use strict";

// Connecting vendors (plugins)
import "./_vendor";

// Functions
import { mobileCheck } from "./functions/";

// Components
// import { formValidation } from "./components/";

window.addEventListener("DOMContentLoaded", () => {
  mobileCheck();
});

// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

import { renderTimeElement, renderFormDateEl } from "./view-dependencies/renderMethods.js";
import { listenToBlur } from "./view-dependencies/eventHandlers.js";

class View {
    constructor() {
        this.formEl = document.querySelector(".journal__form");
        this.formDateInput = document.querySelector("#form-input-date");
        this.timeEl = document.querySelector(".time");
    }

    // ================================================================================================

    renderTimeElement(year, month, date, hours, minutes, seconds) {
        renderTimeElement(year, month, date, hours, minutes, seconds);
    }

    // ================================================================================================

    renderFormDateEl(year, month, date) {
        renderFormDateEl(year, month, date);
    }

    // ================================================================================================

    listenToBlur() {
        listenToBlur();
    }

    // ================================================================================================
}

export default View;

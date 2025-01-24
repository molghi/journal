import { Visual } from "../../Controller.js";

// ================================================================================================

function renderTimeElement(year, month, date, hours, minutes, seconds) {
    Visual.timeEl.innerHTML = `${hours}<span>:</span>${minutes}`;
    Visual.timeEl.setAttribute("title", `${date}/${month}/${year.toString().slice(2)}  ̶ ${hours}:${minutes}`);
}

// ================================================================================================

function renderFormDateEl(year, month, date) {
    Visual.formDateInput.value = `${date}/${month}/${year.toString().slice(2)}`;
    Visual.formDateInput.nextElementSibling.classList.add("moved-up");
}

// ================================================================================================

export { renderTimeElement, renderFormDateEl };

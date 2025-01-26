import { Visual } from "../../Controller.js";
import { crossIcon } from "./icons.js";

// ================================================================================================

function renderTimeElement(year, month, date, hours, minutes, seconds) {
    Visual.timeEl.innerHTML = `${hours % 12}<span>:</span>${minutes}`;
    Visual.timeEl.setAttribute("title", `Now: ${date}/${month}/${year.toString().slice(2)}  ̶ ${hours}:${minutes}`);
}

// ================================================================================================

function renderFormDateEl(year, month, date) {
    Visual.formDateInput.value = `${date}/${month}/${year.toString().slice(2)}`;
    Visual.formDateInput.nextElementSibling.classList.add("moved-up");
}

// ================================================================================================

function showMessage(type, text) {
    Visual.removeMessages(); // removing before rendering

    const div = document.createElement("div");
    const typeMsg = type === "error" ? "error" : type === "success" ? "success" : ""; // defining the type
    div.classList.add("message", typeMsg);
    div.innerHTML = text;

    Visual.containerEl.appendChild(div);

    div.style.animationFillMode = "both";
    div.style.animation = "pulse 0.5s ease-in-out";

    setTimeout(() => {
        Visual.containerEl.removeChild(div);
    }, 5000);
}

// ================================================================================================

function renderEntriesBrowser(titlesArr, idsArr, shortContentArr) {
    const html = titlesArr
        .map((title, i) => {
            return `<div class="all-entries__miniature" title="Note: ${shortContentArr[i]}..." data-id="${idsArr[i]}">${title}</div>`;
        })
        .join("");
    Visual.allEntriesBrowser.innerHTML = ``;
    Visual.allEntriesBrowser.insertAdjacentHTML("beforeend", html);
}

// ================================================================================================

function renderNote(noteObj) {
    const div = document.createElement("div");
    div.classList.add("all-entries__note");
    div.dataset.id = noteObj.id;
    const keywordsEl = !Array.isArray(noteObj.keywords)
        ? `<button>${noteObj.keywords}</button>`
        : noteObj.keywords.map((keyword) => `<button>${keyword}</button>`).join("");

    div.innerHTML = `<div class="all-entries__note-row">
<div class="all-entries__note-title">${noteObj.title}</div>
</div>
<div class="all-entries__note-row">
<div class="all-entries__note-text">${noteObj.note}</div>
</div>
<div class="all-entries__note-row">
<div class="all-entries__note-keywords"><span title="Click to edit keywords">Keywords: </span> ${keywordsEl}</div>
<div class="all-entries__note-date">Date: ${noteObj.dateInput}</div>
</div><div class="all-entries__note-button">${crossIcon}</div>`;

    Visual.allEntriesBox.appendChild(div);
}

// ================================================================================================

export { renderTimeElement, renderFormDateEl, showMessage, renderEntriesBrowser, renderNote };

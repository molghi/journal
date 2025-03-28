import { Visual } from "../../Controller.js";
import { crossIcon } from "./icons.js";

// ================================================================================================

// render the current time at the bottom left
function renderTimeElement(year, month, date, hours, minutes, seconds) {
    Visual.timeEl.innerHTML = `${hours % 12}<span>:</span>${minutes}`;
    Visual.timeEl.setAttribute("title", `Now: ${date}/${month}/${year.toString().slice(2)}  ̶ ${hours}:${minutes}`);
}

// ================================================================================================

// render the date input of the main form in Add New
function renderFormDateEl(year, month, date) {
    Visual.formDateInput.value = `${date}/${month}/${year.toString().slice(2)}`;
    Visual.formDateInput.nextElementSibling.classList.add("moved-up");
}

// ================================================================================================

// show message in the UI
function showMessage(type, text, timeout, position) {
    Visual.removeMessages(); // removing (if any) before rendering new

    const div = document.createElement("div");
    const typeMsg = type === "error" ? "error" : type === "success" ? "success" : "notification"; // defining the type
    div.classList.add("message", typeMsg);
    div.innerHTML = text;

    if (typeMsg === "notification") {
        div.style.transition = `opacity 0.3s`;
        div.style.animation = "reveal 1s linear 0s 1 initial both"; // animation: name duration timing-function delay iteration-count direction fill-mode;
        setTimeout(() => {
            Visual.containerEl.appendChild(div);
        }, 500);
        return;
    }

    Visual.containerEl.appendChild(div);

    div.style.animationFillMode = "both";
    // div.style.animation = "pulse 0.5s ease-in-out";
    div.style.animation = "reveal 0.3s ease-in-out";

    setTimeout(() => {
        // if (document.querySelector(".message")) Visual.containerEl.removeChild(div);
        if (document.querySelector(".message")) [...document.querySelectorAll(".message")].forEach((el) => el.remove());
    }, timeout || 5000);

    if (position === "bottom") {
    }
    div.style.position = "fixed";
    div.style.bottom = "20px";
}

// ================================================================================================

// render miniature elements
function renderEntriesBrowser(titlesArr, idsArr, shortContentArr) {
    const html = titlesArr
        .map((title, i) => {
            return `<div class="all-entries__miniature" title="Title: ${title.replaceAll('"', "'")}\nNote: ${shortContentArr[
                i
            ].replaceAll("<br>", "  ")}..." data-id="${idsArr[i]}">${title}</div>`;
        })
        .join("");

    Visual.allEntriesBrowser.innerHTML = ``;
    Visual.allEntriesBrowser.insertAdjacentHTML("beforeend", html);
}

// ================================================================================================

// render one note element
function renderNote(noteObj) {
    const div = document.createElement("div");
    div.classList.add("all-entries__note");
    div.dataset.id = noteObj.id;

    const keywordsEl = !Array.isArray(noteObj.keywords)
        ? `<button class="all-entries__note-keyword">${noteObj.keywords}</button>`
        : noteObj.keywords.map((keyword) => `<button class="all-entries__note-keyword">${keyword}</button>`).join("");

    // const noteContent = !noteObj.note.includes("  ") ? noteObj.note : noteObj.note.replaceAll("  ", "&nbsp;&nbsp;");
    // const noteContent = noteObj.note.replace(/^ +/gm, (match) => "&nbsp;".repeat(match.length));

    const formatDate = (dateISOString) => {
        const date = new Date(dateISOString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(2)}`;
    };

    div.innerHTML = `<div class="all-entries__note-row">
<div class="all-entries__note-title">${noteObj.title || "Journal Entry"}</div>
</div>
<div class="all-entries__note-row">
<div class="all-entries__note-text">${noteObj.note}</div>
</div>
<div class="all-entries__note-row">
<div class="all-entries__note-keywords"><span title="Click to edit keywords">Keywords: </span> ${keywordsEl}</div>
<div class="all-entries__note-date" title="Created on ${noteObj.dateInput}${
        noteObj.timeModified ? ` − Changed on ${formatDate(noteObj.timeModified)}` : ""
    }">Date: ${noteObj.dateInput}</div>
</div><div class="all-entries__note-button">${crossIcon}</div>`;
    Visual.allEntriesBox.appendChild(div);
}

// ================================================================================================

export { renderTimeElement, renderFormDateEl, showMessage, renderEntriesBrowser, renderNote };

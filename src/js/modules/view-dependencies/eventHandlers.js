import { Visual } from "../../Controller.js";

// ================================================================================================

// listen to the blur event (in the form where one adds new notes) on all inputs inside the form: if it happens change styles on label el
function listenToBlur() {
    const allFormInputs = [...Visual.formEl.querySelectorAll(".journal__form-input")];
    allFormInputs.forEach((inputEl) => {
        inputEl.addEventListener("blur", function (e) {
            const blurredEl = e.target;
            if (blurredEl.value.length > 0) {
                blurredEl.nextElementSibling.classList.add("moved-up");
            } else {
                blurredEl.nextElementSibling.classList.remove("moved-up");
            }
        });
    });
}

// ================================================================================================

function handleFormSubmit(handler) {
    Visual.formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const dateInput = Visual.formDateInput.value;
        const keywordsInput = Visual.formKeywordsInput.value;
        const titleInput = Visual.formTitleInput.value;
        const textareaInput = Visual.formTextareaInput.value;
        handler(dateInput, keywordsInput, titleInput, textareaInput);
    });
}

// ================================================================================================

function handleHeaderNav(handler) {
    Visual.headerNavEl.addEventListener("click", (e) => {
        const clickedBtn = e.target.closest("button");
        handler(clickedBtn);
    });
}

// ================================================================================================

function handleAllNotesActions(handler) {
    Visual.allEntriesSection.addEventListener("click", (e) => {
        if (Visual.allEntriesSection.classList.contains("hidden")) return;

        const clickedNoteId = e.target.closest(".all-entries__note").dataset.id;

        if (e.target.closest(".all-entries__note-button")) {
            handler("delete", clickedNoteId);
        }

        if (e.target.closest(".all-entries__note-title")) {
            const currentValue = e.target.closest(".all-entries__note-title").textContent;
            handler("edit title", clickedNoteId, currentValue);
        }

        if (e.target.closest(".all-entries__note-text")) {
            const currentValue = e.target.closest(".all-entries__note-text").textContent;
            handler("edit text", clickedNoteId, currentValue);
        }

        if (e.target.closest(".all-entries__note-keywords")) console.log("edit keywords");
        if (e.target.closest(".all-entries__miniature")) console.log("scroll to this note");
    });
}

// ================================================================================================

function listenToBlurAllNotes(handler) {
    Visual.allEntriesSection.querySelectorAll("input").forEach((input) => {
        input.addEventListener("blur", (e) => {
            // if (Visual.allEntriesSection.classList.contains("hidden")) return;

            console.log(`listenToBlurAllNotes`, e.target);
        });
    });
}

// ================================================================================================

function handleActionsMenu(handler) {
    Visual.actionsMenu.addEventListener("click", (e) => {
        if (!e.target.classList.contains("action-action")) return;
        const actionType = e.target.textContent.trim().toLowerCase();

        if (actionType === "change color") {
            handler(actionType);
        }
    });
}

// ================================================================================================

export { listenToBlur, handleFormSubmit, handleHeaderNav, handleAllNotesActions, listenToBlurAllNotes, handleActionsMenu };

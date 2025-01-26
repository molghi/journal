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

        let clickedNoteId = e.target.closest(".all-entries__note")?.dataset.id;
        if (!clickedNoteId) clickedNoteId = e.target.closest(".all-entries__miniature")?.dataset.id;

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

        if (e.target.closest(".all-entries__note-keywords span")) {
            handler("edit keywords", clickedNoteId);
        }

        if (e.target.closest(".all-entries__miniature")) {
            // scroll to note
            const noteEl = document.querySelector(`.all-entries__notes [data-id="${clickedNoteId}"]`);
            const scrollableContainerTop = Visual.allEntriesBox.offsetTop;
            const scrollableContainerBottom = Visual.allEntriesBox.offsetTop + Visual.allEntriesBox.offsetHeight;
            const clickedNoteElTop = noteEl.getBoundingClientRect().top;
            const clickedNoteElBottom = noteEl.getBoundingClientRect().bottom;

            const headerHeight = window.getComputedStyle(document.querySelector(".header")).height;
            const headerMarginBottom = window.getComputedStyle(document.querySelector(".header")).marginBottom;
            const offset = parseInt(headerHeight) + parseInt(headerMarginBottom);

            if (noteEl.getBoundingClientRect().top === offset) {
                // if true then the element is at the top of the scrollable container, no scrolling happens
                addFindingAnimation(noteEl);
            } else if (
                clickedNoteElTop >= scrollableContainerTop &&
                clickedNoteElTop <= scrollableContainerBottom &&
                clickedNoteElBottom <= scrollableContainerBottom
            ) {
                // if true then the element is in sight even if not at the top of the scrollable container, so no scrolling happens
                addFindingAnimation(noteEl);
            } else {
                // else scroll to that note
                handler("scroll to note", clickedNoteId);
            }
        }
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

        // if (actionType === "change color") {
        handler(actionType);
        // }
    });
}

// ================================================================================================

function listenToAutoScroll() {
    Visual.allEntriesBox.addEventListener("scroll", (e) => {
        // Visual.allEntriesBox is a scrollable container

        clearTimeout(Visual.scrollTimeout);

        Visual.scrollTimeout = setTimeout(() => {
            const noteEl = document.querySelector(`.all-entries__notes [data-id="${Visual.clickedElId}"]`);
            addFindingAnimation(noteEl); // add some animation to the element to which it just scrolled
        }, 200);
    });
}

// dependency of 'listenToAutoScroll'
function addFindingAnimation(noteEl) {
    if (!noteEl) return;
    noteEl.style.animation = "shine 1s linear 0s 2"; // animation: name duration timing-function delay iteration-count direction fill-mode;
    setTimeout(() => {
        noteEl.style.animation = "none";
    }, 2000);
}

// ================================================================================================

function handleSearchForm(handler) {
    Visual.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputValue = Visual.searchInput.value;
        handler(inputValue);
    });
}

// ================================================================================================

function handleSeachInput() {
    Visual.searchInput.addEventListener("input", function (e) {
        if (this.value.length === 0) {
            // unhide all notes
            Visual.showAllMinisNotes();
        }
    });
}

// ================================================================================================

export {
    listenToBlur,
    handleFormSubmit,
    handleHeaderNav,
    handleAllNotesActions,
    listenToBlurAllNotes,
    handleActionsMenu,
    listenToAutoScroll,
    handleSearchForm,
    handleSeachInput,
};

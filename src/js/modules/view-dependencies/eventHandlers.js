import { Visual } from "../../Controller.js";

// ================================================================================================

// listen to the blur event (in the form where one adds new notes) on all inputs inside the form: if it happens, change styles on the label el
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

// handle the submit of the form to add a new note
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

// handle clicks in the .header section (btns Add New and View All)
function handleHeaderNav(handler) {
    Visual.headerNavEl.addEventListener("click", (e) => {
        const clickedBtn = e.target.closest("button");
        handler(clickedBtn);
    });
}

// ================================================================================================

// handle clicks that happen in View All
function handleAllNotesActions(handler) {
    Visual.allEntriesSection.addEventListener("click", (e) => {
        if (Visual.allEntriesSection.classList.contains("hidden")) return;

        let clickedNoteId = e.target.closest(".all-entries__note")?.dataset.id; // note id
        if (!clickedNoteId) clickedNoteId = e.target.closest(".all-entries__miniature")?.dataset.id; // miniature id or undef

        if (e.target.closest(".all-entries__note-button")) {
            handler("delete", clickedNoteId);
        }

        if (e.target.closest(".all-entries__note-title")) {
            if (e.target.tagName !== "DIV") return; // this check is needed because I put input there to edit
            const currentValue = e.target.closest(".all-entries__note-title").textContent;
            handler("edit title", clickedNoteId, currentValue);
        }

        if (e.target.closest(".all-entries__note-text")) {
            if (e.target.tagName !== "DIV") return; // this check is needed because I put textarea there to edit
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
            const offset = parseInt(headerHeight) + parseInt(headerMarginBottom); // offset from the top of the page to the beginning of the scrollable container

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
                Visual.miniatureClicked = true; // needed to prevent highlighting the found note every time when scrolling happens
            }
        }
    });
}

// ================================================================================================

// listen to the blur event on any input in the All Entries section -- do I use it anywhere?...
function listenToBlurAllNotes(handler) {
    Visual.allEntriesSection.querySelectorAll("input").forEach((input) => {
        input.addEventListener("blur", (e) => {
            // if (Visual.allEntriesSection.classList.contains("hidden")) return;
            // console.log(`listenToBlurAllNotes`, e.target);
        });
    });
}

// ================================================================================================

// handle the actions menu: Change color, Export notes, Import notes
function handleActionsMenu(handler) {
    Visual.actionsMenu.addEventListener("click", (e) => {
        if (!e.target.classList.contains("action-action")) return;
        const actionType = e.target.textContent.trim().toLowerCase();
        handler(actionType);
    });
}

// ================================================================================================

// listen to (auto) scroll that can happen when you are in View All and click on a note miniature that is not in sight: it scrolls to it
function listenToAutoScroll() {
    Visual.allEntriesBox.addEventListener("scroll", (e) => {
        // Visual.allEntriesBox is a scrollable container

        clearTimeout(Visual.scrollTimeout); // clearing timers (if any)

        if (!Visual.miniatureClicked) return; // without that it keeps highlighting the clicked note if any scrolling happens

        Visual.scrollTimeout = setTimeout(() => {
            const noteEl = document.querySelector(`.all-entries__notes [data-id="${Visual.clickedElId}"]`);
            addFindingAnimation(noteEl); // some pulsating animation to the element to which it just scrolled
        }, 200);
    });
}

// dependency of 'listenToAutoScroll'
function addFindingAnimation(noteEl) {
    if (!noteEl) return;
    noteEl.style.animation = "shine 1s linear 0s 2"; // animation: name duration timing-function delay iteration-count direction fill-mode;
    Visual.miniatureClicked = false;
    setTimeout(() => {
        noteEl.style.animation = "none";
    }, 2000);
}

// ================================================================================================

// handle submitting the search form
function handleSearchForm(handler) {
    Visual.searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputValue = Visual.searchInput.value;
        handler(inputValue);
    });
}

// ================================================================================================

// handle typing in the search field
function handleSearchInput() {
    Visual.searchInput.addEventListener("input", function (e) {
        if (this.value.length === 0) {
            // if the search input is empty, unhide all notes and all miniatures
            Visual.showAllMinisNotes();
        }
    });
}

// ================================================================================================

// react to file import
function reactToFileInput(handler) {
    Visual.fileInputEl.addEventListener("change", handler); // reacting to the import event
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
    handleSearchInput,
    reactToFileInput,
};

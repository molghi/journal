import { Logic, Visual } from "../../Controller.js";

// ================================================================================================

// main function here, a router function -- handle clicks that happen in View All
function allNotesHandler(typeOfAction, clickedElId, currentValue, event) {
    if (typeOfAction === "delete") {
        deleteNote(clickedElId);
    } else if (typeOfAction === "edit title") {
        editTitle(clickedElId, currentValue);
    } else if (typeOfAction === "edit text") {
        editText(clickedElId, event);
    } else if (typeOfAction === "edit keywords") {
        editKeywords(clickedElId);
    } else if (typeOfAction === `scroll to note`) {
        scrollToNote(clickedElId);
    } else if (typeOfAction === `filter by keywords`) {
        filterByKeywords(clickedElId);
    }
}

// ================================================================================================

// dependency of 'allNotesHandler'
function replaceTitleEditInput(e) {
    const blurredInput = e.target; // the input that just was blurred
    const blurredInputParent = blurredInput.parentElement; // its parent el
    const blurredInputNoteId = blurredInput.closest(".all-entries__note").dataset.id; // the id of its note
    const noteText = blurredInput.closest(".all-entries__note").querySelector(".all-entries__note-text").textContent.slice(0, 50); // getting the note text to update the miniature later

    const newInputValue = blurredInput.value || "Journal Entry"; // getting the value of that input
    blurredInputParent.innerHTML = newInputValue; // and putting it there as text instead of that input (removing the input)
    blurredInput.removeEventListener("blur", replaceTitleEditInput);

    Logic.editNote("title", blurredInputNoteId, newInputValue); // updating in state and LS
    const thisMiniatureEl = document.querySelector(`.all-entries__browser div[data-id="${blurredInputNoteId}"]`); // updating the miniature
    thisMiniatureEl.innerHTML = newInputValue;
    thisMiniatureEl.setAttribute("title", `Title: ${newInputValue.slice(0, 50)}\nNote: ${noteText}...`);
}

// ================================================================================================

// dependency of 'allNotesHandler'
function replaceTextEditInput(e) {
    const blurredInput = e.target; // the textarea that just was blurred
    const blurredInputParent = blurredInput.parentElement; // its parent el
    const blurredInputNoteId = blurredInput.closest(".all-entries__note").dataset.id; // the id of its note
    const titleText = blurredInput
        .closest(".all-entries__note")
        .querySelector(".all-entries__note-title")
        .textContent.slice(0, 50); // getting the title text to update the miniature later

    const newInputValue = blurredInput.value.replaceAll("\n", "<br>") || "..."; // getting the value of that input and replacing for div to show it right
    blurredInputParent.innerHTML = newInputValue; // putting it there as text instead of that textarea (removing the textarea)
    blurredInput.removeEventListener("blur", replaceTextEditInput);

    Logic.editNote("text", blurredInputNoteId, newInputValue); // updating in state and LS
    const thisMiniatureEl = document.querySelector(`.all-entries__browser div[data-id="${blurredInputNoteId}"]`); // updating the miniature
    thisMiniatureEl.setAttribute("title", `Title: ${titleText}\nNote: ${newInputValue.replaceAll("<br>", " ").slice(0, 50)}...`); // updating the title attr
}

// ================================================================================================

// dependency of 'allNotesHandler'
function deleteNote(clickedElId) {
    const answer = confirm("Are you sure you want to delete it?");
    if (!answer) return;

    Logic.deleteNote(clickedElId); // delete from state and LS
    const miniatureElToRemove = document.querySelector(`.all-entries__browser div[data-id="${clickedElId}"]`); // removing from the UI
    const noteElToRemove = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"]`);
    miniatureElToRemove.remove();
    noteElToRemove.remove();

    const notesNumber = Logic.getStateNotes().length; // getting how many notes I have
    if (notesNumber === 0) {
        Visual.showMessage("notification", "Nothing here yet...");
        Visual.toggleAllEntriesElements("hide"); // toggling the visibility of .search and .all-entries__box
        return;
    }
    Visual.updateSearchPlaceholder(notesNumber);
}

// ================================================================================================

// dependency of 'allNotesHandler'
function scrollToNote(clickedElId) {
    Visual.clickedElId = clickedElId;

    const noteEl = document.querySelector(`.all-entries__notes [data-id="${clickedElId}"]`);

    if (noteEl) {
        noteEl.scrollIntoView({
            behavior: "smooth", // Smooth scroll
        });
    }
}

// ================================================================================================

// dependency of 'allNotesHandler'
function editTitle(clickedElId, currentValue) {
    const titleEl = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"] .all-entries__note-title`); // finding that title el, not miniature

    const inputEdit = document.createElement("input"); // creating new input
    inputEdit.classList.add("input-edit");
    inputEdit.style.width = `100%`;
    inputEdit.value = currentValue; // value assign

    titleEl.innerHTML = ``; // removing the text that that title el has now...
    titleEl.appendChild(inputEdit); // ...and putting there the input instead
    inputEdit.focus(); // focusing it
    inputEdit.addEventListener("blur", replaceTitleEditInput); // listening to the blur event when we need to update the values

    const dateUpdated = Logic.changeModified(clickedElId); // updating noteobj's modified date
    const elUpdated = document.querySelector(`.all-entries__note[data-id="${clickedElId}"]`);
    Visual.updateNoteDate(dateUpdated, elUpdated); // updating in UI
}

// ================================================================================================

// dependency of 'allNotesHandler'
function editText(clickedElId, event) {
    const textEl = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"] .all-entries__note-text`); // finding that text el
    const textElheight = window.getComputedStyle(textEl).height; // getting its current height

    const text = Logic.getNoteText(clickedElId).replaceAll("<br>", "\n"); // getting the text of this note from state and replacing <br> for textarea

    const inputEdit = document.createElement("textarea"); // creating new textarea
    inputEdit.classList.add("input-edit", "textarea-edit");
    inputEdit.value = text; // value assign

    textEl.innerHTML = ``; // removing the text that that text el has now...
    textEl.appendChild(inputEdit); // ...and putting there the textarea instead

    // inputEdit.style.height = textElheight; // making it the same height as before
    inputEdit.addEventListener("blur", replaceTextEditInput); // listening to the blur event when we need to update the values

    // dynamically resizing textarea: ensuring textarea grows as I type
    const scrollableContainer = document.querySelector(".all-entries__notes");
    const block = inputEdit.closest(".all-entries__note");
    // inputEdit.style.height = "auto"; // Reset height to auto to adjust
    const vhItTakes = 0.63;
    const visibleHeight = window.innerHeight * vhItTakes;
    // inputEdit.style.height = inputEdit.scrollHeight <= visibleHeight ? inputEdit.scrollHeight + "px" : visibleHeight + "px"; // scrollHeight gives the total height of the content, including overflow
    inputEdit.style.height = visibleHeight + "px";

    inputEdit.focus(); // focusing it

    const blockTopRelativeToContainer = block.getBoundingClientRect().top - scrollableContainer.getBoundingClientRect().top; // Get the position of the block relative to the container
    scrollableContainer.scrollTop += blockTopRelativeToContainer; // Scroll to bring the block to the top of the container

    inputEdit.addEventListener("input", function () {
        // inputEdit.style.height = "auto"; // doing the same when the input event happens
        // const visibleHeight = window.innerHeight * vhItTakes;
        // inputEdit.style.height = inputEdit.scrollHeight <= visibleHeight ? inputEdit.scrollHeight + "px" : visibleHeight + "px"; // scrollHeight gives the total height of the content, including overflow
        // inputEdit.style.height = inputEdit.scrollHeight + "px";

        const dateUpdated = Logic.changeModified(clickedElId); // updating noteobj's modified date
        const elUpdated = document.querySelector(`.all-entries__note[data-id="${clickedElId}"]`);
        Visual.updateNoteDate(dateUpdated, elUpdated); // updating in UI
    });
}

// ================================================================================================

// dependency of 'allNotesHandler'
function editKeywords(clickedElId) {
    const keywords = Logic.getKeywords(clickedElId); // getting the keywords of this note from the state
    const keywordsString =
        keywords && Array.isArray(keywords) ? keywords.join(", ") : keywords && !Array.isArray(keywords) ? keywords : ""; // making a string of stored keywords

    const answer = prompt("Edit your keywords: (if more than one, separate by commas)", keywordsString); // prompting and pre-filling the input field in the prompt
    if (answer === null) return; // means user clicked Cancel in the prompt window

    const currentNoteEl = document.querySelector(`.all-entries__notes [data-id="${clickedElId}"]`); // finding the current note el
    const currentKeywordsEl = currentNoteEl.querySelector(".all-entries__note-keywords"); // and its keyword child el

    const newKeywords = Logic.editNote("keywords", clickedElId, answer); // updating/editing  in state and LS

    // updating in the UI:
    if (Array.isArray(newKeywords)) {
        currentKeywordsEl.innerHTML = `<span title="Click to edit keywords">Keywords: </span>${newKeywords
            .map((key) => `<button class="all-entries__note-keyword">${key}</button>`)
            .join("")}`;
    } else if (newKeywords) {
        currentKeywordsEl.innerHTML = `<span title="Click to edit keywords">Keywords: </span><button class="all-entries__note-keyword">${newKeywords}</button>`;
    } else {
        currentKeywordsEl.innerHTML = `<span title="Click to edit keywords">Keywords: </span>`;
    }

    const dateUpdated = Logic.changeModified(clickedElId); // updating noteobj's modified date
    const elUpdated = document.querySelector(`.all-entries__note[data-id="${clickedElId}"]`);
    Visual.updateNoteDate(dateUpdated, elUpdated); // updating in UI
}

// ================================================================================================

function filterByKeywords(clickedKeyword) {
    const notesToHide = Logic.getStateNotes().filter((noteObj) => !noteObj.keywords.includes(clickedKeyword)); // those the 'keywords' of which have no 'clickedKeyword'
    [...document.querySelectorAll(`.all-entries__note`)].forEach((x) => x.classList.remove("hidden"));
    [...document.querySelectorAll(`.all-entries__miniature`)].forEach((x) => x.classList.remove("hidden"));
    notesToHide.forEach((note) => {
        document.querySelector(`.all-entries__note[data-id="${note.id}"]`).classList.add("hidden");
        document.querySelector(`.all-entries__miniature[data-id="${note.id}"]`).classList.add("hidden");
    });
    Visual.searchInput.value = `keyword:${clickedKeyword}`;
}

// ================================================================================================

export default allNotesHandler;

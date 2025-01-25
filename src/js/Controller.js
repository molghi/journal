// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs on app start
function init() {
    const [year, month, date, hours, minutes] = Logic.getCurrentTime(); // getting now time
    Visual.renderTimeElement(year, month, date, hours, minutes); // rendering time element (bottom left)
    Visual.renderFormDateEl(year, month, date); // rendering date input in form

    Logic.tickTime(Visual.renderTimeElement); // updating time every 60 seconds
    Visual.setAccentColor(Logic.getAccentColor()); // changing the accent color if it was saved to LS

    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.listenToBlur();
    Visual.handleFormSubmit(onFormSubmit);
    Visual.listenKeyPresses(keyHandler);
    Visual.handleHeaderNav(navHandler);
    Visual.handleAllNotesActions(allNotesHandler);
    Visual.listenToBlurAllNotes();
    Visual.handleActionsMenu(actionsHandler);
}

// ================================================================================================

// happens upon journal form submit
function onFormSubmit(dateInput, keywordsInput, titleInput, textareaInput) {
    const [inputOk, msg] = Logic.validateInput([dateInput, keywordsInput, titleInput, textareaInput]);
    if (!inputOk) return Visual.showMessage("error", msg);
    Logic.addNote(dateInput, keywordsInput, titleInput, textareaInput); // adding to state and LS
    Visual.showMessage("success", "Submitted!");
    Visual.resetFormFields(); // resetting all form fields
    const [year, month, date] = Logic.getRefreshTime();
    Visual.renderFormDateEl(year, month, date); // putting the today date in the form
}

// ================================================================================================

function keyHandler(typeOfAction) {
    if (typeOfAction === "submit") {
        const [dateInput, keywordsInput, titleInput, textareaInput] = Visual.getFormInputValues();
        onFormSubmit(dateInput, keywordsInput, titleInput, textareaInput);
    }
}

// ================================================================================================

function navHandler(clickedEl) {
    const clickedElText = clickedEl.textContent;
    clickedEl.classList.add("active");
    if (clickedElText === "Add New") {
        // show form, hide all
        clickedEl.nextElementSibling.classList.remove("active");
        Visual.toggleFormNotes("form");
    } else {
        // hide form, render all
        clickedEl.previousElementSibling.classList.remove("active");
        Visual.toggleFormNotes("all notes");
        Visual.clearAllNotes(); // clearing all before re-rendering them
        const allNoteTitles = Logic.getStateNotes().map((noteObj) => noteObj.title);
        const allNoteIds = Logic.getStateNotes().map((noteObj) => noteObj.id);
        const allContentIds = Logic.getStateNotes().map((noteObj) => noteObj.note.slice(0, 50));
        Visual.renderEntriesBrowser(allNoteTitles, allNoteIds, allContentIds); // rendering all miniatures
        const allNotesCopy = JSON.parse(JSON.stringify(Logic.getStateNotes())).reverse(); // reversing the order of notes: all the new ones will be at the top
        allNotesCopy.forEach((noteObj) => Visual.renderNote(noteObj));
    }
}

// ================================================================================================

function allNotesHandler(typeOfAction, clickedElId, currentValue) {
    if (typeOfAction === "delete") {
        const answer = confirm("Are you sure you want to delete it?");
        if (!answer) return;
        Logic.deleteNote(clickedElId); // delete from state and LS
        const miniatureElToRemove = document.querySelector(`.all-entries__browser div[data-id="${clickedElId}"]`); // removing from the UI
        const noteElToRemove = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"]`);
        miniatureElToRemove.remove();
        noteElToRemove.remove();
    } else if (typeOfAction === "edit title") {
        const titleEl = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"] .all-entries__note-title`); // finding that title el, not miniature
        const inputEdit = document.createElement("input"); // creating new input
        inputEdit.classList.add("input-edit");
        inputEdit.value = currentValue; // value assign
        titleEl.innerHTML = ``; // removing the text that that title el has now...
        titleEl.appendChild(inputEdit); // ...and putting there the input instead
        inputEdit.focus(); // focusing it
        inputEdit.addEventListener("blur", replaceTitleEditInput); // listening to the blur event when we need to update the values
    } else if (typeOfAction === "edit text") {
        const textEl = document.querySelector(`.all-entries__notes div[data-id="${clickedElId}"] .all-entries__note-text`); // finding that text el
        const textElheight = window.getComputedStyle(textEl).height;
        const text = Logic.getNoteText(clickedElId).replaceAll("<br>", "\n"); // getting the text of this note from state and replacing <br> for textarea
        const inputEdit = document.createElement("textarea"); // creating new textarea
        inputEdit.classList.add("input-edit", "textarea-edit");
        inputEdit.value = text; // value assign
        textEl.innerHTML = ``; // removing the text that that text el has now...
        textEl.appendChild(inputEdit); // ...and putting there the textarea instead
        inputEdit.style.height = textElheight; // making it the same height as before
        inputEdit.focus(); // focusing it
        inputEdit.addEventListener("blur", replaceTextEditInput); // listening to the blur event when we need to update the values
    }
}

// ================================================================================================

// dependency of 'allNotesHandler'
function replaceTitleEditInput(e) {
    const blurredInput = e.target; // the input that just was blurred
    const blurredInputParent = blurredInput.parentElement; // its parent el
    const blurredInputNoteId = blurredInput.closest(".all-entries__note").dataset.id; // the id of its note
    const newInputValue = blurredInput.value; // getting the value of that input
    blurredInputParent.innerHTML = newInputValue; // and putting it there as text instead of that input (removing the input)
    blurredInput.removeEventListener("blur", replaceTitleEditInput);
    Logic.editNote("title", blurredInputNoteId, newInputValue); // updating in state and LS
    const thisMiniatureEl = document.querySelector(`.all-entries__browser div[data-id="${blurredInputNoteId}"]`); // updating the miniature
    thisMiniatureEl.innerHTML = newInputValue;
}

// ================================================================================================

function replaceTextEditInput(e) {
    const blurredInput = e.target; // the textarea that just was blurred
    const blurredInputParent = blurredInput.parentElement; // its parent el
    const blurredInputNoteId = blurredInput.closest(".all-entries__note").dataset.id; // the id of its note
    const newInputValue = blurredInput.value.replaceAll("\n", "<br>"); // getting the value of that input and replacing for div to show it right
    blurredInputParent.innerHTML = newInputValue; // putting it there as text instead of that textarea (removing the textarea)
    blurredInput.removeEventListener("blur", replaceTextEditInput);
    Logic.editNote("text", blurredInputNoteId, newInputValue); // updating in state and LS
    const thisMiniatureEl = document.querySelector(`.all-entries__browser div[data-id="${blurredInputNoteId}"]`); // updating the miniature
    thisMiniatureEl.setAttribute("title", `Note: ${newInputValue.replaceAll("<br>", " ").slice(0, 50)}...`);
}

// ================================================================================================

function actionsHandler(typeOfAction) {
    if (typeOfAction === "change color") {
        const newColor = Visual.promptAccentChange();
        const checkedColor = Logic.checkNewColor(newColor);
        Visual.setAccentColor(checkedColor);
        Logic.setAccentColor(checkedColor);
    }
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };

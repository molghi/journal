// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

// importing dependencies:
import {
    renderTimeElement,
    renderFormDateEl,
    showMessage,
    renderEntriesBrowser,
    renderNote,
} from "./view-dependencies/renderMethods.js";

import {
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
} from "./view-dependencies/eventHandlers.js";

import listenKeyPresses from "./view-dependencies/keyCommands.js";

// ================================================================================================

class View {
    constructor() {
        this.journalFormSection = document.querySelector(".journal__form-box");
        this.containerEl = document.querySelector(".container");
        this.formEl = document.querySelector(".journal__form");
        this.formDateInput = document.querySelector("#form-input-date");
        this.formKeywordsInput = document.querySelector("#form-input-keywords");
        this.formTitleInput = document.querySelector("#form-input-title");
        this.formTextareaInput = document.querySelector("#form-input-content");
        this.timeEl = document.querySelector(".time");
        this.headerNavEl = document.querySelector(".header__nav");
        this.allEntriesSection = document.querySelector(".all-entries");
        this.allEntriesBrowser = document.querySelector(".all-entries__browser");
        this.allEntriesBox = document.querySelector(".all-entries__notes");
        this.actionsMenu = document.querySelector(".actions-menu");
        this.searchForm = document.querySelector(".search__form");
        this.searchInput = document.querySelector(".search__input");
        this.searchSection = document.querySelector(".search");
        this.allEntriesWrapper = document.querySelector(".all-entries__box");
        this.fileInputEl = document.querySelector(".importer");

        this.scrollTimeout = "";
        this.clickedElId = 0;
        this.lastScrollTop = 0;
        this.scrollBoxDisplacement = 0;
    }

    // ================================================================================================

    // render the current time at the bottom left
    renderTimeElement(year, month, date, hours, minutes, seconds) {
        renderTimeElement(year, month, date, hours, minutes, seconds);
    }

    // ================================================================================================

    // render the date input of the main form
    renderFormDateEl(year, month, date) {
        renderFormDateEl(year, month, date);
    }

    // ================================================================================================

    // listen to the blur event (in the form where one adds new notes) on all inputs inside the form: if it happens change styles on label el
    listenToBlur() {
        listenToBlur();
    }

    // ================================================================================================

    // handle the submit of the form to add new notes
    handleFormSubmit(handler) {
        handleFormSubmit(handler);
    }

    // ================================================================================================

    // show message in the UI
    showMessage(type, text, timeout, position) {
        showMessage(type, text, timeout, position);
    }

    // ================================================================================================

    resetFormFields() {
        const fields = [this.formDateInput, this.formKeywordsInput, this.formTitleInput, this.formTextareaInput];
        fields.forEach((field) => (field.value = ""));
    }

    // ================================================================================================

    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

    // handle key commands: specific key combos for some actions
    listenKeyPresses(handler) {
        listenKeyPresses(handler);
    }

    // ================================================================================================

    getFormInputValues() {
        const dateInput = this.formDateInput.value;
        const keywordsInput = this.formKeywordsInput.value;
        const titleInput = this.formTitleInput.value;
        const textareaInput = this.formTextareaInput.value;
        return [dateInput, keywordsInput, titleInput, textareaInput];
    }

    // ================================================================================================

    // handle clicks in the .header section (btns Add New and View All)
    handleHeaderNav(handler) {
        handleHeaderNav(handler);
    }

    // ================================================================================================

    toggleFormNotes(showWhat = "form") {
        if (showWhat === "form") {
            // showing the form, hiding all notes
            this.allEntriesSection.style.animation = "hide 0.2s linear";
            setTimeout(() => {
                this.allEntriesSection.classList.add("hidden");
                this.allEntriesSection.style.animation = "none";
                this.journalFormSection.style.animation = "reveal 0.2s linear";
                this.journalFormSection.classList.remove("hidden");
                setTimeout(() => {
                    this.journalFormSection.style.animation = "none";
                }, 200);
            }, 190);
        } else {
            // showing all notes, hiding the form
            this.journalFormSection.style.animation = "hide 0.2s linear";
            setTimeout(() => {
                this.journalFormSection.classList.add("hidden");
                this.journalFormSection.style.animation = "none";
                this.allEntriesSection.style.animation = "reveal 0.2s linear";
                this.allEntriesSection.classList.remove("hidden");
                setTimeout(() => {
                    this.allEntriesSection.style.animation = "none";
                }, 200);
            }, 190);
        }
    }

    // ================================================================================================

    // render miniature elements
    renderEntriesBrowser(titlesArr, idsArr, allContentIds) {
        renderEntriesBrowser(titlesArr, idsArr, allContentIds);
    }

    // ================================================================================================

    // render one note element
    renderNote(noteObj) {
        renderNote(noteObj);
    }

    // ================================================================================================

    clearAllNotes() {
        this.allEntriesBox.innerHTML = "";
    }

    // ================================================================================================

    // handle clicks that happen in View All
    handleAllNotesActions(handler) {
        handleAllNotesActions(handler);
    }

    // ================================================================================================

    // listen to the blur event on any input in the All Entries section -- do I use it anywhere?...
    listenToBlurAllNotes(handler) {
        listenToBlurAllNotes(handler);
    }

    // ================================================================================================

    // handle the actions menu: Change color, Export notes, Import notes
    handleActionsMenu(handler) {
        handleActionsMenu(handler);
    }

    // ================================================================================================

    // prompt the form to change the accent color of the interface
    promptAccentChange() {
        const newColor = prompt("Type your new interface color:");
        if (newColor && newColor.length > 0) newColor.trim();
        return newColor;
    }

    // ================================================================================================

    // change the accent color of the interface
    setAccentColor(color) {
        if (!color) return;
        document.documentElement.style.setProperty("--accent", color); // changing the accent colour
    }

    // ================================================================================================

    // listen to auto scroll that can happen when you are in View All and click on some note miniature
    listenToAutoScroll() {
        listenToAutoScroll();
    }

    // ================================================================================================

    // handle submitting the search form
    handleSearchForm(handler) {
        handleSearchForm(handler);
    }

    // ================================================================================================

    updateSearchPlaceholder(notesNum) {
        if (notesNum < 2) {
            this.searchInput.classList.add("hidden");
            // this.searchInput.setAttribute("placeholder", `Add a few notes to search among them...`);
        } else {
            this.searchInput.classList.remove("hidden");
            this.searchInput.setAttribute("placeholder", `Search among ${notesNum} notes...`);
        }
    }

    // ================================================================================================

    // show all miniature els and note els
    showAllMinisNotes() {
        const allMiniatureEls = [...document.querySelectorAll(".all-entries__miniature")];
        const allNoteEls = [...document.querySelectorAll(".all-entries__note")];
        allMiniatureEls.forEach((el) => el.classList.remove("hidden"));
        allNoteEls.forEach((el) => el.classList.remove("hidden"));
    }

    // ================================================================================================

    // basically, hide all miniature els and note els
    filterNotes(idsArr) {
        this.showAllMinisNotes(); // unhiding all first
        const allMiniatureEls = [...document.querySelectorAll(".all-entries__miniature")];
        const allNoteEls = [...document.querySelectorAll(".all-entries__note")];
        const miniaturesToHide = allMiniatureEls.filter((miniatureEl) => !idsArr.includes(+miniatureEl.dataset.id)); // return those that are not in idsArr
        const notesToHide = allNoteEls.filter((miniatureEl) => !idsArr.includes(+miniatureEl.dataset.id));
        miniaturesToHide.forEach((el) => el.classList.add("hidden"));
        notesToHide.forEach((el) => el.classList.add("hidden"));
    }

    // ================================================================================================

    // handle typing in the search field
    handleSearchInput() {
        handleSearchInput();
    }

    // ================================================================================================

    // hiding/showing 2 sections
    toggleAllEntriesElements(showFlag = "show") {
        if (showFlag === "show") {
            this.searchSection.classList.remove("hidden");
            this.allEntriesWrapper.classList.remove("hidden");
        } else {
            this.searchSection.classList.add("hidden");
            this.allEntriesWrapper.classList.add("hidden");
        }
    }

    // ================================================================================================

    // react to file import
    reactToFileInput(handler) {
        reactToFileInput(handler);
    }

    // ================================================================================================

    // moving all labels into the input fields
    resetFormLabels() {
        const allLabelEls = [...this.formEl.querySelectorAll("label")];
        allLabelEls.shift(); // removing the first one (the date input) as it's always pre-filled (not empty)
        allLabelEls.forEach((labelEl) => labelEl.classList.remove("moved-up"));
    }

    // ================================================================================================
}

export default View;

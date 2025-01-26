// View is responsible for everything that happens on the screen: rendering and all visual interactions with any elements

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
    handleSeachInput,
} from "./view-dependencies/eventHandlers.js";
import listenKeyPresses from "./view-dependencies/keyCommands.js";

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

        this.scrollTimeout = "";
        this.clickedElId = 0;
        this.lastScrollTop = 0;

        this.scrollBoxDisplacement = 0;
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

    handleFormSubmit(handler) {
        handleFormSubmit(handler);
    }

    // ================================================================================================

    showMessage(type, text) {
        showMessage(type, text);
    }

    // ================================================================================================

    resetFormFields() {
        this.formDateInput.value = "";
        this.formKeywordsInput.value = "";
        this.formTitleInput.value = "";
        this.formTextareaInput.value = "";
    }

    // ================================================================================================

    removeMessages() {
        if (document.querySelector(".message")) document.querySelector(".message").remove();
    }

    // ================================================================================================

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

    handleHeaderNav(handler) {
        handleHeaderNav(handler);
    }
    // ================================================================================================

    toggleForm(flag = "show") {
        if (flag === "show") {
            this.journalFormSection.style.animation = "reveal 0.3s linear";
            this.journalFormSection.classList.remove("hidden");
            setTimeout(() => {
                this.journalFormSection.style.animation = "none";
            }, 300);
        } else {
            this.journalFormSection.style.animation = "hide 0.3s linear";
            setTimeout(() => {
                this.journalFormSection.classList.add("hidden");
                this.journalFormSection.style.animation = "none";
            }, 300);
        }
    }

    // ================================================================================================

    toggleAllNotes(flag = "show") {
        if (flag === "show") {
            this.allEntriesSection.style.animation = "reveal 0.3s linear";
            this.allEntriesSection.classList.remove("hidden");
            setTimeout(() => {
                this.allEntriesSection.style.animation = "none";
            }, 300);
        } else {
            this.allEntriesSection.style.animation = "hide 0.3s linear";
            setTimeout(() => {
                this.allEntriesSection.classList.add("hidden");
                this.allEntriesSection.style.animation = "none";
            }, 300);
        }
    }

    // ================================================================================================

    toggleFormNotes(showWhat = "form") {
        if (showWhat === "form") {
            this.allEntriesSection.style.animation = "hide 0.2s linear";
            setTimeout(() => {
                this.allEntriesSection.classList.add("hidden");
                this.allEntriesSection.style.animation = "none";
                this.journalFormSection.style.animation = "reveal 0.2s linear";
                this.journalFormSection.classList.remove("hidden");
                setTimeout(() => {
                    this.journalFormSection.style.animation = "none";
                }, 200);
            }, 200);
        } else {
            // showing all notes
            this.journalFormSection.style.animation = "hide 0.2s linear";
            setTimeout(() => {
                this.journalFormSection.classList.add("hidden");
                this.journalFormSection.style.animation = "none";
                this.allEntriesSection.style.animation = "reveal 0.2s linear";
                this.allEntriesSection.classList.remove("hidden");
                setTimeout(() => {
                    this.allEntriesSection.style.animation = "none";
                }, 200);
            }, 200);
        }
    }

    // ================================================================================================

    renderEntriesBrowser(titlesArr, idsArr, allContentIds) {
        renderEntriesBrowser(titlesArr, idsArr, allContentIds);
    }

    // ================================================================================================

    renderNote(noteObj) {
        renderNote(noteObj);
    }

    // ================================================================================================

    clearAllNotes() {
        this.allEntriesBox.innerHTML = "";
    }

    // ================================================================================================

    handleAllNotesActions(handler) {
        handleAllNotesActions(handler);
    }

    // ================================================================================================

    listenToBlurAllNotes(handler) {
        listenToBlurAllNotes(handler);
    }

    // ================================================================================================

    handleActionsMenu(handler) {
        handleActionsMenu(handler);
    }

    // ================================================================================================

    promptAccentChange() {
        const newColor = prompt("Type your new interface color:");
        if (newColor && newColor.length > 0) newColor.trim();
        return newColor;
    }

    // ================================================================================================

    setAccentColor(color) {
        document.documentElement.style.setProperty("--accent", color); // changing the accent colour
    }

    // ================================================================================================

    listenToAutoScroll() {
        listenToAutoScroll();
    }

    // ================================================================================================

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

    filterNotes(idsArr) {
        this.showAllMinisNotes(); // unhiding all first
        const allMiniatureEls = [...document.querySelectorAll(".all-entries__miniature")];
        const allNoteEls = [...document.querySelectorAll(".all-entries__note")];
        const miniaturesToHide = allMiniatureEls.filter((miniatureEl) => !idsArr.includes(+miniatureEl.dataset.id));
        const notesToHide = allNoteEls.filter((miniatureEl) => !idsArr.includes(+miniatureEl.dataset.id));
        miniaturesToHide.forEach((el) => el.classList.add("hidden"));
        notesToHide.forEach((el) => el.classList.add("hidden"));
    }

    // ================================================================================================

    handleSeachInput() {
        handleSeachInput();
    }

    // ================================================================================================

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
}

export default View;

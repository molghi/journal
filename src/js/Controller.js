// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// importing dependencies:
import processInput from "./modules/controller-dependencies/import.js";
import navHandler from "./modules/controller-dependencies/navHandler.js";
import allNotesHandler from "./modules/controller-dependencies/allNotesHandler.js";
import actionsHandler from "./modules/controller-dependencies/actionsHandler.js";

// ================================================================================================

// runs on app start
function init() {
    Visual.revealOnAppStart(); // revealing the Add New form smoothly on page refresh
    const [year, month, date, hours, minutes] = Logic.getCurrentTime(); // getting now time
    Visual.renderTimeElement(year, month, date, hours, minutes); // rendering time element (bottom left)
    Visual.renderFormDateEl(year, month, date); // rendering date input in the Add New form

    Logic.tickTime(Visual.renderTimeElement); // updating time every 60 seconds
    Visual.setAccentColor(Logic.getAccentColor()); // changing the accent color if it was saved to LS

    Logic.hourlyTimer(() => {
        const [year, month, date, hours, minutes] = Logic.getCurrentTime();
        Visual.formDateInput.value = `${date}/${month}/${year.toString().slice(2)}`; // updating form date input every hour
    });

    runEventListeners();
}
init();

// ================================================================================================

// running main event listeners
function runEventListeners() {
    Visual.listenToBlur(); // listen to the blur event (in the form where one adds new notes) on all inputs inside the form: if it happens, change styles on the label el
    Visual.handleFormSubmit(onFormSubmit); // handle the submit of the form to add new notes
    Visual.listenKeyPresses(keyHandler); // handle key commands: specific key combos for some actions
    Visual.handleHeaderNav(navHandler); // handle clicks in the .header section (btns Add New and View All)
    Visual.handleAllNotesActions(allNotesHandler); // handle clicks that happen in View All
    Visual.listenToBlurAllNotes(); // listen to the blur event on any input in the All Entries section -- do I use it anywhere?...
    Visual.handleActionsMenu(actionsHandler); // handle the actions menu: Change color, Export notes, Import notes
    Visual.listenToAutoScroll(); // listen to auto scroll that can happen when you are in View All and click on some note miniature
    Visual.handleSearchForm(searchNotes); // handle submitting the search form
    Visual.handleSearchInput(); // handle typing in the search form
    Visual.reactToFileInput(processInput); // react to the file import event
}

// ================================================================================================

// happens upon journal form submit, adding a new note
function onFormSubmit(dateInput, keywordsInput, titleInput, textareaInput) {
    console.log(dateInput, keywordsInput, titleInput, textareaInput);
    const [inputOk, msg] = Logic.validateInput([dateInput, keywordsInput, titleInput, textareaInput]);
    if (!inputOk) return Visual.showMessage("error", msg);
    Logic.addNote(dateInput, keywordsInput, titleInput, textareaInput); // adding to state and LS
    Visual.showMessage("success", "Submitted!");
    Visual.resetFormFields(); // resetting all form fields
    Visual.resetFormLabels(); // moving all labels into the input fields
    const [year, month, date] = Logic.getRefreshTime();
    Visual.renderFormDateEl(year, month, date); // putting the today date in the form
}

// ================================================================================================

// handle key commands: specific key combos for some actions: cmd/ctrl+enter submits a new note
function keyHandler(typeOfAction) {
    if (typeOfAction === "submit") {
        const [dateInput, keywordsInput, titleInput, textareaInput] = Visual.getFormInputValues();
        onFormSubmit(dateInput, keywordsInput, titleInput, textareaInput);
    }
    // else if (typeOfAction === "edit textarea enter") {
    //     console.log(document.querySelector(".textarea-edit").style.height);
    //     console.log(document.querySelector(".textarea-edit").scrollHeight);
    //     // document.querySelector(".textarea-edit").style.height = "auto";
    //     // document.querySelector(".textarea-edit").style.height = document.querySelector(".textarea-edit").scrollHeight + "px";
    // } else if (typeOfAction === "edit textarea backspace") {
    //     console.log(document.querySelector(".textarea-edit").style.height);
    //     // document.querySelector(".textarea-edit").style.height = "auto";
    // }
}

// ================================================================================================

// runs upon submitting the search form
function searchNotes(inputValue) {
    const filteredNotesIds = Logic.filterNotes(inputValue); // finding those notes that satisfy the input criterion: those that contain it
    Visual.filterNotes(filteredNotesIds); // hiding all that don't contain the inputValue
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };

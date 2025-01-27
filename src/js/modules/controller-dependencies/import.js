import { Logic, Visual } from "../../Controller";

// ================================================================================================

function processInput(event) {
    const file = event.target.files[0]; // Get the file
    if (!file) return; // Ensure there's a file selected

    const reader = new FileReader(); // Create FileReader instance

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result); // Parse the JSON content
            const isValidInput = checkValidInput(jsonData);

            if (!isValidInput) {
                Visual.showMessage(
                    "error",
                    `Invalid JSON! Check the formatting: you can import JSON formatted the same as what you can export.`,
                    10000
                );
                return console.error(
                    `Invalid JSON!\nPerhaps the formatting of the file was wrong...\nYou can import JSON formatted the same as what you can export.`
                );
            }

            addFromImported(jsonData); // adding to the state and pushing to LS
            Visual.showMessage("success", "Import successful!", undefined, "bottom");

            if (!Visual.allEntriesSection.classList.contains("hidden")) {
                // means I am viewing all notes now and they must be updated (re-rendered)
                const updatedNotes = Logic.getStateNotes();
                const allNoteTitles = updatedNotes.map((noteObj) => noteObj.title);
                const allNoteIds = updatedNotes.map((noteObj) => noteObj.id);
                const allContentIds = updatedNotes.map((noteObj) => noteObj.note.slice(0, 50));
                Visual.renderEntriesBrowser(allNoteTitles, allNoteIds, allContentIds); // rendering all miniatures
                Visual.clearAllNotes();
                updatedNotes.forEach((noteObj) => Visual.renderNote(noteObj)); // rendering all notes
                const notesNumber = updatedNotes.length;
                Visual.updateSearchPlaceholder(notesNumber); // updating the placeholder (search form) to show how many notes there are
            }
        } catch (err) {
            console.error("Invalid input file", err); // Error handling
            Visual.showMessage(
                "error",
                `Invalid input file! You can import only JSON and it must be formatted the same as what you can export.`,
                10000
            );
            return null;
        } finally {
            Visual.fileInputEl.value = ""; // resetting the file input value to be able to import again without problems
        }
    };

    reader.readAsText(file); // Read the file as text
}

// ================================================================================================

// dependency of 'processInput' -- validating the input/imported thing -- making sure it's formatted the way I allow it
function checkValidInput(arr) {
    if (!Array.isArray(arr)) return;
    let passed = true;

    arr.forEach((noteObj) => {
        if (!noteObj.hasOwnProperty("dateInput")) return (passed = false);
        if (!noteObj.hasOwnProperty("id")) return (passed = false);
        if (!noteObj.hasOwnProperty("keywords")) return (passed = false);
        if (!noteObj.hasOwnProperty("note")) return (passed = false);
        if (!noteObj.hasOwnProperty("time")) return (passed = false);
        if (!noteObj.hasOwnProperty("title")) return (passed = false);

        if (typeof noteObj.dateInput !== "string") return (passed = false);
        if (typeof noteObj.id !== "number") return (passed = false);
        if (typeof noteObj.keywords !== "string" && !Array.isArray(noteObj.keywords)) return (passed = false);
        if (typeof noteObj.note !== "string") return (passed = false);
        if (typeof noteObj.time !== "string") return (passed = false);
        if (typeof noteObj.title !== "string") return (passed = false);
    });

    return passed;
}

// ================================================================================================

// dependency of 'processInput' --- the import was successful, so adding to the state and pushing to LS
function addFromImported(arr) {
    const stateNotesIds = Logic.getStateNotes().map((noteObj) => noteObj.id);

    // changing in state
    arr.forEach((noteObj) => {
        if (stateNotesIds.includes(noteObj.id)) {
            // state already has this note, so I replace it --> replace in it what can be changed: dateInput, keywords, note, title.
            const indexInState = Logic.getStateNotes().findIndex((stateNote) => stateNote.id === noteObj.id);
            Logic.getStateNotes()[indexInState].dateInput = noteObj.dateInput;
            Logic.getStateNotes()[indexInState].note = noteObj.note;
            Logic.getStateNotes()[indexInState].title = noteObj.title;
            Logic.getStateNotes()[indexInState].keywords = noteObj.keywords;
        } else {
            // state doesn't have this note, so I just push it
            Logic.getStateNotes().push(noteObj);
        }
    });

    // pushing to LS
    Logic.saveNotesToLS();
}

// ================================================================================================

export default processInput;

// Model is responsible for all logic in the app: all computations, calculations, and data operations

import { NULL } from "sass";
import LS from "./model-dependencies/localStorage.js";

class Model {
    #state = {
        formMode: "adding",
        notes: [],
        accentColor: "green",
    };

    constructor() {
        this.timer = "";
        this.getNotes();
        this.fetchAccentColor(); // fetching from LS and updating only the state

        console.log(this.#state.notes);
    }

    // ================================================================================================

    getState = () => this.#state;

    getRefreshTime = () => this.#state.refreshTime;

    getStateNotes = () => this.#state.notes;

    getMode = () => this.#state.formMode;

    getAccentColor = () => this.#state.accentColor;

    // ================================================================================================

    getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, 0);
        const seconds = now.getSeconds();
        this.#state.refreshTime = [year, month, date, hours, minutes];
        return [year, month, date, hours, minutes, seconds];
    }

    // ================================================================================================

    // to change the time el every 60 seconds
    tickTime(handler) {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            const [year, month, date, hours, minutes, seconds] = this.getCurrentTime();
            handler(year, month, date, hours, minutes, seconds);
        }, 60000); // every 60 sec
    }

    // ================================================================================================

    addNote(dateInput, keywordsInput, titleInput, textareaInput) {
        const newNote = {};
        newNote.time = new Date().toISOString();
        newNote.id = Date.now();
        newNote.keywords = !keywordsInput.includes(",") ? keywordsInput.trim() : keywordsInput.split(",").map((x) => x.trim());
        newNote.dateInput = dateInput.trim();
        newNote.title = titleInput.trim() || "Journal Entry";
        newNote.note = textareaInput.trim().replaceAll("\n", "<br>");
        this.#state.notes.push(newNote);
        console.log(this.#state.notes);
        LS.save("myJournal", this.#state.notes, "reference"); // push to LS a reference type
    }

    // ================================================================================================

    // returns boolean (isInputOk) and message (if there was error)
    validateInput(arr) {
        const [dateInput, keywordsInput, titleInput, textareaInput] = arr;
        // so if the date input was empty, I put there the today date -- but if it was filled, it can take only digits, dots or slashes, nothing else
        const validDateInput = /^[\d./]+$/.test(dateInput); // \d matches any digit (0–9).  . matches a literal dot.  / matches a literal slash.  + ensures one or more of the allowed characters are present.  ^ asserts the start of the string.  $ asserts the end of the string.
        if (!validDateInput) return [false, "Date input can take only digits, dots or slashes. No letters."];
        // if the keywords input was empty, okay, it can be empty -- but if it was filled, it can be one word or words separated by commas
        // if the title input was empty, I put there "Journal Entry"
        // textarea cannot be empty
        if (!textareaInput.trim()) return [false, "You cannot submit an empty note."];
        return [true, null];
    }

    // ================================================================================================

    getTodayString() {
        const [year, month, date] = this.getCurrentTime();
        return `${date}/${month}/${year.toString().slice(2)}`;
    }

    // ================================================================================================

    getNotes() {
        const fetched = LS.get("myJournal", "reference");
        if (!fetched) return;
        fetched.forEach((noteObj) => this.#state.notes.push(noteObj));
    }

    // ================================================================================================

    deleteNote(id) {
        const index = this.#state.notes.findIndex((note) => note.id === +id);
        if (index < 0) return;
        this.#state.notes.splice(index, 1);
        LS.save("myJournal", this.#state.notes, "reference"); // push to LS a reference type
    }

    // ================================================================================================

    editNote(editWhat, noteId, newValue) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        if (index < 0) return;
        if (editWhat === "title") {
            this.#state.notes[index].title = newValue;
        }
        if (editWhat === "text") {
            this.#state.notes[index].note = newValue;
        }
        if (editWhat === "keywords") {
            const newKeywords = !newValue.includes(",") ? newValue : newValue.split(",").map((x) => x.trim());
            this.#state.notes[index].keywords = newKeywords;
        }
        LS.save("myJournal", this.#state.notes, "reference"); // push to LS a reference type
        if (editWhat === "keywords") return this.#state.notes[index].keywords; // returning to re-render
    }

    // ================================================================================================

    getNoteText(noteId) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        if (index < 0) return;
        return this.#state.notes[index].note;
    }

    // ================================================================================================

    checkNewColor(newColor) {
        // mimicking DOM addition to get the computed color
        const span = document.createElement("span");
        document.body.appendChild(span);
        span.style.color = newColor;
        let color = window.getComputedStyle(span).color;
        document.body.removeChild(span);

        const rgbValues = color
            .slice(4, -1)
            .split(",")
            .map((x) => +x.trim()); // just the rgb values (r,g,b)

        if (rgbValues[0] < 40 && rgbValues[1] < 40 && rgbValues[2] < 40) return `rgb(0, 128, 0)`; // return green if it is too dark

        return color;
    }

    // ================================================================================================

    setAccentColor(color) {
        this.#state.accentColor = color;
        LS.save("myJournalAccentColor", this.#state.accentColor, "prim"); // push to LS a primitive type
    }

    // ================================================================================================

    fetchAccentColor() {
        const fetched = LS.get("myJournalAccentColor", "prim");
        if (!fetched) return;
        this.#state.accentColor = fetched;
    }

    // ================================================================================================

    // exporting as .json
    exportNotesJson() {
        const data = this.#state.notes;
        const [year, month, date, hours, minutes, seconds] = this.getCurrentTime();

        const filename = `my-notes--${date}-${month}-${year.toString().slice(2)}--${hours}-${minutes}.json`;

        const json = JSON.stringify(data, null, 2); // Converting data to JSON: Converts the JavaScript object 'data' into a formatted JSON string. The 'null, 2' arguments ensure the output is pretty-printed with 2-space indentation for readability.
        const blob = new Blob([json], { type: "application/json" }); // Creating a blob: Creates a binary large object (Blob) containing the JSON string, specifying the MIME type as 'application/json' to ensure it's recognised as a JSON file.
        const url = URL.createObjectURL(blob); // Creating a download URL: Generates a temporary URL pointing to the Blob, enabling it to be downloaded as a file by associating it with a download link.

        // Create an invisible anchor element for downloading
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Clean up the URL
    }

    // ================================================================================================

    // exporting as .txt
    exportNotesTxt() {
        const data = this.prepareForExport();
        const [year, month, date, hours, minutes, seconds] = this.getCurrentTime();

        const filename = `my-notes--${date}-${month}-${year.toString().slice(2)}--${hours}-${minutes}.txt`;

        const blob = new Blob([data], { type: "text/plain" }); // Create a Blob with the content and specify text/plain MIME type

        const anchor = document.createElement("a"); // Create a temporary anchor element
        anchor.href = URL.createObjectURL(blob); // Create an object URL for the Blob
        anchor.download = filename; // Set the filename for download

        anchor.click(); // Trigger the download

        URL.revokeObjectURL(anchor.href); // Clean up the object URL
    }

    // ================================================================================================

    // dependency of 'exportNotesTxt' -- preparing notes to be exported as .txt
    prepareForExport() {
        const separator = `---------------------------------------------------------------------`;
        const result = this.#state.notes.map((noteObj) => {
            const trueTime = new Date(noteObj.time);
            const trueDate = `${trueTime.getDate()}/${trueTime.getMonth() + 1}/${trueTime.getFullYear().toString().slice(2)}`;
            const keywords = !noteObj.keywords
                ? ""
                : !Array.isArray(noteObj.keywords)
                ? `Keywords: ${noteObj.keywords}\n\n`
                : `Keywords: ${noteObj.keywords.join(", ")}\n\n`;
            return `${noteObj.title}\n\n${noteObj.note.replaceAll("<br>", "\n")}\n\n${keywords}Date: ${
                noteObj.dateInput
            }  (${trueDate})\n\n\n${separator}\n\n\n`;
        });
        const notesNum = result.length;
        result.unshift(`Your Notes (${notesNum})\n\n\n`, separator + "\n\n\n");
        return result.join("");
    }

    // ================================================================================================

    defineYearTime(monthNum) {
        switch (monthNum) {
            case 12:
            case 1:
            case 2:
                return "Winter";
            case 3:
            case 4:
            case 5:
                return "Spring";
            case 6:
            case 7:
            case 8:
                return "Summer";
            case 9:
            case 10:
            case 11:
                return "Autumn";

            default:
                return null;
        }
    }

    // ================================================================================================

    getKeywords(noteId) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        return this.#state.notes[index].keywords;
    }

    // ================================================================================================
}

export default Model;

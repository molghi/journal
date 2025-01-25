// Model is responsible for all logic in the app: all computations, calculations, and data operations

import LS from "./model-dependencies/localStorage.js";

class Model {
    #state = {
        formMode: "adding",
        notes: [],
    };

    constructor() {
        this.timer = "";
        this.getNotes();
    }

    // ================================================================================================

    getState = () => this.#state;

    getRefreshTime = () => this.#state.refreshTime;

    getStateNotes = () => this.#state.notes;

    getMode = () => this.#state.formMode;

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
        LS.save("myJournal", this.#state.notes, "reference"); // push to LS a reference type
    }

    // ================================================================================================

    getNoteText(noteId) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        if (index < 0) return;
        return this.#state.notes[index].note;
    }

    // ================================================================================================
}

export default Model;
